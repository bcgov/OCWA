##TODO: This library may in fact cause deadlocks because pymongo isn't fork safe. Test EXTENSIVELY

from multiprocessing import Process
from db.db import Db
import boto3
from config import Config
from munch import munchify
#import re #uncomment if we use the regular expression method

class Validator:

    rule = ""
    result = None
    proc = None


    def __init__(self, rule, result):
        self.rule = rule
        self.result = result

    def start_validate(self):
        print("Starting validation process")
        self.proc = Process(target=validate, args=(self.rule, self.result))
        self.proc.start()


def validate(rule, resultObj):

    result, message = read_file_and_evaluate(rule['Source'], resultObj)
    print("Running validation process for " + rule['Name'] + " got result " + str(result) + " and message " + message)
    if result:
        resultObj.state = 0
    else:
        resultObj.state = 1
        resultObj.message = "Failed " + rule['Name']

    resultObj.save()


def read_file_and_evaluate(source, result):
    file_resp, file_attributes = read_file(result['file_id'])
    return evaluate_source(source, file_attributes)


def evaluate_source(source, file_attributes):
    munchified_attributes = munchify(file_attributes)

    source = source.replace("${file.", "{0.")

    result = False
    message = ""

    try:
        source = source.format(munchified_attributes)
        result = eval(source)
    except (Exception, NameError) as e:
        print(e)
        message = str(e)

    return result, message

def read_file(file_id):

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
        fileResp = conn.get_object(Bucket=bucket, key=file_id)

        for key, val in fileResp['ResponseMetadata'].items():
            file[key] = val

        for key, val in fileResp['Metadata'].items():
            file[key] = val

        if "content-length" in fileResp['ResponseMetadata']['HTTPHeaders']:
            file["size"] = fileResp['ResponseMetadata']['HTTPHeaders']['content-length']

    except (Exception) as e:
        print("Failed to get file")
        print("Error %s" % str(e))
        raise

    return fileResp, file
 