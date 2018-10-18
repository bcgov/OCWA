
import os
#import server
import pytest
import unittest
import tempfile
from config import Config


def test_status(client):
    config = Config()
    response = client.get('/v1/status', headers=[('x-api-key', config.data['apiSecret'])])
    print(response)
    assert response.data == b'{"status":"ok"}\n'
