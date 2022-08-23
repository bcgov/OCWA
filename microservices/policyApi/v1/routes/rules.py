from flask import Blueprint, jsonify, request, Response
from v1.db.db import Db
import hcl
import logging

from v1.auth.auth import jwt_or_api_key
from v1.auth.auth import admin_jwt

log = logging.getLogger(__name__)

rules = Blueprint('validate', 'validate')

@rules.route('/<string:policyName>',
           methods=['GET'], strict_slashes=False)
@jwt_or_api_key
def get_policy(policyName: str) -> object:
    """
    Get policy
    :return: JSON of policy (collection of rules)
    """
    db = Db()
    resp = Response()
    resp.headers['Content-Type'] = ["application/json"]

    policy = db.Policies.objects(name=policyName).first()

    rules = db.Rules.objects(name__in=policy.rules)

    if len(policy.rules) != len(rules):
        raise Exception("Missing rules from policy")

    return rules.to_json()


@rules.route('/rules/<string:ruleName>',
           methods=['GET'], strict_slashes=False)
@jwt_or_api_key
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
@admin_jwt
def write_policy() -> object:
    """
    (Over)write policy
    :return: JSON of success message or error message
    """

    db=Db()

    body = request.get_json()

    if not('name' in body):
        return jsonify({"error": "name is a required attribute"})

    if not('rules' in body):
        return jsonify({"error": "'rules' is a required attribute"})
    name = body['name']
    rules = body['rules']

    if len(rules) == 0:
        return jsonify({"error": "policy must have atleast one rule"})

    db.Policies(name=name, rules=rules).save()

    return jsonify({"success": "Written successfully"})

@rules.route('/<string:policyName>',
           methods=['POST'], strict_slashes=False)
@admin_jwt
def update_policy(policyName: str) -> object:
    """
    (Over)write policy
    :return: JSON of success message or error message
    """

    db=Db()

    body = request.get_json()

    if not('rules' in body):
        return jsonify({"error": "'rules' is a required attribute"})

    rules = body['rules']

    if len(rules) == 0:
        return jsonify({"error": "policy must have atleast one rule"})

    p = db.Policies.objects(name=policyName).first()
    p.rules = rules
    p.save()

    return jsonify({"success": "Written successfully"})


@rules.route('/rules',
           methods=['POST'], strict_slashes=False)
@admin_jwt
def write_rules() -> object:
    """
    (Over)write a set of rules
    :return: JSON of success message or error message
    """

    db=Db()

    body = request.get_json()

    if not('rule_set' in body):
        return jsonify({"error": "rule_set is a required attribute"})

    rule_set = body['rule_set']

    rules = None
    try:
        rules = hcl.loads(rule_set)
    except Exception as e:
        return jsonify({"error": "%s%s" % (str(e),rule_set)})

    for ruleName, ruleDef in rules['rule'].items():
        source = ruleDef['source']
        filter = {'name': ruleName}
        newValues = { '$set': { 'source': source} }
        if 'mandatory' in ruleDef:
            mandatory = ruleDef['mandatory']
            newValues['$set']['mandatory'] = mandatory
        db.Rules.update_one(filter, newValues, upsert=True, write_concern=None)

    return jsonify({"success": "Written successfully"})


@rules.route('/rules/<string:ruleName>',
           methods=['POST'], strict_slashes=False)
@admin_jwt
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
