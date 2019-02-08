# TODO: This library can cause deadlocks because pymongo isn't fork safe. Test EXTENSIVELY!
import logging
import sys
import re
from io import StringIO
from multiprocessing import Process

import boto3
from config import Config
from db.db import Db
from munch import munchify

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
    log.debug("Running validation process for " +
              rule['name'] + " got result " + str(result) + " and message " + message)
    if result:
        resultObj.state = 0
    else:
        resultObj.state = 1
        resultObj.message = "Failed " + rule['name']

    resultObj.save()


def read_file_and_evaluate(source, result):
    _, file_attributes = read_file(
        result['file_id'], not(source.find('${file.content}') == -1))
    return evaluate_source(source, file_attributes)


def evaluate_source(source, file_attributes):
    result = False
    message = ""

    def format_fn(val):
        """
        This function munchifies the file attributes and formats string val
        :param val: A template string
        :return: An interpolated string
        """
        val_temp = val.replace("${file.", "{0.")
        return val_temp.format(munchify(file_attributes))

    try:
        exec_source = niño_cédille_postulate(source, format_fn)
        print(exec_source)
        execOutput = execute_script(exec_source)
        print(execOutput)
        result = execOutput.rstrip() in ("yes", "true", "t", "1")
    except (Exception, NameError) as e:
        log.error(e)
        message = str(e)

    return result, message


def niño_cédille_postulate(source, fn):
    """
    This function implements the Niño Cédille Postulate (NCP).
    NCP asserts that no strings will likely use both a niño and cédille as
    substitute characters to temporarily escape out curly braces.

    :param source: A string to be handled by NCP
    :param fn: A lambda function to be applied while string is NCP'ed
    :return: A string with NCP and fn applied if there is no error; else source
    """
    ncp_forward = re.compile(r"(?<!\$)(?:{)(.*?)(?:})")
    ncp_reverse = re.compile(r"(?<!\$)(?:ñ)(.*?)(?:ç)")

    result = ""
    try:
        ncp_source = ncp_forward.sub(r"ñ\1ç", source)
        fn_source = fn(ncp_source)
        result = ncp_reverse.sub(r"{\1}", fn_source)
    except (Exception, NameError) as e:
        log.error(e)
        result = source

    return result


def execute_script(source):
    old_stdout = sys.stdout
    redirected_stdout = sys.stdout = StringIO()
    exec(source)
    sys.stdout = old_stdout

    return redirected_stdout.getvalue().lower()


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
            ftIndex = 'Filetype'

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
