import os
from pathlib import Path
from dotenv import load_dotenv

# Explicitly load .env from backend directory or parents if available
backend_dir = Path(__file__).resolve().parent.parent
env_file = backend_dir / ".env"
if env_file.exists():
    load_dotenv(dotenv_path=env_file)
else:
    load_dotenv()

INSECURE_DEV_SECRET = "dev-insecure-secret-phishguard-change-in-production"
INSECURE_DEV_JWT_SECRET = "dev-insecure-jwt-secret-phishguard-change-in-production"

def parse_cors_origins(raw_origins: str | None, default_origins: list[str]) -> list[str]:
    if not raw_origins:
        return default_origins
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

class Config:
    """Base configuration."""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "900"))  # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRES = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", "604800"))  # 7 days
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///phishguard.db")

    # ML Model Configuration
    MODEL_PATH = os.getenv("MODEL_PATH", "")
    MODEL_VERSION = os.getenv("MODEL_VERSION", "not-loaded")

    # CORS Origins Allowlist (comma-separated string in env)
    CORS_ALLOWED_ORIGINS = parse_cors_origins(
        os.getenv("CORS_ALLOWED_ORIGINS"),
        default_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )

class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True
    SECRET_KEY = os.getenv("SECRET_KEY", INSECURE_DEV_SECRET)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", INSECURE_DEV_JWT_SECRET)
    MODEL_PATH = os.getenv("MODEL_PATH", "")

class TestingConfig(Config):
    """Testing environment configuration with in-memory database."""
    TESTING = True
    DEBUG = False
    SECRET_KEY = "test-secret-key-strictly-for-testing"
    JWT_SECRET_KEY = "test-jwt-secret-key-strictly-for-testing"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    MODEL_PATH = None
    MODEL_VERSION = "test-stub-v0"
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

class ProductionConfig(Config):
    """Production environment configuration with strict security validation."""
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    MODEL_PATH = os.getenv("MODEL_PATH", "")
    MODEL_VERSION = os.getenv("MODEL_VERSION", "phishguard-prod-v1")

    # Production does not provide fallback origins by default
    CORS_ALLOWED_ORIGINS = parse_cors_origins(os.getenv("CORS_ALLOWED_ORIGINS"), default_origins=[])

    @classmethod
    def validate(cls):
        """Ensure critical secrets are explicitly provided and adequately strong."""
        errors = []
        if not cls.SECRET_KEY or cls.SECRET_KEY == INSECURE_DEV_SECRET:
            errors.append("SECRET_KEY must be set to a secure, non-default value in production.")
        elif len(cls.SECRET_KEY) < 24:
            errors.append("SECRET_KEY is too short (minimum 24 characters required).")

        if not cls.JWT_SECRET_KEY or cls.JWT_SECRET_KEY == INSECURE_DEV_JWT_SECRET:
            errors.append("JWT_SECRET_KEY must be set to a secure, non-default value in production.")
        elif len(cls.JWT_SECRET_KEY) < 24:
            errors.append("JWT_SECRET_KEY is too short (minimum 24 characters required).")

        if errors:
            raise ValueError(f"Production configuration validation failed: {'; '.join(errors)}")

config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
