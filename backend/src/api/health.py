import logging
from flask import Blueprint, jsonify
from sqlalchemy import text
from ..extensions import db
from .scans import model_service

logger = logging.getLogger(__name__)

health_bp = Blueprint("health", __name__)

@health_bp.get("/health")
def health():
    """Liveness probe: returns 200 OK as long as the Flask API server is running."""
    return jsonify({"status": "ok", "service": "phishguard-api"}), 200

@health_bp.get("/ready")
def readiness():
    """Readiness probe: validates database connection and ML model readiness.

    Returns:
        - 200 OK with ready=True if both database and ML model are ready.
        - 503 Service Unavailable with diagnostic checks if DB is down or model is not loaded.
    """
    db_ok = False
    try:
        db.session.execute(text("SELECT 1"))
        db_ok = True
    except Exception as exc:
        logger.warning("Readiness DB probe failed: %s", exc)

    model_loaded = model_service.is_loaded
    model_version = model_service.model_version
    is_ready = db_ok and model_loaded

    status_str = "ready" if is_ready else ("model_unavailable" if db_ok else "database_unavailable")

    response_data = {
        "service": "phishguard-api",
        "ready": is_ready,
        "status": status_str,
        "checks": {
            "database": "connected" if db_ok else "disconnected",
            "model": "loaded" if model_loaded else "unavailable",
        },
        "model_version": model_version,
    }

    status_code = 200 if is_ready else 503
    return jsonify(response_data), status_code
