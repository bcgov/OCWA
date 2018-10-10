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


import config

conf = config.Config()

def main(port: int = conf.data['apiPort']) -> object:
    """
    Run the Server
    :param port: Port number
    :return:
    """
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(levelname)s - %(message)s')

    if sys.version_info[0] < 3:
        log.error('Server requires Python 3')
        return

    log.info('Loading server...')
    load_start = timer()
    http = WSGIServer(('', port), app.wsgi_app)
    load_end = timer()
    log.info('Load time: %s', str(load_end - load_start))

    log.info('Serving on port %s', str(port))
    http.serve_forever()
    log.info('Server terminated!')


if __name__ == '__main__':
    main()
