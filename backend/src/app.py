import logging
import os
import time
from flask import Flask, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from .config import DevelopmentConfig, config_by_name
from .extensions import bcrypt, db, jwt
from .api.auth import auth_bp
from .api.health import health_bp
from .api.scans import scans_bp

logger = logging.getLogger("phishguard.api")

def create_app(config_class=None) -> Flask:
    """Application factory for PhishGuard-AR backend."""
    if config_class is None:
        env_name = os.getenv("FLASK_ENV", os.getenv("APP_ENV", "development")).lower()
        config_class = config_by_name.get(env_name, DevelopmentConfig)

    # Validate production environment credentials
    if hasattr(config_class, "validate"):
        config_class.validate()

    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register API blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(scans_bp)

    # Configure JWT error handlers for consistent JSON output
    @jwt.unauthorized_loader
    def unauthorized_callback(err_str):
        return jsonify({
            "error": "unauthorized",
            "message": "Authorization token is missing or invalid.",
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err_str):
        return jsonify({
            "error": "invalid_token",
            "message": "The provided token is invalid.",
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "error": "token_expired",
            "message": "The token has expired. Please refresh or log in again.",
        }), 401

    # CORS, timing & Security headers (Environment allowlist based)
    @app.before_request
    def handle_cors_preflight():
        request._req_start_time = time.perf_counter()
        if request.method == "OPTIONS":
            origin = request.headers.get("Origin")
            allowed_origins = app.config.get("CORS_ALLOWED_ORIGINS", [])
            if origin and origin in allowed_origins:
                response = app.make_default_options_response()
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
                response.headers["Access-Control-Max-Age"] = "86400"
                return response

    @app.after_request
    def apply_security_and_cors_headers(response):
        origin = request.headers.get("Origin")
        allowed_origins = app.config.get("CORS_ALLOWED_ORIGINS", [])
        if origin and origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"

        # Baseline defensive security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none';"

        # Safe access logging (does not log request body, passwords, or tokens)
        start_time = getattr(request, "_req_start_time", None)
        if start_time is not None:
            latency_ms = (time.perf_counter() - start_time) * 1000
            logger.info("%s %s -> %d (%.2fms)", request.method, request.path, response.status_code, latency_ms)

        return response

    # Safe error handlers (no sensitive data or stack traces leaked)
    @app.errorhandler(400)
    def bad_request(error):
        msg = getattr(error, "description", "Bad request.")
        return jsonify({"error": "bad_request", "message": msg}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "not_found", "message": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"error": "method_not_allowed", "message": "Method not allowed."}), 405

    @app.errorhandler(413)
    def payload_too_large(error):
        return jsonify({"error": "payload_too_large", "message": "Payload exceeds allowed limit."}), 413

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(error):
        db.session.rollback()
        return jsonify({
            "error": "database_error",
            "message": "A database operation error occurred.",
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_exception(error):
        # In testing/debug, let the exception propagate for test visibility
        if app.config.get("TESTING") or app.config.get("DEBUG"):
            raise error
        return jsonify({
            "error": "internal_server_error",
            "message": "An unexpected error occurred.",
        }), 500

    # Ensure tables exist in app context
    with app.app_context():
        db.create_all()

    return app

# WSGI entrypoint
app = create_app()
