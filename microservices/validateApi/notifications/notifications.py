import logging
import json
import requests
from config import Config

log = logging.getLogger(__name__)

class Notifications:

    def publish(self, event, json_payload):
        log.debug("Notifications / Event - %s", event)

        conf = Config().conf.data
        subscribers = conf['subscribers']

        for sub in subscribers:
            log.debug("Notifications / Send event to %s/%s", sub['endpoint'], event)

            headers = {
                "Content-Type" : "application/json",
                "Authorization": "Api-Key %s" % sub['api_key']
            }

            r = requests.post("%s/%s" % (sub['endpoint'], event), data = json_payload.encode('utf-8'), headers = headers)
            if r.status_code != 200:
                log.error("Notifications / Send event to %s/%s failed. [%d] %s", sub['endpoint'], event, r.status_code, r.text)
            else:
                log.debug("Notifications / Event %s/%s sent. [%d]", sub['endpoint'], event, r.status_code)
