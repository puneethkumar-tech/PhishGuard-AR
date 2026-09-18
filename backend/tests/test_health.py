from src.api.scans import model_service


class MockActiveRunner:
    def predict(self, text: str):
        return {
            "verdict": "clean",
            "threat_type": "benign",
            "score": 0.01,
            "score_type": "confidence",
            "model_version": "ready-test-v1",
        }


def test_health_endpoint(client):
    """GET /health should return 200 with service status (liveness check)."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["service"] == "phishguard-api"
    # Verify security headers
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"


def test_cors_allowed_origin(client):
    """Requests from an allowed origin receive CORS headers."""
    response = client.get("/health", headers={"Origin": "http://localhost:3000"})
    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == "http://localhost:3000"
    assert response.headers.get("Access-Control-Allow-Credentials") == "true"


def test_cors_disallowed_origin(client):
    """Requests from an untrusted origin do not receive Access-Control-Allow-Origin."""
    response = client.get("/health", headers={"Origin": "https://malicious-site.example"})
    assert response.status_code == 200
    assert "Access-Control-Allow-Origin" not in response.headers


def test_ready_endpoint_when_model_unloaded(client):
    """GET /ready returns 503 and indicates model is unavailable while DB is connected."""
    # Ensure model is unloaded
    model_service.unload()

    response = client.get("/ready")
    assert response.status_code == 503
    data = response.get_json()
    assert data["ready"] is False
    assert data["status"] == "model_unavailable"
    assert data["checks"]["database"] == "connected"
    assert data["checks"]["model"] == "unavailable"

    # Liveness must NOT fail when model is unloaded
    liveness = client.get("/health")
    assert liveness.status_code == 200


def test_ready_endpoint_when_model_loaded(client):
    """GET /ready returns 200 OK when both DB and model runner are ready."""
    runner = MockActiveRunner()
    model_service.set_runner(runner, version="ready-test-v1")

    try:
        response = client.get("/ready")
        assert response.status_code == 200
        data = response.get_json()
        assert data["ready"] is True
        assert data["status"] == "ready"
        assert data["checks"]["database"] == "connected"
        assert data["checks"]["model"] == "loaded"
        assert data["model_version"] == "ready-test-v1"
    finally:
        model_service.unload()


def test_security_headers_and_csp(client):
    """API responses include defensive security headers (nosniff, DENY, CSP)."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert "default-src 'none'" in response.headers.get("Content-Security-Policy", "")


def test_cors_preflight_options(client):
    """CORS OPTIONS preflight request returns allowed methods and max-age cache header."""
    response = client.open(
        "/api/scan",
        method="OPTIONS",
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == "http://localhost:3000"
    assert response.headers.get("Access-Control-Max-Age") == "86400"
    assert "POST" in response.headers.get("Access-Control-Allow-Methods", "")
