
import os
#import server
import pytest
import unittest
import tempfile


def test_status(client):
    response = client.get('/v1/status')
    assert response.data == b'{"status":"ok"}\n'