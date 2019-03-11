# TODO: This library can cause deadlocks because pymongo isn't fork safe. Test EXTENSIVELY!
import logging
import re
import sys
import time
from io import StringIO
from multiprocessing import Process

import boto3
from config import Config
from db.db import Db
from munch import munchify
import magic
from ValidationQueue.ValidationQueue import ValidationQueue, QueueObject

log = logging.getLogger(__name__)

# sleep time in seconds
SLEEP_TIME = 10

# aborting?
ABORTING = False

class Validator:
    proc = None

    def abort():
        ABORTING = True
        self.proc.join()

    def start_validate_process(self):
        log.debug("Starting validation header process")
        
        ValidationQueue.initQueue()

        self.proc = Process(target=validateProcess)
        self.proc.start()

    def start_validate(self, rule, result):
        log.debug("Adding to queue")
        item = QueueObject(rule, result)
        ValidationQueue.getQueue().put(item)


def validateProcess():
    conf = Config().data
    processes = []
    workingSize = 0
    workingLimit = conf['workingLimit']
    config = Config().conf.data
    endpoint = config['storage']['endpoint']
    bucket = config['storage']['bucket']
    access_key_id = config['storage']['access_key']
    access_secret_id = config['storage']['secret_key']

    conn = boto3.client(service_name='s3',
                        aws_access_key_id=access_key_id,
                        aws_secret_access_key=access_secret_id,
                        endpoint_url=endpoint)
    
    while not(ABORTING):
        #queue work
        if ValidationQueue.getQueue().empty():
            time.sleep(SLEEP_TIME)
        else:
            item = ValidationQueue.getQueue().get(False)
            if item.size == -1:
                try:
                    headObj = conn.head_object(Bucket=bucket, Key=item.result.file_id)
                    item.size = headObj['ContentLength']
                except:
                    log.error("error getting object from s3")
                

            if item.size > workingLimit:
                # Can't ever scan this it's too big
                item.result.message = "File is too large to be validated"
                item.result.state = 0 # pass
                if ('failOverWorkingLimit' in config) and (config['failOverWorkingLimit']):
                    item.result.state = 1 # fail

                item.result.save()

            elif (workingSize+item.size) > workingLimit:
                # can't work on yet, too big
                onlyOneItem = ValidationQueue.getQueue().empty()
                ValidationQueue.getQueue().put(item)
                if onlyOneItem:
                    time.sleep(SLEEP_TIME)
            else:
                # can start work on now
                workingSize += item.size
                proc = Process(target=validate, args=(item.rule, item.result))
                proc.start()
                processes.append({'size': item.size, 'proc': proc})
        
        #process trimming
        index = 0
        for i in range(len(processes)):
            if not(processes[i]['proc'].is_alive()):
                #process is done
                workingSize -= processes[index]['size']
                index = index - 1

            index = index + 1

    # aborting, wait till all the processes exit
    for i in range(len(processes)):
        if processes[i]['proc'].is_alive():
            processes[i]['proc'].join()




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
        result['file_id'], '${file.content}' in source)
    return evaluate_source(source, file_attributes)


def evaluate_source(source, file_attributes):
    PREFIX = "file."
    result = False
    message = ""

    # def format_fn(val):
    #     """
    #     This function munchifies the file attributes and formats string val
    #     :param val: A template string
    #     :return: An interpolated string
    #     """
    #     val_temp = val.replace("${file.", "{0.")
    #     return val_temp.format(munchify(file_attributes))

    try:
        munch_attr = munchify(file_attributes)

        # Tokenize the source to look for any "${", "file.something" and "}"
        src_split = re.split(r"(\${)(file..*?)(})", source)
        # Drop "${" and "}" from the token list
        src_parts = [x for x in src_split if x not in ("${", "}")]
        # In-place replace any "file.something" with appropriate attribute
        src_sub = [munch_attr.get(x[len(PREFIX):]) if x.startswith(
            PREFIX) else x for x in src_parts]
        # Concatenate all tokens back into a single executable string
        exec_src = "".join(map(str, src_sub))
        # exec_src = niño_cédille_postulate(source, format_fn)

        exec_output = execute_script(exec_src)
        log.info(exec_output)
        result = exec_output.rstrip() in ("yes", "true", "t", "1")
    except (Exception, NameError) as e:
        log.error(e)
        message = str(e)

    return result, message


# def niño_cédille_postulate(source, fn):
#     """
#     This function implements the Niño Cédille Postulate (NCP).
#     NCP asserts that no strings will likely use both a niño and cédille as
#     substitute characters to temporarily escape out curly braces.
#     Note: this will not work on JSON sources with more than one nested level

#     :param source: A string to be handled by NCP
#     :param fn: A lambda function to be applied while string is NCP'ed
#     :return: A string with NCP and fn applied if there is no error; else source
#     """
#     ncp_forward = re.compile(r"(?<!\$)(?:{)(.*?)(?:})")
#     ncp_reverse = re.compile(r"(?<!\$)(?:ñ)(.*?)(?:ç)")

#     result = ""
#     try:
#         ncp_source = ncp_forward.sub(r"ñ\1ç", source)
#         fn_source = fn(ncp_source)
#         result = ncp_reverse.sub(r"{\1}", fn_source)
#     except (Exception, NameError) as e:
#         log.error(e)
#         result = source

#     return result


def execute_script(source):
    """
    Temporarily intercept stdout and attempt to execute source
    :param source: Python source code string to execute
    :returns: Standard output of execution in lowercase
    :raises: Exception
    """
    old_stdout = sys.stdout
    redirected_stdout = sys.stdout = StringIO()

    try:
        exec(source)
    except Exception as e:
        log.error("Failed to execute source script")
        raise e
    finally:
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

        origMime = ""
        if ftIndex in file:
            origMime = file[ftIndex]

        # Note: Boto3 is unable to properly read a chunk and repeat in certain cases
        # The connection hangs and times out when read multiple times
        contentBody = fileResp['Body'].read()
        newMime = magic.from_buffer(contentBody, mime=True)

        if origMime != newMime:
            log.debug("Replacing mimetype")
            _ = conn.copy_object(Bucket=bucket,
                                 Key=file_id,
                                 ContentType=newMime,
                                 MetadataDirective="REPLACE",
                                 CopySource=bucket+"/"+file_id,
                                 Metadata=fileResp['Metadata'])
            file[ftIndex] = newMime
            log.debug("Done replacing mimetype")

        log.debug(file)

        index = file[ftIndex].find('/')
        if index > -1:
            file['extension'] = file[ftIndex][(index+1):]

        file['content'] = ""
        if deep_read:
            file['content'] = contentBody

    except (Exception) as e:
        log.debug("Failed to get file")
        log.debug("Error %s" % str(e))
        raise

    return fileResp, file
