
import os
#import server
import pytest
import unittest
import tempfile


def test_index(client):
    response = client.get('/')
    assert response.data == b'["http://localhost/v1/status"]\n'

def test_hello(client):
    response = client.get('/hello')
    assert response.data == b'Hello, World!'
