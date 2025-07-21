from flask import Flask
from .db import init_db, seed_sample_data
from .routes.logs_routes import logs_bp
from flask_cors import CORS
#start this at localhost:5000/api/logs

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    init_db()
    seed_sample_data()
    app.register_blueprint(logs_bp, url_prefix="/api/logs")
    return app
