from mongoengine import connect, disconnect
from mongoengine.connection import _connections
from multiprocessing import current_process
from config import Config
from db.models.results import Results
import os
import logging
log = logging.getLogger(__name__)

class Db:
    Results = None
    def __init__(self, createClient=True, maxPoolSize=10):
        config = Config()
        self.db = {}
        self.Results = Results
        self.createClient = createClient
        self.maxPoolSize = maxPoolSize
        self.initConnection(config)
        logid = "DB [" + str(os.getpid()) + "](" + current_process().name + ") "
        log.debug(logid + "Connections " + str(_connections))


    def initConnection(self, config):
        connect(
            db=config.data['database']['dbName'],
            host=config.data['database']['host'],
            port=config.data['database']['port'],
            username=config.data['database']['username'],
            password=config.data['database']['password'],
            authentication_source=config.data['database']['dbName'],
            maxPoolSize=self.maxPoolSize,
            minPoolSize=1,
            connect=self.createClient)

    def disconnect(self):
        disconnect()

    def connections(self):
        return _connections