import pytest
from src.config import (
    Config,
    DevelopmentConfig,
    ProductionConfig,
    TestingConfig,
    INSECURE_DEV_SECRET,
    INSECURE_DEV_JWT_SECRET,
)

def test_development_config():
    """DevelopmentConfig sets debug and reasonable local defaults."""
    assert DevelopmentConfig.DEBUG is True
    assert DevelopmentConfig.TESTING is False
    assert len(DevelopmentConfig.SECRET_KEY) > 0
    assert len(DevelopmentConfig.JWT_SECRET_KEY) > 0
    assert len(DevelopmentConfig.CORS_ALLOWED_ORIGINS) > 0

def test_testing_config():
    """TestingConfig uses isolated in-memory SQLite database and disables debug."""
    assert TestingConfig.TESTING is True
    assert TestingConfig.DEBUG is False
    assert TestingConfig.SQLALCHEMY_DATABASE_URI == "sqlite:///:memory:"

def test_production_config_validation_missing_secrets():
    """ProductionConfig.validate() fails safely when secrets are absent or defaults."""
    # Reset secrets to default/empty on the class for testing validation
    original_secret = ProductionConfig.SECRET_KEY
    original_jwt_secret = ProductionConfig.JWT_SECRET_KEY

    try:
        ProductionConfig.SECRET_KEY = None
        ProductionConfig.JWT_SECRET_KEY = None
        with pytest.raises(ValueError, match="Production configuration validation failed"):
            ProductionConfig.validate()

        ProductionConfig.SECRET_KEY = INSECURE_DEV_SECRET
        ProductionConfig.JWT_SECRET_KEY = INSECURE_DEV_JWT_SECRET
        with pytest.raises(ValueError, match="non-default value"):
            ProductionConfig.validate()

        ProductionConfig.SECRET_KEY = "too-short"
        ProductionConfig.JWT_SECRET_KEY = "too-short"
        with pytest.raises(ValueError, match="too short"):
            ProductionConfig.validate()

        # Valid strong secrets pass validation
        ProductionConfig.SECRET_KEY = "a-very-long-and-secure-production-secret-key-12345"
        ProductionConfig.JWT_SECRET_KEY = "another-very-long-and-secure-jwt-production-secret-67890"
        ProductionConfig.validate()  # should not raise
    finally:
        ProductionConfig.SECRET_KEY = original_secret
        ProductionConfig.JWT_SECRET_KEY = original_jwt_secret
