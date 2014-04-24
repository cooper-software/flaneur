#!.env/bin/python

from flask.ext.script import Manager
from flask.ext.assets import ManageAssets
from flaneur import app, sse
from flaneur.assets import env as assets_env

manager = Manager(app)
manager.add_command("assets", ManageAssets(assets_env))

@manager.command
def run():
    """Run the flaneur server."""
    try:
        sse.run(app)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    manager.run()