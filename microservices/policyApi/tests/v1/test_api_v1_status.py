
def test_status(client):
    response = client.get('/v1/status')
    assert response.data == b'{"status":"ok"}\n'