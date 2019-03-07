import queue
from config import Config
import db
import ut

class QueueObject(object):
    self.rule = None
    self.result = None
    self.size = -1

    __init__(rule, result):
        self.rule = rule
        self.result = result

class ValidationQueue(object):
    q = queue.Queue()

    @classmethod
    def getQueue(cls):
        return cls.q

    @classmethod
    def initQueue(cls):
        results = db.Results.objects(state=2)

        for i in range(len(results)):
            policy = get_policy(results[i].policy_id)
            queueItem = new QueueObject(policy, results[i])
            cls.q.put(results[i])

def get_policy(policy_id):
    conf = Config().data
    policy_api_url = conf['policyApi']

    response = requests.get(policy_api_url + "/" + policy_id)

    return response.json()