from functools import wraps
from flask import request, abort, Response
from config import Config
from flask_jwt_simple import JWTManager
from flask_jwt_simple.view_decorators import _decode_jwt_from_headers
import flask_jwt_simple

def jwt_config(app):
    config = Config()
    app.config['JWT_SECRET_KEY'] = config.data['jwtSecret']
    app.config['JWT_DECODE_AUDIENCE'] = config.data['jwtAudience']
    jwt = JWTManager(app)
    return jwt


def api_key(f):
    """
    @param f: flask function
    @return: decorator, return the wrapped function or abort json object.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        config = Config()

        if config.data['apiSecret'] == request.headers.get('x-api-key'):
            return f(*args, **kwargs)
        else:
            print("Unauthorized address trying to use API: " + request.remote_addr)
            abort(401)

    return decorated


def jwt_or_api_key(f):
    """
    @param f: flask function
    @return: decorator, return the wrapped function or abort json object.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        config = Config()

        if config.data['apiSecret'] == request.headers.get('x-api-key'):
            return f(*args, **kwargs)
        else:

            jwt = _decode_jwt_from_headers()


            if not(jwt == None):
                return f(*args, **kwargs)
            else:
                print("Unauthorized address trying to use API: " + request.remote_addr)
                abort(401)

    return decorated

def jwt(f):
    """
    @param f: flask function
    @return: decorator, return the wrapped function or abort json object.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        jwt = _decode_jwt_from_headers()

        if not (jwt == None):
            return f(*args, **kwargs)
        else:
            print("Unauthorized address trying to use API: " + request.remote_addr)
            abort(401)

    return decorated


def admin_jwt(f):
    """
        @param f: flask function
        @return: decorator, return the wrapped function or abort json object.
        """

    @wraps(f)
    def decorated(*args, **kwargs):
        config = Config()
        jwt = _decode_jwt_from_headers()

        if jwt == None:
            print("Unauthorized address trying to use API: " + request.remote_addr)
            abort(401)

        if config.data['jwt_access_group'] in jwt[config.data['jwt_group']]:
            return f(*args, **kwargs)

        print("Unauthorized address trying to use API: " + request.remote_addr)
        abort(401)

    return decorated
