
import os
#import server
import pytest
import unittest
import tempfile


def test_status(client):
    response = client.get('/v1/status')
    assert response.data == b'{"status":"ok"}\n'

def test_get_validate(client):
    response = client.get('/v1/validate')
    assert response.data == b'{"message":"Successful"}\n'
