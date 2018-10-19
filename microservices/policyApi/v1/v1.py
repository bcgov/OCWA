from flask import Blueprint, jsonify
from functools import reduce
from v1.routes.rules import rules
from v1.routes.docs import docs
from v1.auth.auth import jwt_config


v1 = Blueprint('v1', 'v1')

@v1.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """
    Returns the overall API status
    :return: JSON of endpoint status
    """
    return jsonify({"status": "ok"})


class Register:
    def __init__(self, app):
        jwt = jwt_config(app)
        app.register_blueprint(v1, url_prefix="/v1")
        app.register_blueprint(rules, url_prefix="/v1/")
        app.register_blueprint(docs, url_prefix="/v1/api-docs")
