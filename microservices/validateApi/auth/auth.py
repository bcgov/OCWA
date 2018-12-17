from functools import wraps
from flask import request, abort, Response
from config import Config

def auth(f):
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
