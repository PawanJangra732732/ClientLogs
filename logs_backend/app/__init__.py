from flask import Flask
from .db import init_db, seed_sample_data
from .routes.logs_routes import logs_bp

def create_app():
    app = Flask(__name__)
    init_db()
    seed_sample_data()
    app.register_blueprint(logs_bp, url_prefix="/api/logs")
    return app
