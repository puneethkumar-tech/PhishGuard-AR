import pytest
from pathlib import Path
from src.services.model_service import (
    InvalidModelArtifactError,
    ModelError,
    ModelNotFoundError,
    ModelService,
    ModelUnavailableError,
)
from src.api.scans import model_service as active_model_service


class DummyMockRunner:
    """Mock runner test-double for verifying interface contracts in tests."""

    def __init__(self, output=None, should_fail=False):
        self.output = output or {
            "verdict": "malicious",
            "threat_type": "phishing",
            "score": 0.965,
            "score_type": "confidence",
            "model_version": "test-mock-v1",
            "indicators": ["urgent_action", "suspicious_domain"],
            "metadata": {"tokens_analyzed": 14},
        }
        self.should_fail = should_fail
        self.call_count = 0
        self.last_text = None

    def predict(self, text: str) -> dict:
        self.call_count += 1
        self.last_text = text
        if self.should_fail:
            raise RuntimeError("Underlying runner crashed during inference.")
        return self.output


def test_model_service_init_default():
    """ModelService defaults to not loaded."""
    svc = ModelService()
    assert svc.is_loaded is False
    assert svc.model_version == "not-loaded"
    assert svc.model_path is None


def test_model_service_load_missing_path_raises_unavailable(monkeypatch):
    """Calling load() with no path or empty env raises ModelUnavailableError."""
    monkeypatch.delenv("MODEL_PATH", raising=False)
    svc = ModelService()
    with pytest.raises(ModelUnavailableError) as exc_info:
        svc.load()
    assert "Wait for Person A" in str(exc_info.value)


def test_model_service_load_nonexistent_path_raises_not_found(tmp_path):
    """Calling load() with non-existent file raises ModelNotFoundError."""
    non_existent = tmp_path / "missing_model.pkl"
    svc = ModelService(model_path=str(non_existent))
    with pytest.raises(ModelNotFoundError) as exc_info:
        svc.load()
    assert "Model artifact not found" in str(exc_info.value)


def test_model_service_predict_without_model_raises_unavailable(monkeypatch):
    """predict() raises ModelUnavailableError when no model artifact is available."""
    monkeypatch.delenv("MODEL_PATH", raising=False)
    svc = ModelService()
    with pytest.raises(ModelUnavailableError):
        svc.predict("Urgent: bank verification required.")


def test_model_service_set_runner_and_predict_success():
    """predict() produces a normalized PredictionResult when a runner is attached."""
    svc = ModelService()
    runner = DummyMockRunner()
    svc.set_runner(runner, version="mock-v1.0")

    assert svc.is_loaded is True
    assert svc.model_version == "mock-v1.0"

    result = svc.predict("Please reset your password here: http://fake.com")
    assert runner.call_count == 1
    assert runner.last_text == "Please reset your password here: http://fake.com"
    assert result["verdict"] == "malicious"
    assert result["threat_type"] == "phishing"
    assert result["score"] == 0.965
    assert result["score_type"] == "confidence"
    assert result["model_version"] == "test-mock-v1"
    assert "urgent_action" in result["indicators"]
    assert result["metadata"]["tokens_analyzed"] == 14


def test_model_service_normalizes_minimal_output():
    """predict() handles minimal required dictionary output with default attributes."""
    svc = ModelService()
    runner = DummyMockRunner(output={"verdict": "clean", "threat_type": "benign"})
    svc.set_runner(runner, version="minimal-v1")

    result = svc.predict("Meeting notes from yesterday.")
    assert result["verdict"] == "clean"
    assert result["threat_type"] == "benign"
    assert result["score"] is None
    assert result["score_type"] == "confidence"
    assert result["model_version"] == "minimal-v1"


def test_model_service_invalid_runner_output_raises_error():
    """predict() raises ModelError when runner returns non-dict or missing required keys."""
    svc = ModelService()

    # Case 1: Non-dict return
    class NonDictRunner:
        def predict(self, text):
            return "not-a-dict"

    svc.set_runner(NonDictRunner())
    with pytest.raises(ModelError) as exc_info:
        svc.predict("Some sample text")
    assert "invalid output type" in str(exc_info.value)

    # Case 2: Missing required 'verdict'
    class MissingKeysRunner:
        def predict(self, text):
            return {"score": 0.5}

    svc.set_runner(MissingKeysRunner())
    with pytest.raises(ModelError) as exc_info:
        svc.predict("Some sample text")
    assert "missing required fields" in str(exc_info.value)


def test_model_service_runner_exception_wrapped_in_model_error():
    """Underlying runner exceptions during inference are caught and re-raised as ModelError."""
    svc = ModelService()
    runner = DummyMockRunner(should_fail=True)
    svc.set_runner(runner)

    with pytest.raises(ModelError) as exc_info:
        svc.predict("Some sample text")
    assert "Model inference failed" in str(exc_info.value)


def test_model_service_unload():
    """unload() clears active runner and resets loaded state."""
    svc = ModelService()
    svc.set_runner(DummyMockRunner(), version="temp-v1")
    assert svc.is_loaded is True

    svc.unload()
    assert svc.is_loaded is False
    assert svc.model_version == "not-loaded"


