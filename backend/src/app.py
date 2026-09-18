from flask import Flask
from .config import Config
from .extensions import bcrypt, db, jwt
from .api.auth import auth_bp
from .api.health import health_bp
from .api.scans import scans_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(scans_bp)

    with app.app_context():
        db.create_all()

    return app

app = create_app()
