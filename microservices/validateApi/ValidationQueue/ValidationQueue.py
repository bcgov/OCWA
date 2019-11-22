from multiprocessing import Queue
from config import Config
from db.db import Db
import sys
import requests
import logging

log = logging.getLogger(__name__)

class QueueObject:
    rule = None
    result = None
    size = -1

    def __init__(self, rule, result):
        self.rule = rule
        self.result = result
        self.size = -1

class ValidationQueue(object):
    q = Queue()

    @classmethod
    def getQueue(cls):
        return cls.q

    @classmethod
    def initQueue(cls):
        db = Db()
        results = db.Results.objects(state=2)

        for result in results:
            try:
                policy = get_policy(result.rule_id)[0]
                queueItem = QueueObject(policy, result)
                log.debug("Prepared queue item.. adding to queue")
                cls.q.put(queueItem)
            except:
                log.error("error getting policy from api")
                log.error(result)
                log.error(sys.exc_info()[0])

def get_policy(policy_id):
    conf = Config().data
    policy_api_url = conf['policyApi']
    headers = {'X-API-KEY': conf['apiSecret']}

    response = requests.get(policy_api_url + "v1/" + policy_id, headers=headers)

    return response.json()
    