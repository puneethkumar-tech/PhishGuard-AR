from src.services.scan_service import save_scan
from src.models import User
from src.extensions import bcrypt, db

def test_scan_unauthorized(client):
    """POST /api/scan requires a valid Bearer token."""
    response = client.post("/api/scan", json={"text": "Click here to win a prize!"})
    assert response.status_code == 401
    assert response.get_json()["error"] == "unauthorized"

def test_scan_missing_text(client, auth_headers):
    """POST /api/scan returns 400 when text is empty."""
    response = client.post("/api/scan", headers=auth_headers, json={"text": ""})
    assert response.status_code == 400
    assert response.get_json()["error"] == "validation_error"

def test_scan_payload_too_large(client, auth_headers):
    """POST /api/scan rejects texts over 100,000 characters with 413."""
    oversized_text = "A" * 100_001
    response = client.post("/api/scan", headers=auth_headers, json={"text": oversized_text})
    assert response.status_code == 413
    assert response.get_json()["error"] == "payload_too_large"

def test_scan_model_unavailable(client, auth_headers):
    """POST /api/scan safely returns 503 model_unavailable without fabricating metrics."""
    response = client.post("/api/scan", headers=auth_headers, json={
        "text": "Your account has been suspended. Click http://bad-link.example to verify.",
    })
    assert response.status_code == 503
    data = response.get_json()
    assert data["error"] == "model_unavailable"
    assert "Wait for Person A" in data["message"]

def test_list_scans_empty(client, auth_headers):
    """GET /api/scans returns an empty list for a user with no history."""
    response = client.get("/api/scans", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["scans"] == []
    assert data["count"] == 0

def test_list_scans_with_history(app, client, registered_user, auth_headers):
    """GET /api/scans returns scan history for the authenticated user."""
    with app.app_context():
        save_scan(
            user_id=registered_user["id"],
            text="Urgent invoice payment required.",
            result={
                "verdict": "malicious",
                "threat_type": "phishing",
                "score": 0.95,
                "score_type": "probability",
                "model_version": "test-v1",
            },
        )

    response = client.get("/api/scans", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] == 1
    assert data["scans"][0]["verdict"] == "malicious"
    assert data["scans"][0]["threat_type"] == "phishing"

def test_get_single_scan_success(app, client, registered_user, auth_headers):
    """GET /api/scans/<id> retrieves details of a scan owned by the user."""
    with app.app_context():
        scan = save_scan(
            user_id=registered_user["id"],
            text="Security alert: unusual login attempt.",
            result={
                "verdict": "suspicious",
                "threat_type": "credential_harvesting",
                "score": 0.82,
                "score_type": "probability",
                "model_version": "test-v1",
            },
        )
        scan_id = scan.id

    response = client.get(f"/api/scans/{scan_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data["id"] == scan_id
    assert data["verdict"] == "suspicious"

def test_get_single_scan_not_found(client, auth_headers):
    """GET /api/scans/<id> returns 404 for non-existent scan ID."""
    response = client.get("/api/scans/99999", headers=auth_headers)
    assert response.status_code == 404
    assert response.get_json()["error"] == "not_found"

def test_get_single_scan_forbidden_for_other_user(app, client, registered_user, auth_headers):
    """A user cannot access scans created by another user (isolated ownership)."""
    with app.app_context():
        other_user = User(
            name="Other Analyst",
            email="other@phishguard.local",
            password_hash=bcrypt.generate_password_hash("OtherPass123!").decode("utf-8"),
            role="analyst",
        )
        db.session.add(other_user)
        db.session.commit()

        other_scan = save_scan(
            user_id=other_user.id,
            text="Confidential document attached.",
            result={
                "verdict": "clean",
                "threat_type": "benign",
                "score": 0.05,
                "score_type": "probability",
                "model_version": "test-v1",
            },
        )
        other_scan_id = other_scan.id

    # Access using first user's auth_headers should return 404 (not expose other user's record)
    response = client.get(f"/api/scans/{other_scan_id}", headers=auth_headers)
    assert response.status_code == 404
