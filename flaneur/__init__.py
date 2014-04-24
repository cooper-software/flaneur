from flask import Flask
import os

app = Flask("flaneur")
app.config.from_object('flaneur.config')

if 'FLANEUR_SETTINGS' in os.environ:
    app.config.from_envvar('FLANEUR_SETTINGS')

import assets
import views
import sse

if __name__ == "__main__":
    sse.run(app)