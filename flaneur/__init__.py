from flask import Flask, Blueprint
import os, sys

app = Flask("flaneur")
app.config.from_object('flaneur.config')

if 'FLANEUR_SETTINGS' in os.environ:
    app.config.from_envvar('FLANEUR_SETTINGS')

import logging
log_level = logging.DEBUG
log_format = '%(levelname)s[%(asctime)s]: %(message)s'


if app.debug:
    logging.basicConfig(stream=sys.stderr, level=log_level, format=log_format)

else:
    logging.basicConfig(filename=app.config['LOG_FILE'], level=log_level, format=log_format)

import assets
import views
import sse
from scheduler import get_scheduler

widgets_blueprint = Blueprint('widgets', __name__, static_url_path='/widgets', static_folder='./widgets')
app.register_blueprint(widgets_blueprint)


def create_app():
    scheduler = get_scheduler()
    scheduler.start()
    return app


def run():
    from gevent.wsgi import WSGIServer
    scheduler = get_scheduler()
    scheduler.start()
    app.debug = True
    PORT = 3333
    server = WSGIServer(("", PORT), app)
    print "Running server on localhost:%d" % PORT
    server.serve_forever()


if __name__ == "__main__":
    run()