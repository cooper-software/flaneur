from instagram.client import InstagramAPI
from flaneur import app

def get_client():
    return InstagramAPI(
        client_id=app.config['INSTAGRAM']['client_id'],
        client_secret=app.config['INSTAGRAM']['client_secret']
    )