def test_scan_endpoint_with_active_mock_runner(client, auth_headers):
    """End-to-end POST /api/scan works when a test runner is attached and saves to DB."""
    runner = DummyMockRunner(
        output={
            "verdict": "suspicious",
            "threat_type": "credential_harvesting",
            "score": 0.88,
            "score_type": "confidence",
            "model_version": "e2e-test-v1",
            "indicators": ["credential_input"],
        }
    )
    active_model_service.set_runner(runner, version="e2e-test-v1")

    try:
        response = client.post(
            "/api/scan",
            headers=auth_headers,
            json={"text": "Please enter your banking PIN."},
        )
        assert response.status_code == 200
        data = response.get_json()
        assert "scan_id" in data
        assert data["verdict"] == "suspicious"
        assert data["threat_type"] == "credential_harvesting"
        assert data["score"] == 0.88
        assert data["score_type"] == "confidence"
        assert data["model_version"] == "e2e-test-v1"
        assert "credential_input" in data["indicators"]

        # Verify scan record is in history
        history_response = client.get("/api/scans", headers=auth_headers)
        assert history_response.status_code == 200
        history_data = history_response.get_json()
        assert history_data["count"] == 1
        assert history_data["scans"][0]["id"] == data["scan_id"]
        assert history_data["scans"][0]["verdict"] == "suspicious"
    finally:
        # Reset to ensure other tests aren't polluted
        active_model_service.unload()


def test_model_service_nan_and_infinity_score():
    """ModelService sanitizes NaN and Infinity floats to None to protect JSON compliance."""
    svc = ModelService()
    runner = DummyMockRunner(output={"verdict": "clean", "threat_type": "benign", "score": float("nan")})
    svc.set_runner(runner)
    result = svc.predict("Hello")
    assert result["score"] is None

    runner2 = DummyMockRunner(output={"verdict": "clean", "threat_type": "benign", "score": float("inf")})
    svc.set_runner(runner2)
    result2 = svc.predict("Hello")
    assert result2["score"] is None


def test_model_service_out_of_bounds_confidence_score():
    """When confidence score is outside [0.0, 1.0], it is automatically tagged as 'raw_score'."""
    svc = ModelService()
    runner = DummyMockRunner(output={"verdict": "malicious", "threat_type": "phishing", "score": 12.5, "score_type": "confidence"})
    svc.set_runner(runner)
    result = svc.predict("Suspicious URL")
    assert result["score"] == 12.5
    assert result["score_type"] == "raw_score"


def test_model_service_casing_and_whitespace_normalization():
    """ModelService lowercases and trims verdict and threat_type strings."""
    svc = ModelService()
    runner = DummyMockRunner(output={
        "verdict": "  PHISHING  ",
        "threat_type": "  CREDENTIAL_HARVESTING\n",
        "score": 0.95,
        "score_type": "CONFIDENCE",
    })
    svc.set_runner(runner)
    result = svc.predict("Suspicious text")
    assert result["verdict"] == "phishing"
    assert result["threat_type"] == "credential_harvesting"
    assert result["score_type"] == "confidence"


def test_model_service_invalid_score_type_fallback():
    """Unrecognized score_type values default safely to 'confidence'."""
    svc = ModelService()
    runner = DummyMockRunner(output={
        "verdict": "clean",
        "threat_type": "benign",
        "score": 0.12,
        "score_type": "arbitrary_custom_metric",
    })
    svc.set_runner(runner)
    result = svc.predict("Clean text")
    assert result["score_type"] == "confidence"


def test_model_service_invalid_string_score_sanitized_to_none():
    """Unparseable string scores are safely converted to None."""
    svc = ModelService()
    runner = DummyMockRunner(output={
        "verdict": "clean",
        "threat_type": "benign",
        "score": "not_a_valid_float",
    })
    svc.set_runner(runner)
    result = svc.predict("Clean text")
    assert result["score"] is None


def test_model_service_indicators_and_metadata_sanitization():
    """Indicators list is filtered of empty strings and metadata is safely preserved."""
    svc = ModelService()
    runner = DummyMockRunner(output={
        "verdict": "suspicious",
        "threat_type": "scam",
        "indicators": [" urgent_call ", "", "  ", "fake_brand"],
        "metadata": {"custom_flag": True},
    })
    svc.set_runner(runner)
    result = svc.predict("Claim your prize")
    assert result["indicators"] == ["urgent_call", "fake_brand"]
    assert result["metadata"] == {"custom_flag": True}


def test_model_service_negative_probability_demoted_to_raw_score():
    """Negative score marked as 'probability' is demoted to 'raw_score'."""
    svc = ModelService()
    runner = DummyMockRunner(output={
        "verdict": "phishing",
        "threat_type": "phishing",
        "score": -2.4,
        "score_type": "probability",
    })
    svc.set_runner(runner)
    result = svc.predict("Bad text")
    assert result["score"] == -2.4
    assert result["score_type"] == "raw_score"


def test_model_service_version_precedence():
    """Model version from runner output is preferred if non-empty, otherwise falls back to service default."""
    svc = ModelService(model_version="service-default-v1")
    runner1 = DummyMockRunner(output={
        "verdict": "clean",
        "threat_type": "benign",
        "model_version": "runner-specific-v2",
    })
    svc.set_runner(runner1)
    result1 = svc.predict("Text 1")
    assert result1["model_version"] == "runner-specific-v2"

    runner2 = DummyMockRunner(output={
        "verdict": "clean",
        "threat_type": "benign",
    })
    svc.set_runner(runner2, version="service-default-v1")
    result2 = svc.predict("Text 2")
    assert result2["model_version"] == "service-default-v1"


def test_scan_api_model_error_does_not_leak_paths_or_tracebacks(client, auth_headers):
    """POST /api/scan on runtime ModelError returns generic error without leaking server stack trace."""
    runner = DummyMockRunner(should_fail=True)
    active_model_service.set_runner(runner)

    try:
        response = client.post("/api/scan", headers=auth_headers, json={"text": "Check this out"})
        assert response.status_code == 500
        data = response.get_json()
        assert data["error"] == "model_error"
        assert "Threat analysis failed" in data["message"]
        # Ensure internal exception string and traceback are not leaked in the JSON payload
        assert "Traceback" not in data["message"]
        assert "Underlying runner crashed" not in data["message"]
    finally:
        active_model_service.unload()
