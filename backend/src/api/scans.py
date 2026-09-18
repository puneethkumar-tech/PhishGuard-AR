from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..services.model_service import ModelService, ModelUnavailableError
from ..services.scan_service import save_scan

scans_bp = Blueprint("scans", __name__, url_prefix="/api")

model_service = ModelService()

@scans_bp.post("/scan")
@jwt_required()
def scan():
    data = request.get_json(silent=True) or {}
    text = str(data.get("text", "")).strip()

    if not text:
        return jsonify({"error": "text is required"}), 400
    if len(text) > 100_000:
        return jsonify({"error": "text is too long"}), 413

    try:
        result = model_service.predict(text)
    except ModelUnavailableError as exc:
        return jsonify({
            "error": "model_unavailable",
            "message": str(exc),
        }), 503

    scan_record = save_scan(int(get_jwt_identity()), text, result)
    return jsonify({
        "scan_id": scan_record.id,
        **result,
    }), 200
