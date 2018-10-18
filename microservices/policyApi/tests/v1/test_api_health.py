

def test_index(client):
    response = client.get('/')
    assert response.data == b'["http://localhost/v1/status"]\n'
