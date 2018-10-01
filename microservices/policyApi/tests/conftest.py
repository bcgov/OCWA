import pytest

from app import create_app

from mongoengine import connect

from db.db import Db

def mock_db(self):
    connect('mongoenginetest', host='mongomock://localhost')

@pytest.fixture(scope="function")
def mockdb(mocker):
    """A test mock database."""
    mock_init_conn = mocker.patch('db.db.Db.initConnection')
    mock_init_conn.side_effect = mock_db

    db = Db()
    # Tried scoping to module - but mocker is function, so not able.  Is there a bulk delete?
    for r in Db.Rules.objects():
        r.delete()
    Rules(name="rule1",source="${file.name}!=badFile",mandatory=False).save()
    Rules(name="rule2",source="${file.size}<500",state=1,mandatory=True).save()

    return db

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""

    app = create_app({"database":{}})

    yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()
