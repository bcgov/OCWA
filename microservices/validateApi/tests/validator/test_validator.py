import unittest
from unittest import mock
from munch import munchify

from db.models.results import Results
from validator import validator

class ValidatorTest(unittest.TestCase):

    def setUp(self):
        print('setUp: Initialize instance variables')

    def tearDown(self):
        print('tearDown: Reset instance variables')

    def test_evaluate_source_simple(self):
        result, message = validator.evaluate_source("True", {})
        assert result == True
        assert message == ""

    def test_evaluate_source_syntax_error(self):
        result, message = validator.evaluate_source("$${file.size}<100", {"size":10})
        assert result == False
        assert message == "invalid syntax (<string>, line 1)"


    def test_evaluate_source_file_size_valid(self):
        result, message = validator.evaluate_source("${file.size}<100", {"size":10})
        assert result == True
        assert message == ""

    def test_evaluate_source_file_size_invalid(self):
        result, message = validator.evaluate_source("${file.size}<100", {"size":1000})
        assert result == False
        assert message == ""

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_attributes_file_good(self, mock_readfile):

        mock_readfile.return_value = ({}, {"size":10})
        result, message = validator.read_file_and_evaluate("${file.size}<100", {"file_id":"1234"})
        assert result == True
        assert message == ""


    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_attributes_file_too_large(self, mock_readfile):

        mock_readfile.return_value = ({}, {"size":1000})
        result, message = validator.read_file_and_evaluate("${file.size}<100", {"file_id":"1234"})
        assert result == False
        assert message == ""

    def mock_results_save(self):
        return

    @mock.patch('db.models.results.Results.save')
    @mock.patch('validator.validator.read_file')
    def test_validate_with_valid_file_size_rule(self, mock_readfile, mock_results_save):

        results = Results()

        mock_results_save.side_effect = self.mock_results_save

        mock_readfile.return_value = ({}, {"size":10})

        rule = {
            "Source": "${file.size}<100",
            "Name": "Max File Size Rule"
        }
        assert results.state == None
        validator.validate(rule, results)
        assert results.state == 0
