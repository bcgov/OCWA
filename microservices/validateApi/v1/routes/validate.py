try:  # Python 3.5+
    from http import HTTPStatus as HTTPStatus
except ImportError:
    from http import client as HTTPStatus
from flask import Blueprint, jsonify, request
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


@validate.route('/',
           methods=['GET'], strict_slashes=False)
@auth
def get_files_results() -> object:
    """
    Returns the result of files
    :param fileId: File Object ID
    :return: JSON of validation result
    """

    if 'files' in request.args:
        files = request.args.get('files').split(',')
        if len(files) > 25:
            return jsonify({"error": "Too many files specified.  Max 25 allowed."}), HTTPStatus.INTERNAL_SERVER_ERROR
    else:
        return jsonify({"error": "Atleast one file ID must be specified."}), HTTPStatus.INTERNAL_SERVER_ERROR
    
    db = Db()
    return db.Results.objects(file_id__in = files).to_json()


@validate.route('/<string:fileId>',
           methods=['GET'], strict_slashes=False)
@auth
def get_file_results(fileId: str) -> object:
    """
    Returns the result of file
    :param fileId: File Object ID
    :return: JSON of validation result
    """

    db = Db()
    return db.Results.objects(file_id=fileId).to_json()


@validate.route('/<string:fileId>/<string:policyName>',
           methods=['PUT'], strict_slashes=False)
@auth
def validate_policy(policyName: str, fileId: str) -> object:
    """
    Validates a file
    :param fileId: File Object ID
    :return: JSON of submission state
    """

    policy = get_policy(policyName)

    db=Db()

    log.debug("Policies")
    log.debug(policy)
    for i in range(len(policy)):
        log.debug("rule")
        log.debug(policy[i])
        results = db.Results.objects(file_id=fileId, rule_id=policy[i]['name'])

        log.debug("checking result length")
        log.debug(fileId)
        log.debug(policy[i]['name'])
        log.debug(results)

        conf = Config().data

        alwaysScan = conf.get('alwaysScanFiles', False)

        if ( (len(results) == 0) or (alwaysScan) ):
            log.debug("no results")
            result = db.Results(
                file_id=fileId,
                message="",
                rule_id=policy[i]['name'],
                state=2,
                mandatory=policy[i]['mandatory']
            )

            if alwaysScan and len(results) > 0:
                result = results[0]

            log.debug("pre save")
            result.save()
            log.debug("creating validator")
            log.debug("calling start validate")
            v = Validator()
            v.start_validate(policy[i], result)
            

    return jsonify({"message": "Successful"}), HTTPStatus.CREATED


@validate.route('/<string:fileId>/rules/<string:ruleId>',
           methods=['GET'], strict_slashes=False)
@auth
def get_rule_result(fileId: str, ruleId: str) -> object:
    """
    Returns the result of file with specific rule
    :param fileId: File Object ID
    :param ruleId: Rule Object ID
    :return: JSON of validation result
    """
    db = Db()
    return db.Results.objects(file_id=fileId, rule_id=ruleId).to_json()



@validate.route('/<string:fileId>/rules/<string:ruleId>',
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

        rule = get_rule(ruleId)

        if len(rule) == 1 and rule[0]['name'] == ruleId:
            v = Validator()
            v.start_validate(rule[0], result)

            return jsonify({"message": "Successful"}), HTTPStatus.OK
        else:
            return jsonify({"error": "Rule not found"}), HTTPStatus.INTERNAL_SERVER_ERROR


    return jsonify({"error": "Couldn't decide on the rule to replace"}), HTTPStatus.INTERNAL_SERVER_ERROR


def get_policy(policy):
    conf = Config().data
    policy_api_url = conf['policyApi']
    headers = {'X-API-KEY': conf['apiSecret']}

    response = requests.get(policy_api_url + "/v1/" + policy, headers=headers)

    return response.json()

def get_rule(rule):
    conf = Config().data
    policy_api_url = conf['policyApi']
    headers = {'X-API-KEY': conf['apiSecret']}

    response = requests.get(policy_api_url + "/v1/rules/" + rule, headers=headers)
    return response.json()
