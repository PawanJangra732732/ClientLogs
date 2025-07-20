from flask import Blueprint
from ..controllers.logs_controller import get_logs, create_log

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("", methods=["GET"])
def _get_logs():
    return get_logs()

@logs_bp.route("", methods=["POST"])
def _create_log():
    return create_log()
