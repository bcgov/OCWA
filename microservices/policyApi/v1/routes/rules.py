from flask import Blueprint, jsonify, request, Response
from v1.db.db import Db
from config import Config
import requests
import http
import mongoengine.errors
import hcl

rules = Blueprint('validate', 'validate')

@rules.route('/',
           methods=['GET'], strict_slashes=False)
def get_policy() -> object:
    """
    Get policy
    :return: JSON of policy (collection of rules)
    """

    db = Db()
    resp = Response()
    resp.headers['Content-Type'] = ["application/json"]
    return db.Rules.objects().to_json()


@rules.route('/<string:ruleName>',
           methods=['GET'], strict_slashes=False)
def get_rule(ruleName: str) -> object:
    """
    Gets a rule
    :param ruleName: Rule Name
    :return: JSON of submission state
    """

    db=Db()

    return db.Rules.objects(name=ruleName).to_json()


@rules.route('/',
           methods=['POST'], strict_slashes=False)
def write_policy() -> object:
    """
    (Over)write policy
    :return: JSON of success message or error message
    """

    db=Db()

    body = request.get_json()

    if not('policy' in body):
        return jsonify({"error": "policy is a required attribute"})
    pol = body['policy']

    policy = None

    try:
        policy = hcl.loads(pol)
    except Exception as e:
        return jsonify({"error": str(e)})

    if not('rule' in policy):
        return jsonify({"error": "Invalid json"})


    ##Clear all entries!!!
    db.Rules.objects().delete()

    for ruleName, ruleDef in policy['rule'].items():
        rule = db.Rules(
            name=ruleName,
            source=ruleDef['source']
        )

        if 'mandatory' in ruleDef:
            rule.mangatory = ruleDef['mandatory']

        rule.save()


    return jsonify({"success": "Written successfully"})


@rules.route('/<string:ruleName>',
           methods=['POST'], strict_slashes=False)
def write_rule(ruleName: str) -> object:
    """
    (Over)write a single rule
    :param ruleName: Rule Name
    :return: JSON of success message or error message
    """

    db=Db()

    body = request.get_json()

    if not('rule' in body):
        return jsonify({"error": "rule is a required attribute"})

    pol = body['rule']

    rule = None

    try:
        rule = hcl.loads(pol)
    except Exception as e:
        return jsonify({"error": str(e)})

    if not('rule' in rule):
        return jsonify({"error": "Invalid json"})

    if not (ruleName in rule['rule']):
        return jsonify({"error": "rule name mismatch with provided hcl and url"})

    if not ('source' in rule['rule'][ruleName]):
        return jsonify({"error": "source is a required attribute"})

    dbRule = db.Rules(
        name=ruleName,
        source=rule['rule'][ruleName]['source']
    )

    if 'mandatory' in rule['rule'][ruleName]:
        db.Rules.objects(name=ruleName).update_one(source=rule['rule'][ruleName]['source'], mandatory=rule['rule'][ruleName]['mandatory'], upsert=True, write_concern=None)
    else:
        db.Rules.objects(name=ruleName).update_one(source=rule['rule'][ruleName]['source'], upsert=True, write_concern=None)




    return jsonify({"success": "Written successfully"})
