
import os
import pytest
import json
import unittest
import tempfile

from config import Config

from unittest import mock
from unittest.mock import Mock
from unittest.mock import patch
from pytest_mock import mocker

def test_get_validate_policy_result_with_record(client, mockdb):

    config = Config()

    response = client.get('/v1/validate/file_1', headers=[('x-api-key', config.data['apiSecret'])])
    print(response)
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 1
    assert resp[0]['file_id'] == "file_1"
    assert resp[0]['rule_id'] == "rule_1"
    assert resp[0]['state'] == 1
    assert len(resp[0]['_id']['$oid']) == len("5bac1d726fcc7e0325a6e72d")

def test_get_validate_policy_result_with_no_record(client, mockdb):
    config = Config()
    response = client.get('/v1/validate/file_not_there', headers=[('x-api-key', config.data['apiSecret'])])
    print(response)
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 0



def test_put_validate_policy_with_no_previous_result(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.get_policies')
    mock_get_policy.return_value = {"rule_1":{"Name":"Great rule 1","Source":""},"rule_2":{"Name":"Great rule 2","Source":""}}

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.start_validate')

    countBefore = mockdb.Results.objects.count()
    config = Config()
    response = client.put('/v1/validate/file_NEW', headers=[('x-api-key', config.data['apiSecret'])])
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 2

def test_put_validate_policy_with_previous_result(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.get_policies')
    mock_get_policy.return_value = {"rule_1":"b"}

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.start_validate')

    countBefore = mockdb.Results.objects.count()
    config = Config()
    response = client.put('/v1/validate/file_1', headers=[('x-api-key', config.data['apiSecret'])])
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 0

def test_put_validate_policy_with_previous_result_and_new_rule(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.get_policies')
    mock_get_policy.return_value = {"rule_1":{},"rule_NEW":{}}

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.start_validate')

    countBefore = mockdb.Results.objects.count()
    config = Config()
    response = client.put('/v1/validate/file_1', headers=[('x-api-key', config.data['apiSecret'])])
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 1
