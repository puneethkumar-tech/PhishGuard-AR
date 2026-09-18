def test_register_success(client):
    """User registration succeeds with valid parameters."""
    response = client.post("/api/auth/register", json={
        "name": "Alice Analyst",
        "email": "alice@phishguard.local",
        "password": "ValidPassword123!",
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "registered successfully"
    assert "user_id" in data

def test_register_duplicate_email(client, registered_user):
    """Attempting to register with an existing email returns 409 Conflict."""
    response = client.post("/api/auth/register", json={
        "name": "Impostor",
        "email": registered_user["email"].upper(),  # Case-insensitivity check
        "password": "AnotherPassword123!",
    })
    assert response.status_code == 409
    data = response.get_json()
    assert data["error"] == "conflict"

def test_register_validation_missing_fields(client):
    """Registration fails when required fields are missing."""
    response = client.post("/api/auth/register", json={
        "name": "",
        "email": "bademail",
        "password": "short",
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "validation_error"

def test_register_short_password(client):
    """Registration fails when password has fewer than 8 characters."""
    response = client.post("/api/auth/register", json={
        "name": "Bob",
        "email": "bob@example.com",
        "password": "short",
    })
    assert response.status_code == 400
    assert "at least 8 characters" in response.get_json()["message"]

def test_login_success(client, registered_user):
    """Login succeeds with valid credentials and issues both tokens."""
    response = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_invalid_password(client, registered_user):
    """Login fails when password is incorrect."""
    response = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": "WrongPassword999!",
    })
    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "invalid_credentials"

def test_login_nonexistent_user(client):
    """Login returns generic 401 when account does not exist."""
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@phishguard.local",
        "password": "SomePassword123!",
    })
    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "invalid_credentials"

def test_login_missing_fields(client):
    """Login returns 401 when email or password is missing."""
    response = client.post("/api/auth/login", json={})
    assert response.status_code == 401

def test_refresh_token_success(client, auth_tokens):
    """Valid refresh token successfully issues a fresh access token."""
    refresh_token = auth_tokens["refresh_token"]
    response = client.post(
        "/api/auth/refresh",
        headers={"Authorization": f"Bearer {refresh_token}"},
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert len(data["access_token"]) > 20

def test_refresh_token_rejected_with_access_token(client, auth_tokens):
    """Passing an access token to the refresh endpoint fails."""
    access_token = auth_tokens["access_token"]
    response = client.post(
        "/api/auth/refresh",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    # Flask-JWT-Extended rejects access token on refresh endpoint
    assert response.status_code in [401, 422]

def test_refresh_token_missing(client):
    """Calling refresh without authorization token returns 401."""
    response = client.post("/api/auth/refresh")
    assert response.status_code == 401

def test_register_oversized_bounds(client):
    """Registration fails when name > 120, email > 255, or password > 128 characters."""
    # Oversized password
    res_pw = client.post("/api/auth/register", json={
        "name": "Normal Name",
        "email": "normal@example.com",
        "password": "A" * 129,
    })
    assert res_pw.status_code == 400
    assert res_pw.get_json()["error"] == "validation_error"

    # Oversized name
    res_name = client.post("/api/auth/register", json={
        "name": "N" * 121,
        "email": "normal2@example.com",
        "password": "ValidPassword123!",
    })
    assert res_name.status_code == 400
    assert res_name.get_json()["error"] == "validation_error"

    # Oversized email
    res_email = client.post("/api/auth/register", json={
        "name": "Normal Name",
        "email": ("e" * 250) + "@example.com",
        "password": "ValidPassword123!",
    })
    assert res_email.status_code == 400
    assert res_email.get_json()["error"] == "validation_error"

def test_login_oversized_bounds(client):
    """Login safely rejects oversized credentials without computing expensive hashes."""
    res = client.post("/api/auth/login", json={
        "email": "normal@example.com",
        "password": "A" * 129,
    })
    assert res.status_code == 401
    assert res.get_json()["error"] == "invalid_credentials"
