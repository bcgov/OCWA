##TODO: This library may in fact cause deadlocks because pymongo isn't fork safe. Test EXTENSIVELY

from multiprocessing import Process
from db.db import Db
import boto3
from config import Config
from munch import munchify
#import re #uncomment if we use the regular expression method
from io import StringIO
import sys
import logging
log = logging.getLogger(__name__)

class Validator:

    rule = ""
    result = None
    proc = None


    def __init__(self, rule, result):
        self.rule = rule
        self.result = result

    def start_validate(self):
        log.debug("Starting validation process")
        self.proc = Process(target=validate, args=(self.rule, self.result))
        self.proc.start()


def validate(rule, resultObj):

    source = ""
    if 'Source' in rule:
        source = rule['Source']
    else:
        source = rule['source']

    result, message = read_file_and_evaluate(source, resultObj)
    log.debug("Running validation process for " + rule['name'] + " got result " + str(result) + " and message " + message)
    if result:
        resultObj.state = 0
    else:
        resultObj.state = 1
        resultObj.message = "Failed " + rule['name']

    resultObj.save()


def read_file_and_evaluate(source, result):
    file_resp, file_attributes = read_file(result['file_id'], not(source.find('${file.content}') == -1))
    return evaluate_source(source, file_attributes)


def evaluate_source(source, file_attributes):
    munchified_attributes = munchify(file_attributes)

    source = source.replace("${file.", "{0.")

    result = False
    message = ""

    try:
        source = source.format(munchified_attributes)
        old_stdout = sys.stdout
        redirected_stdout = sys.stdout = StringIO()
        exec(source)
        sys.stdout = old_stdout
        execOutput = redirected_stdout.getvalue().lower()
        print(execOutput)
        result = execOutput in ("yes", "true", "t", "1", "yes\n", "true\n", "t\n", "1\n")
    except (Exception, NameError) as e:
        log.error(e)
        message = str(e)

    return result, message

def read_file(file_id, deep_read=False):

    config = Config().conf.data
    endpoint = config['storage']['endpoint']
    bucket = config['storage']['bucket']
    access_key_id = config['storage']['access_key']
    access_secret_id = config['storage']['secret_key']

    conn = boto3.client(service_name='s3',
                        aws_access_key_id=access_key_id,
                        aws_secret_access_key=access_secret_id,
                        endpoint_url=endpoint)

    file = {}
    try:
        fileResp = conn.get_object(Bucket=bucket, Key=file_id)

        for key, val in fileResp['ResponseMetadata'].items():
            file[key] = val

        for key, val in fileResp['Metadata'].items():
            file[key] = val

        if "content-length" in fileResp['ResponseMetadata']['HTTPHeaders']:
            file["size"] = fileResp['ResponseMetadata']['HTTPHeaders']['content-length']

        ftIndex = 'filetype'
        if 'Filetype' in file:
            ftIndex='Filetype'

        log.debug(file)

        index = file[ftIndex].find('/')
        if index > -1:
            file['extension'] = file[ftIndex][(index+1):]

        file['content'] = ""
        if deep_read:
            file['content'] = fileResp['Body'].read()


    except (Exception) as e:
        log.debug("Failed to get file")
        log.debug("Error %s" % str(e))
        raise

    return fileResp, file
 