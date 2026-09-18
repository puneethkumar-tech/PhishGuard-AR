import logging
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..services.model_service import ModelError, ModelService, ModelUnavailableError
from ..services.scan_service import get_scan_by_id, get_user_scans, save_scan

logger = logging.getLogger(__name__)
scans_bp = Blueprint("scans", __name__, url_prefix="/api")

model_service = ModelService()

@scans_bp.post("/scan")
@jwt_required()
def scan():
    """Submit a text sample for phishing / threat detection."""
    raw_data = request.get_json(silent=True)
    data = raw_data if isinstance(raw_data, dict) else {}
    raw_text = data.get("text")

    if not isinstance(raw_text, str) or not raw_text.strip():
        return jsonify({
            "error": "validation_error",
            "message": "text is required",
        }), 400

    text = raw_text.strip()

    if len(text) > 100_000:
        return jsonify({
            "error": "payload_too_large",
            "message": "text is too long",
        }), 413

    try:
        result = model_service.predict(text)
    except ModelUnavailableError as exc:
        logger.warning("Threat scan requested but model unavailable: %s", exc)
        return jsonify({
            "error": "model_unavailable",
            "message": "ML model is not available. Wait for Person A's model bundle.",
        }), 503
    except ModelError as exc:
        logger.error("Threat scan inference error: %s", exc, exc_info=True)
        return jsonify({
            "error": "model_error",
            "message": "Threat analysis failed due to an internal model error.",
        }), 500

    scan_record = save_scan(int(get_jwt_identity()), text, result)
    return jsonify({
        "scan_id": scan_record.id,
        **result,
    }), 200

@scans_bp.get("/scans")
@jwt_required()
def list_scans():
    """Retrieve historical scans submitted by the authenticated user."""
    user_id = int(get_jwt_identity())
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)

    scans = get_user_scans(user_id=user_id, limit=limit, offset=offset)
    return jsonify({
        "scans": [s.to_dict() for s in scans],
        "count": len(scans),
    }), 200

@scans_bp.get("/scans/<int:scan_id>")
@jwt_required()
def get_scan(scan_id: int):
    """Retrieve details of a single scan record owned by the authenticated user."""
    user_id = int(get_jwt_identity())
    scan_record = get_scan_by_id(user_id=user_id, scan_id=scan_id)

    if not scan_record:
        return jsonify({
            "error": "not_found",
            "message": f"Scan {scan_id} was not found or access is denied.",
        }), 404

    return jsonify(scan_record.to_dict()), 200
