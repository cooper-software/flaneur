#!.env/bin/python

from flask.ext.script import Manager
from flaneur import app, run as run_app

manager = Manager(app)

@manager.command
def run():
    """Run the flaneur server."""
    run_app()


if __name__ == "__main__":
    manager.run()