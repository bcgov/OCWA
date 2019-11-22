from mongoengine import connect
from mongoengine.connection import _connections
from config import Config
from db.models.rules import Rules
from db.models.policies import Policies

import logging
from pymongo import monitoring

log = logging.getLogger(__name__)

# class CommandLogger(monitoring.CommandListener):

#     def started(self, event):
#         log.debug("Command {0.command_name} with request id "
#                  "{0.request_id} started on server "
#                  "{0.connection_id}".format(event))

#     def succeeded(self, event):
#         log.debug("Command {0.command_name} with request id "
#                  "{0.request_id} on server {0.connection_id} "
#                  "succeeded in {0.duration_micros} "
#                  "microseconds".format(event))

#     def failed(self, event):
#         log.debug("Command {0.command_name} with request id "
#                  "{0.request_id} on server {0.connection_id} "
#                  "failed in {0.duration_micros} "
#                  "microseconds".format(event))

# monitoring.register(CommandLogger())

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
        self.Rules = Rules
        self.Policies = Policies

