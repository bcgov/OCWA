try:  # Python 3.5+
    from http import HTTPStatus as HTTPStatus
except ImportError:
    from http import client as HTTPStatus
from flask import Blueprint, jsonify
from v1.db.db import Db
from config import Config
import requests
import hcl
import sys
from v1.validator.validator import Validator
from v1.auth.auth import auth
import logging
log = logging.getLogger(__name__)

validate = Blueprint('validate', 'validate')


@validate.route('/<string:fileId>',
           methods=['GET'], strict_slashes=False)
@auth
def validate_policy_result(fileId: str) -> object:
    """
    Returns the result of file
    :param fileId: File Object ID
    :return: JSON of validation result
    """

    db = Db()
    return db.Results.objects(file_id=fileId).to_json()


@validate.route('/<string:fileId>',
           methods=['PUT'], strict_slashes=False)
@auth
def validate_policy(fileId: str) -> object:
    """
    Validates a file
    :param fileId: File Object ID
    :return: JSON of submission state
    """

    policy = get_policies()

    db=Db()

    log.debug("Policies")
    log.debug(policy)
    for i in range(len(policy)):
        log.debug("rule")
        log.debug(policy[i])
        results = db.Results.objects(file_id=fileId, rule_id=policy[i]['name'])

        log.debug("checking result length")
        if (len(results) == 0):
            log.debug("no results")
            result = db.Results(
                file_id=fileId,
                message="",
                rule_id=policy[i]['name'],
                state=2,
                mandatory=policy[i]['mandatory']
            )
            log.debug("pre save")
            result.save()
            log.debug("creating validator")
            v = Validator(policy[i], result)
            log.debug("calling start validate")
            v.start_validate()
            

    return jsonify({"message": "Successful"}), HTTPStatus.CREATED


@validate.route('/<string:fileId>/<string:ruleId>',
           methods=['GET'], strict_slashes=False)
@auth
def validate_rule_result(fileId: str, ruleId: str) -> object:
    """
    Returns the result of file with specific rule
    :param fileId: File Object ID
    :param ruleId: Rule Object ID
    :return: JSON of validation result
    """
    db = Db()
    return db.Results.objects(file_id=fileId, rule_id=ruleId).to_json()



@validate.route('/<string:fileId>/<string:ruleId>',
           methods=['PUT'], strict_slashes=False)
@auth
def validate_rule(fileId: str, ruleId: str) -> object:
    """
    Validates a file with specific rule
    :param fileId: File Object ID
    :param ruleId: Rule Object ID
    :return: JSON of submission state
    """

    db = Db()
    results = db.Results.objects(file_id=fileId, rule_id=ruleId)
    if len(results) == 0:
        return jsonify({"error": "Can't rerun a rule that hasn't been bulk run"}), HTTPStatus.BAD_REQUEST

    if len(results) == 1:
        result = results[0]
        result.state = 2
        result.save()

        policy = get_policy(None)

        if result.rule_id in policy.keys():
            v = Validator(policy[result.rule_id], result)
            v.start_validate()

            return jsonify({"message": "Successful"}), HTTPStatus.OK
        else:
            return jsonify({"error": "Rule not found in policy"}), HTTPStatus.INTERNAL_SERVER_ERROR


    return jsonify({"error": "Couldn't decide on the rule to replace"}), HTTPStatus.INTERNAL_SERVER_ERROR


def get_policies():
    conf = Config().data
    policy_api_url = conf['policyApi']
    headers = {'X-API-KEY': conf['apiSecret']}

    response = requests.get(policy_api_url + "/v1/", headers=headers)

    return response.json()

def get_policy(policy_id):
    conf = Config().data
    policy_api_url = conf['policyApi']

    response = requests.get(policy_api_url + "/" + policy_id)

    return response.json()