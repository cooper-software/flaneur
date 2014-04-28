from flask import Flask
import os, sys

app = Flask("flaneur")
app.config.from_object('flaneur.config')

if 'FLANEUR_SETTINGS' in os.environ:
    app.config.from_envvar('FLANEUR_SETTINGS')

#if not app.debug:
if True:
    import logging
    logging.basicConfig(filename='flaneur.log', level=logging.DEBUG,
            format='%(levelname)s[%(asctime)s]: %(message)s')

import assets
import views
import sse
from scheduler import scheduler

def _run():
    try:
        scheduler.start()
        app.run(threaded=True, use_reloader=False, processes=1)
    except KeyboardInterrupt, SystemExit:
        scheduler.shutdown()
        

def run():        
    import multiprocessing
    server = multiprocessing.Process(target=_run)
    server.start()
    try:
        server.join()
    except KeyboardInterrupt, SystemExit:
        server.join(2)
        if server.is_alive:
            server.terminate()
        


if __name__ == "__main__":
    run()