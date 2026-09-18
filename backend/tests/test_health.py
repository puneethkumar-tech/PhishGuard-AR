def test_health_endpoint(client):
    """GET /health should return 200 with service status."""
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
