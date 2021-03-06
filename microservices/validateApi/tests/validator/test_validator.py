import unittest
import pytest
import re
import os
import logging
from unittest import mock
from munch import munchify

from db.models.results import Results
from validator import validator


@pytest.mark.usefixtures("mockdb")
class ValidatorTest(unittest.TestCase):

    def setUp(self):
        print('setUp: Initialize instance variables')

    def tearDown(self):
        print('tearDown: Reset instance variables')

    def test_evaluate_source_simple(self):
        result, message = validator.evaluate_source("print(True)", {})
        assert result == True
        assert message == ""

    def test_evaluate_source_syntax_error(self):
        result, message = validator.evaluate_source("print($${file.size}<100)", {"size":10})
        assert result == False
        assert message == "invalid syntax (<string>, line 1)"


    def test_evaluate_source_file_size_valid(self):
        result, message = validator.evaluate_source("print(${file.size}<100)", {"size":10})
        assert result == True
        assert message == ""

    def test_evaluate_source_file_size_invalid(self):
        result, message = validator.evaluate_source("print(${file.size}<100)", {"size":1000})
        assert result == False
        assert message == ""

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_attributes_file_good(self, mock_readfile):

        mock_readfile.return_value = ({}, {"size":10})
        result, message = validator.read_file_and_evaluate("print(${file.size}<100)", {"file_id":"1234"})
        assert result == True
        assert message == ""


    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_attributes_file_too_large(self, mock_readfile):

        mock_readfile.return_value = ({}, {"size":1000})
        result, message = validator.read_file_and_evaluate("print(${file.size}<100)", {"file_id":"1234"})
        assert result == False
        assert message == ""


    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_study_id_detection(self, mock_readfile):

        assert True == bool(re.compile(b'[\\w]{1}[\\d]{9}').search("this is A333333333.".encode('ascii')))
        assert True == bool(re.compile(b'[\\w]{1}[\\d]{9}').search("A333333333".encode('ascii')))
        assert True == bool(re.compile(b'[\\w]{1}[\\d]{9}').search("A333333333 then text".encode('ascii')))
        assert True == bool(re.compile(b'[\\w]{1}[\\d]{9}').search("text then A333333333".encode('ascii')))
        assert False == bool(re.compile(b'[\\w]{1}[\\d]{9}').search("text then A333333".encode('ascii')))

        rule = "print(not bool( re.compile(b'[\\w]{1}[\\d]{9}').search(${file.content}) ))"

        content = "has A123456789 ok".encode('utf-8')
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == False
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_no_study_id_detection(self, mock_readfile):

        rule = "print(not bool( re.compile(b'[\\w]{1}[\\d]{9}').search(${file.content}) ))"

        content = "has A1236789 ok".encode('utf-8')
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == True
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_md5_scanning(self, mock_readfile):

        rule = "print(hashlib.md5(${file.content}).hexdigest() == 'a35de14e6b6fc05c77159136778aa1dd')"

        content = "has A1236789 ok".encode('utf-8')
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == True
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_md5_scanning_test2(self, mock_readfile):

        # content = b'3d7b3aec06a706596fe00bbac810b598  -\r\n'
        content = open("%s/%s" % ( os.getcwd(), 'tests/validator/md5_scan/jimbo')).read().encode('utf-8')

        rule = "print(hashlib.md5(${file.content}).hexdigest() == 'a35de14e6b6fc05c77159136778aa1dd')"

        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == False
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_md5_scanning_using_good_content(self, mock_readfile):

        rule = "print(not(md5_is_match(hashlib.md5(${file.content}).hexdigest())))"

        content = "has A1236789 ok".encode('utf-8')
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == True
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_md5_scanning_using_bad_file(self, mock_readfile):

        contents = open("%s/%s" % ( os.getcwd(), 'tests/validator/md5_scan/jimbo'), 'rb').read()

        rule = "print(not(md5_is_match(hashlib.md5(${file.content}).hexdigest())))"

        # print(not(md5_is_match(hashlib.md5(b'3d7b3aec06a706596fe00bbac810b598  -\n').hexdigest())))
        # 7c85170fb0246c3dafc35fae902a51cb
        import hashlib
        print(hashlib.md5(contents).hexdigest())
        content = contents
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == False
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_md5_scanning_using_bad_file_content(self, mock_readfile):

        rule = "print(not(md5_is_match(hashlib.md5(${file.content}).hexdigest())))"

        # print(not(md5_is_match(hashlib.md5(b'3d7b3aec06a706596fe00bbac810b598  -\r\n').hexdigest())))
        # 1c9bbf7770dfb5c63e206cf96f9c51ea

        content = b'3d7b3aec06a706596fe00bbac810b598  -\r\n'
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == False
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_md5_scanning_using_good_file(self, mock_readfile):

        contents = open("%s/%s" % ( os.getcwd(), 'tests/validator/md5_scan/safe_file')).read()

        rule = "print(not(md5_is_match(hashlib.md5(${file.content}).hexdigest())))"

        content = contents.encode('utf-8')
        mock_readfile.return_value = (content, {"size":1000, "content":content})
        
        result, message = validator.read_file_and_evaluate(rule, {"file_id":"00000000"})
        assert result == True
        assert message == ''

    @mock.patch('validator.validator.read_file')
    def test_read_file_and_evaluate_with_tighter_study_id_detection(self, mock_readfile):

        check = b'[u|s]{1}[\\d]{9}'
        assert True == bool(re.compile(check).search("this is u000000000.".encode('ascii')))
        assert True == bool(re.compile(check).search("u000000000".encode('ascii')))
        assert True == bool(re.compile(check).search("u000000000 then text".encode('ascii')))
        assert True == bool(re.compile(check).search("text then u000000000".encode('ascii')))
        assert False == bool(re.compile(check).search("text then u000000".encode('ascii')))

        assert True == bool(re.compile(check).search("this is s000000000.".encode('ascii')))
        assert True == bool(re.compile(check).search("s000000000".encode('ascii')))
        assert True == bool(re.compile(check).search("s000000000 then text".encode('ascii')))
        assert True == bool(re.compile(check).search("text then s000000000".encode('ascii')))
        assert False == bool(re.compile(check).search("text then s000000 short study id".encode('ascii')))

        assert False == bool(re.compile(check).search("this is x000000000.".encode('ascii')))
        assert False == bool(re.compile(check).search("x000000000".encode('ascii')))
        assert False == bool(re.compile(check).search("x000000000 then text".encode('ascii')))
        assert False == bool(re.compile(check).search("text then x000000000".encode('ascii')))
        assert False == bool(re.compile(check).search("text then x000000 short non-study id".encode('ascii')))

        assert False == bool(re.compile(check).search("this is U000000000".encode('ascii')))
        assert False == bool(re.compile(check).search("U000000000".encode('ascii')))


    def mock_results_save(self):
        return

    @mock.patch('db.models.results.Results.save')
    @mock.patch('validator.validator.read_file')
    def test_validate_with_valid_file_size_rule(self, mock_readfile, mock_results_save):

        results = Results()

        mock_results_save.side_effect = self.mock_results_save

        mock_readfile.return_value = ({}, {"size":10})

        rule = {
            "source": "print(${file.size}<100)",
            "name": "Max File Size Rule",
            "mandatory": True
        }
        assert results.state == None
        #validator.validate(rule, results)
        #assert results.state == 0
