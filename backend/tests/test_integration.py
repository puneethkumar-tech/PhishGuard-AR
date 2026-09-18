"""End-to-End API Integration & Stability Test Suite for PhishGuard-AR (Phase 5).

Covers:
- Complete authentication & token rotation lifecycle
- Input validation robustness across all endpoints
- Unauthenticated / unauthorized boundary enforcement
- Multi-user data isolation
- Scan lifecycle with test double runner
- Model unavailable 503 handling
- Health (liveness) vs Readiness (/ready) component status
"""

import pytest
from src.api.scans import model_service
from src.extensions import db


class ActiveMockRunner:
    """Mock ML model runner conforming to ModelRunner protocol for integration tests."""

    def predict(self, text: str) -> dict:
        return {
            "verdict": "phishing",
            "threat_type": "credential_harvesting",
            "score": 0.962,
            "score_type": "confidence",
            "model_version": "integration-v1.0",
            "indicators": ["urgent_action", "credential_harvesting_form"],
            "metadata": {"char_count": len(text), "tokens_analyzed": len(text.split())},
        }


# ==============================================================================
# 1. Full Authentication Lifecycle
# ==============================================================================

def test_full_auth_and_token_rotation_flow(client):
    """End-to-end test: Register -> Login -> Refresh -> Protected Route with new token."""
    # 1. Register
    reg_res = client.post("/api/auth/register", json={
        "name": "Integration Tester",
        "email": "integration@phishguard.local",
        "password": "SecurePassword123!",
    })
    assert reg_res.status_code == 201
    reg_data = reg_res.get_json()
    assert reg_data["message"] == "registered successfully"
    user_id = reg_data["user_id"]

    # 2. Login
    login_res = client.post("/api/auth/login", json={
        "email": "integration@phishguard.local",
        "password": "SecurePassword123!",
    })
    assert login_res.status_code == 200
    login_data = login_res.get_json()
    access_token = login_data["access_token"]
    refresh_token = login_data["refresh_token"]

    # 3. Access protected scan history with initial access token
    scans_res = client.get("/api/scans", headers={"Authorization": f"Bearer {access_token}"})
    assert scans_res.status_code == 200
    assert scans_res.get_json()["count"] == 0

    # 4. Rotate access token using refresh token
    refresh_res = client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {refresh_token}"})
    assert refresh_res.status_code == 200
    new_access_token = refresh_res.get_json()["access_token"]
    assert new_access_token != access_token

    # 5. Access protected route with newly issued access token
    scans_res2 = client.get("/api/scans", headers={"Authorization": f"Bearer {new_access_token}"})
    assert scans_res2.status_code == 200


# ==============================================================================
# 2. Input Validation Robustness
# ==============================================================================

@pytest.mark.parametrize("payload,expected_status,expected_error", [
    ({}, 400, "validation_error"),
    ({"name": ""}, 400, "validation_error"),
    ({"name": "Test", "email": "no-at-sign", "password": "password123"}, 400, "validation_error"),
    ({"name": "Test", "email": "test@example.com", "password": "short"}, 400, "validation_error"),
])
def test_register_input_validation_edge_cases(client, payload, expected_status, expected_error):
    """Registration rejects malformed payloads with 400 validation_error."""
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == expected_status
    assert res.get_json()["error"] == expected_error


def test_register_non_dict_json_payload(client):
    """Registration handles JSON list or non-dict bodies gracefully without crashing."""
    res = client.post("/api/auth/register", json=["invalid", "array", "body"])
    assert res.status_code == 400
    assert res.get_json()["error"] == "validation_error"


def test_register_unsupported_content_type(client):
    """Registration handles non-JSON plain text body gracefully."""
    res = client.post(
        "/api/auth/register",
        data="raw unformatted text",
        content_type="text/plain",
    )
    assert res.status_code == 400
    assert res.get_json()["error"] == "validation_error"


@pytest.mark.parametrize("payload", [
    {},
    {"email": ""},
    {"password": ""},
    {"email": "valid@email.com"},
    {"password": "password123"},
])
def test_login_missing_fields_matrix(client, payload):
    """Login returns 401 invalid_credentials on incomplete payloads."""
    res = client.post("/api/auth/login", json=payload)
    assert res.status_code == 401
    assert res.get_json()["error"] == "invalid_credentials"


def test_login_non_dict_json_payload(client):
    """Login handles non-dict JSON body gracefully."""
    res = client.post("/api/auth/login", json=["invalid"])
    assert res.status_code == 401
    assert res.get_json()["error"] == "invalid_credentials"


# ==============================================================================
# 3. Threat Scan End-to-End Workflow & Multi-User Isolation
# ==============================================================================

