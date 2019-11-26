from mongoengine import connect
from mongoengine.connection import _connections
from config import Config
from db.models.rules import Rules
from db.models.policies import Policies

from pymongo import monitoring

class Db:
    Results = None
    def __init__(self, createClient=True):
        config = Config()
        self.db = {}
        self.Rules = Rules
        self.Policies = Policies
        self.initConnection(config)

    def initConnection(self, config):
        connect(
            db=config.data['database']['dbName'],
            host=config.data['database']['host'],
            port=config.data['database']['port'],
            username=config.data['database']['username'],
            password=config.data['database']['password'],
            authentication_source=config.data['database']['dbName'],
            maxPoolSize=10,
            minPoolSize=1,
            connect=True)
