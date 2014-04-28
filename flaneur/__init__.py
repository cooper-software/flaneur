from flask import Flask
import os, sys

app = Flask("flaneur")
app.config.from_object('flaneur.config')

if 'FLANEUR_SETTINGS' in os.environ:
    app.config.from_envvar('FLANEUR_SETTINGS')

import assets
import views
import sse
from scheduler import scheduler

def run():
    try:
        scheduler.start()
        app.run(threaded=True, use_reloader=False)
    except KeyboardInterrupt, SystemExit:
        scheduler.shutdown()
        sys.exit()


if __name__ == "__main__":
    run()