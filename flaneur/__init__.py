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
from scheduler import get_scheduler

def create_app():
    scheduler = get_scheduler()
    scheduler.start()
    return app


def run():
    from gevent.wsgi import WSGIServer
    scheduler = get_scheduler()
    scheduler.start()
    app.debug = True
    server = WSGIServer(("", 3333), app)
    server.serve_forever()


if __name__ == "__main__":
    run()