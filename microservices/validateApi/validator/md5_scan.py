
import logging
from config import Config

config = Config().data

log = logging.getLogger(__name__)

def md5_is_match (md5):
    md5_scan_file = config.get("md5_scan_file_path")

    with open(md5_scan_file) as f:
        content = f.readlines()

    for line in content:
        log.debug("md5_is_match? '%s' - from list '%s'" % (md5,line[8:48].strip()))
        if md5 == line[8:48].strip():
            return True
    return False