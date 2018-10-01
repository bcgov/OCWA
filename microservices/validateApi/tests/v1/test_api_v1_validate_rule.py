
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

def test_get_validate_rule_result(client, mocker, mockdb):

    response = client.get('/v1/validate/file_1/rule_1')

    resp = json.loads(response.data)

    assert len(resp) == 1
    assert resp[0]['file_id'] == "file_1"
    assert resp[0]['rule_id'] == "rule_1"
    assert len(resp[0]['_id']['$oid']) == len("5bac1d726fcc7e0325a6e72d")

def test_put_validate_rule_with_invalid_file(client, mocker, mockdb):

    response = client.put('/v1/validate/file_XXX/rule_1')

    assert response.data == b'{"error":"Can\'t rerun a rule that hasn\'t been bulk run"}\n'

def test_put_validate_rule_with_unexpected_data(client, mocker, mockdb):

    response = client.put('/v1/validate/file_2/rule_1')

    assert response.data == b'{"error":"Couldn\'t decide on the rule to replace"}\n'

def test_put_validate_rule_with_missing_rule_in_policy(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.getPolicy')
    mock_get_policy.return_value = {}

    response = client.put('/v1/validate/file_1/rule_1')

    assert response.data == b'{"error":"Rule not found in policy"}\n'

def test_put_validate_rule_new(client, mocker, mockdb):
    mock_get_policy = mocker.patch('v1.routes.validate.getPolicy')
    mock_get_policy.return_value = {"rule_1":{"Name":"Great rule 1","Source":"${file.size}<100"}}

    mock_validator_validate = mocker.patch('v1.validator.validator.Validator.startValidate')
    mock_validator_validate.return_value = True

    countBefore = mockdb.Results.objects.count()

    response = client.put('/v1/validate/file_1/rule_1')
    assert response.data == b'{"message":"Successful"}\n'

    countAfter = mockdb.Results.objects.count()
    assert countAfter - countBefore == 0

    response = client.get('/v1/validate/file_1')
    print(response.data)
    resp = json.loads(response.data)
    assert resp[0]['state'] == 2
