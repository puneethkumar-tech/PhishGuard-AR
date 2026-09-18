from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy import func
from ..extensions import bcrypt, db
from ..models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or len(password) < 8:
        return jsonify({"error": "name, valid email, and password of at least 8 characters are required"}), 400

    exists = db.session.query(User).filter(func.lower(User.email) == email).first()
    if exists:
        return jsonify({"error": "registration failed"}), 409

    user = User(
        name=name,
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "registered successfully", "user_id": user.id}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    user = db.session.query(User).filter(func.lower(User.email) == email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "invalid email or password"}), 401

    claims = {"role": user.role}
    return jsonify({
        "access_token": create_access_token(identity=str(user.id), additional_claims=claims),
        "refresh_token": create_refresh_token(identity=str(user.id), additional_claims=claims),
    }), 200
