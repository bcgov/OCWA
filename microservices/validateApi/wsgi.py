#!/usr/bin/python
from gevent import monkey

# Patch Sockets to make requests asynchronous
monkey.patch_all()

import logging
import sys

from gevent.pywsgi import WSGIServer
# from server import app
from timeit import default_timer as timer
from app import create_app

app = create_app()

log = logging.getLogger(__name__)

#no zombie
import signal
validationHeaderProcess = None
def sigInt_handler(sig, frame):
    #print (validationHeaderProcess)
    #log.info('Server stopping ctrl+c received...', frame.f_globals)
    #log.info('Please wait to avoid having zombie processes')
    #if not(validationHeaderProcess is None):
    #    validationHeaderProcess.abort()
    log.info('Server terminated!')
    sys.exit(0)

import config
from v1.validator.validator import Validator

conf = config.Config()

def main(port: int = conf.data['apiPort']) -> object:
    """
    Run the Server
    :param port: Port number
    :return:
    """


    config = conf.conf.data
    logLevel = config['logLevel'].upper()

    loggingLevel = getattr(logging, logLevel)

    logging.basicConfig(level=loggingLevel,
                        format='%(asctime)s - %(levelname)s - %(message)s')

    if sys.version_info[0] < 3:
        log.error('Server requires Python 3')
        return

    log.info('Loading server...')
    load_start = timer()
    http = WSGIServer(('', port), app.wsgi_app)
    load_end = timer()
    log.info('Load time: %s', str(load_end - load_start))

    log.info("adding signal catcher")
    signal.signal(signal.SIGINT, sigInt_handler)

    log.info("initializing validation process...")
    validationHeaderProcess = Validator()
    validationHeaderProcess.start_validate_process()

    print (validationHeaderProcess)

    

    log.info('Serving on port %s', str(port))
    http.serve_forever()
    log.info('Server terminated!')


if __name__ == '__main__':
    main()
