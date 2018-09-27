import yaml, os
from flask import Blueprint, jsonify, render_template, send_from_directory, url_for

docs = Blueprint('docs', 'docs')

@docs.route('/', methods=['GET'], strict_slashes=False)
def redoc() -> object:
    """
    Returns a ReDoc API Page for the specified version
    :return: API Documentation server page
    """
    return render_template("redoc.html",
                           url=url_for('docs.openapi_yaml'))


@docs.route('/docs.yaml', methods=['GET'])
def openapi_yaml() -> object:
    """
    Returns the source OpenAPI file for the specified version in yaml
    :return: OpenAPI yaml file
    """
    return send_from_directory('v1/spec/', f'v1.yaml')


@docs.route('/docs.json', methods=['GET'])
def openapi_json() -> object:
    """
    Returns the source OpenAPI file for the specified version in json
    :return: OpenAPI json file
    """
    path = os.path.join(os.path.dirname(__file__), 'v1/spec', f'v1.yaml')
    file = open(path, 'r')
    docs = yaml.load(file)
    return jsonify(docs)