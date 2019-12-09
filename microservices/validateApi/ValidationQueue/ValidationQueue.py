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
                rule = get_policy_rule(result.rule_id)[0]
                queueItem = QueueObject(rule, result)
                log.debug("Prepared queue item.. adding to queue")
                cls.q.put(queueItem)
                log.debug("Added to queue (current queue height %d)" % cls.q.qsize())
            except:
                log.error("error getting policy from api")
                log.error(result)
                log.error(sys.exc_info()[0])

        db.disconnect()

        log.info("Added %d pending items to queue." % len(results))

def get_policy_rule(rule_id):
    conf = Config().data
    policy_api_url = conf['policyApi']
    headers = {'X-API-KEY': conf['apiSecret']}

    response = requests.get(policy_api_url + "/v1/rules/" + rule_id, headers=headers)

    return response.json()
    