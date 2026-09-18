from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from sqlalchemy import func
from ..extensions import bcrypt, db
from ..models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.post("/register")
def register():
    """Register a new user analyst."""
    raw_data = request.get_json(silent=True)
    data = raw_data if isinstance(raw_data, dict) else {}
    name = str(data.get("name", "")).strip() if isinstance(data.get("name"), str) else ""
    email = str(data.get("email", "")).strip().lower() if isinstance(data.get("email"), str) else ""
    password = data.get("password") if isinstance(data.get("password"), str) else ""

    if (
        not name
        or len(name) > 120
        or not email
        or len(email) > 255
        or "@" not in email
        or len(password) < 8
        or len(password) > 128
    ):
        return jsonify({
            "error": "validation_error",
            "message": "Name (max 120 chars), a valid email (max 255 chars), and a password of at least 8 characters (max 128) are required.",
        }), 400

    exists = db.session.query(User).filter(func.lower(User.email) == email).first()
    if exists:
        return jsonify({
            "error": "conflict",
            "message": "registration failed",
        }), 409

    user = User(
        name=name,
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({
        "message": "registered successfully",
        "user_id": user.id,
    }), 201

@auth_bp.post("/login")
def login():
    """Authenticate a user and return access and refresh JWT tokens."""
    raw_data = request.get_json(silent=True)
    data = raw_data if isinstance(raw_data, dict) else {}
    email = str(data.get("email", "")).strip().lower() if isinstance(data.get("email"), str) else ""
    password = data.get("password") if isinstance(data.get("password"), str) else ""

    if not email or len(email) > 255 or not password or len(password) > 128:
        return jsonify({
            "error": "invalid_credentials",
            "message": "invalid email or password",
        }), 401

    user = db.session.query(User).filter(func.lower(User.email) == email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        # Always return generic message to prevent account enumeration
        return jsonify({
            "error": "invalid_credentials",
            "message": "invalid email or password",
        }), 401

    claims = {"role": user.role}
    return jsonify({
        "access_token": create_access_token(identity=str(user.id), additional_claims=claims),
        "refresh_token": create_refresh_token(identity=str(user.id), additional_claims=claims),
    }), 200

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    """Exchange a valid refresh token for a new access token."""
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role", "analyst")

    new_access_token = create_access_token(
        identity=str(user_id),
        additional_claims={"role": role},
    )
    return jsonify({
        "access_token": new_access_token,
    }), 200
