
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

def test_get_validate_with_multiple_files(client, mockdb):

    config = Config()

    response = client.get('/v1/validate?files=file_1,file_2', headers=[('x-api-key', config.data['apiSecret'])])
    print(response)
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 3

def test_get_validate_with_list_of_one(client, mockdb):

    config = Config()

    response = client.get('/v1/validate?files=file_1', headers=[('x-api-key', config.data['apiSecret'])])
    print(response)
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 1
    assert resp[0]['file_id'] == "file_1"
    assert resp[0]['rule_id'] == "rule_1"
    assert resp[0]['state'] == 1
    assert len(resp[0]['_id']['$oid']) == len("5bac1d726fcc7e0325a6e72d")

def test_get_validate_with_too_many_files(client, mockdb):

    config = Config()

    files = []
    for a in range(0,26):
        files.append("file%d" % a)
    files = ','.join(files)
    response = client.get("/v1/validate?files=%s" % files, headers=[('x-api-key', config.data['apiSecret'])])
    assert response.status_code != 200
    print(response)
    assert response.data == b'{"error":"Too many files specified.  Max 25 allowed."}\n'


def test_get_validate_with_no_files(client, mockdb):

    config = Config()

    files = []
    for a in range(1,27):
        files.append("file%d" % a)
    files = ','.join(files)
    response = client.get("/v1/validate", headers=[('x-api-key', config.data['apiSecret'])])
    assert response.status_code != 200
    print(response)
    assert response.data == b'{"error":"Atleast one file ID must be specified."}\n'


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
    mock_get_policy = mocker.patch('v1.routes.validate.get_policy')
    mock_get_policy.return_value = [{"_id": {"$oid": "1"}, "name":"Great rule 1","source":"", "mandatory": False},{"_id": {"$oid": "2"}, "name":"Great rule 2","source":"", "mandatory": False}]

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.start_validate')

    countBefore = mockdb.Results.objects.count()
    config = Config()
    response = client.put('/v1/validate/file_NEW/mocked_policy', headers=[('x-api-key', config.data['apiSecret'])])
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 2

def test_put_validate_policy_with_previous_result(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.get_policy')
    mock_get_policy.return_value = [{"_id": {"$oid": "1"}, "name":"rule_1","source":"", "mandatory": False}]

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.start_validate')

    countBefore = mockdb.Results.objects.count()
    config = Config()
    response = client.put('/v1/validate/file_1/mocked_policy', headers=[('x-api-key', config.data['apiSecret'])])
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 0

def test_put_validate_policy_with_previous_result_and_new_rule(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.get_policy')
    mock_get_policy.return_value = [{"_id":{"$oid": "5"}, "name": "rule_NEW", "source":"", "mandatory": False}]

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.start_validate')

    countBefore = mockdb.Results.objects.count()
    config = Config()
    response = client.put('/v1/validate/file_1/mocked_policy', headers=[('x-api-key', config.data['apiSecret'])])
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 1
