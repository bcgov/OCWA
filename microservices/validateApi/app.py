try:  # Python 3.5+
    from http import HTTPStatus as HTTPStatus
except ImportError:
    from http import client as HTTPStatus
import logging
import config
import os

from flask import Flask, g, jsonify, make_response, url_for, Response
from flask_compress import Compress
import v1.v1 as v1

def create_app(test_config=None):
    log = logging.getLogger(__name__)

    app = Flask(__name__)

    conf = config.Config()
    if test_config is None:
        app.config.update(conf.conf.data)
    else:
        # load the test config if passed in
        app.config.update(conf.conf.data)
        app.config.update(test_config)

    ##Routes##
    v1.Register(app)
    Compress(app)


    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.before_request
    def before_request():
        from timeit import default_timer as timer

        g.request_start_time = timer()
        g.request_time = lambda: "%s" % (timer() - g.request_start_time)
        resp = Response()
        resp.headers['Content-Type'] = ["application/json"]



    @app.after_request
    def after_request(response):
        log.debug('Rendered in %ss', g.request_time())
        return response


    @app.errorhandler(HTTPStatus.NOT_FOUND)
    def not_found(param):
        content = jsonify({
            "error": "Not Found",
            "code": HTTPStatus.NOT_FOUND
        })
        return make_response(content, HTTPStatus.NOT_FOUND)


    @app.errorhandler(HTTPStatus.INTERNAL_SERVER_ERROR)
    def internal_server_error(error):
        content = jsonify({
            "error": "{error}",
            "code": HTTPStatus.INTERNAL_SERVER_ERROR
        })
        return make_response(content, HTTPStatus.INTERNAL_SERVER_ERROR)


    @app.route('/', methods=['GET'], strict_slashes=False)
    def index():
        """
        Returns a list of valid API version endpoints
        :return: JSON of valid API version endpoints
        """
        return jsonify([url_for(".v1.status", _external=True)])

    return app
