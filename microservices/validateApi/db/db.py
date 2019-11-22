from mongoengine import connect
from config import Config
from db.models.results import Results

config = Config()
connect(
    db=config.data['database']['dbName'],
    host=config.data['database']['host'],
    port=config.data['database']['port'],
    username=config.data['database']['username'],
    password=config.data['database']['password'],
    authentication_source=config.data['database']['dbName'],
    maxPoolSize=5,
    minPoolSize=1,
    connect=True)

class Db:
    Results = None
    def __init__(self, createClient=True):
        config = Config()
        self.db = {}
        self.Results = Results
