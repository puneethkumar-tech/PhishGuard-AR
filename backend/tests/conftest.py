import pytest
from src.app import create_app
from src.config import TestingConfig
from src.extensions import bcrypt, db
from src.models import User

@pytest.fixture(scope="session")
def app():
    """Create application configured for testing with an in-memory SQLite database."""
    test_app = create_app(TestingConfig)
    yield test_app

@pytest.fixture(autouse=True)
def clean_db(app):
    """Ensure a clean database state for each test."""
    with app.app_context():
        db.create_all()
        yield
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Test client for HTTP requests."""
    return app.test_client()

@pytest.fixture
def registered_user(app):
    """Seed a test user into the database."""
    with app.app_context():
        user = User(
            name="Security Analyst",
            email="analyst@phishguard.local",
            password_hash=bcrypt.generate_password_hash("StrongP@ssw0rd!").decode("utf-8"),
            role="analyst",
        )
        db.session.add(user)
        db.session.commit()
        return {"id": user.id, "email": user.email, "name": user.name, "password": "StrongP@ssw0rd!"}

@pytest.fixture
def auth_tokens(client, registered_user):
    """Authenticate the seeded user and return access & refresh tokens."""
    response = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert response.status_code == 200
    data = response.get_json()
    return {
        "access_token": data["access_token"],
        "refresh_token": data["refresh_token"],
    }

@pytest.fixture
def auth_headers(auth_tokens):
    """Return Authorization header with valid Bearer access token."""
    return {
        "Authorization": f"Bearer {auth_tokens['access_token']}",
    }