def test_full_scan_workflow_with_active_runner(client, auth_headers):
    """Full workflow: Submit text -> Save scan -> Retrieve history -> Retrieve single scan."""
    runner = ActiveMockRunner()
    model_service.set_runner(runner, version="integration-v1.0")

    try:
        # 1. Submit threat scan
        sample_text = "Urgent: Your account is suspended. Confirm identity at https://secure-bank-login.xyz"
        scan_res = client.post("/api/scan", headers=auth_headers, json={"text": sample_text})
        assert scan_res.status_code == 200
        scan_data = scan_res.get_json()

        assert "scan_id" in scan_data
        scan_id = scan_data["scan_id"]
        assert scan_data["verdict"] == "phishing"
        assert scan_data["threat_type"] == "credential_harvesting"
        assert scan_data["score"] == 0.962
        assert scan_data["score_type"] == "confidence"
        assert scan_data["model_version"] == "integration-v1.0"
        assert "urgent_action" in scan_data["indicators"]
        assert scan_data["metadata"]["tokens_analyzed"] == len(sample_text.split())

        # 2. Retrieve scan list
        list_res = client.get("/api/scans", headers=auth_headers)
        assert list_res.status_code == 200
        list_data = list_res.get_json()
        assert list_data["count"] == 1
        assert list_data["scans"][0]["id"] == scan_id
        assert list_data["scans"][0]["text"] == sample_text

        # 3. Retrieve single scan by ID
        get_res = client.get(f"/api/scans/{scan_id}", headers=auth_headers)
        assert get_res.status_code == 200
        get_data = get_res.get_json()
        assert get_data["id"] == scan_id
        assert get_data["verdict"] == "phishing"
    finally:
        model_service.unload()


def test_multi_user_data_isolation(client):
    """Verify that User A cannot see or access scans created by User B."""
    # Register & login User A
    client.post("/api/auth/register", json={"name": "User A", "email": "usera@phishguard.local", "password": "PasswordA123!"})
    login_a = client.post("/api/auth/login", json={"email": "usera@phishguard.local", "password": "PasswordA123!"}).get_json()
    headers_a = {"Authorization": f"Bearer {login_a['access_token']}"}

    # Register & login User B
    client.post("/api/auth/register", json={"name": "User B", "email": "userb@phishguard.local", "password": "PasswordB123!"})
    login_b = client.post("/api/auth/login", json={"email": "userb@phishguard.local", "password": "PasswordB123!"}).get_json()
    headers_b = {"Authorization": f"Bearer {login_b['access_token']}"}

    runner = ActiveMockRunner()
    model_service.set_runner(runner, version="isolation-v1")

    try:
        # User A creates a scan
        scan_a = client.post("/api/scan", headers=headers_a, json={"text": "User A secret message"}).get_json()
        scan_a_id = scan_a["scan_id"]

        # User B creates a scan
        scan_b = client.post("/api/scan", headers=headers_b, json={"text": "User B confidential text"}).get_json()
        scan_b_id = scan_b["scan_id"]

        # User A lists scans -> only sees User A scan
        list_a = client.get("/api/scans", headers=headers_a).get_json()
        assert list_a["count"] == 1
        assert list_a["scans"][0]["id"] == scan_a_id

        # User B lists scans -> only sees User B scan
        list_b = client.get("/api/scans", headers=headers_b).get_json()
        assert list_b["count"] == 1
        assert list_b["scans"][0]["id"] == scan_b_id

        # User A attempts to access User B's scan -> 404
        forbidden_get = client.get(f"/api/scans/{scan_b_id}", headers=headers_a)
        assert forbidden_get.status_code == 404
        assert forbidden_get.get_json()["error"] == "not_found"

        # User B attempts to access User A's scan -> 404
        forbidden_get_b = client.get(f"/api/scans/{scan_a_id}", headers=headers_b)
        assert forbidden_get_b.status_code == 404
    finally:
        model_service.unload()


# ==============================================================================
# 4. Health and Readiness Endpoints
# ==============================================================================

def test_liveness_and_readiness_lifecycle(client):
    """Verify /health always succeeds, while /ready accurately reflects model readiness."""
    # Ensure model is unloaded initially
    model_service.unload()

    # Liveness is OK
    health = client.get("/health")
    assert health.status_code == 200
    assert health.get_json()["status"] == "ok"

    # Readiness reflects missing model (503)
    ready_before = client.get("/ready")
    assert ready_before.status_code == 503
    data_before = ready_before.get_json()
    assert data_before["ready"] is False
    assert data_before["checks"]["database"] == "connected"
    assert data_before["checks"]["model"] == "unavailable"

    # Attach model runner
    model_service.set_runner(ActiveMockRunner(), version="ready-flow-v1")
    try:
        ready_after = client.get("/ready")
        assert ready_after.status_code == 200
        data_after = ready_after.get_json()
        assert data_after["ready"] is True
        assert data_after["checks"]["database"] == "connected"
        assert data_after["checks"]["model"] == "loaded"
        assert data_after["model_version"] == "ready-flow-v1"
    finally:
        model_service.unload()
