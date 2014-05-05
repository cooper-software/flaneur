from twitter import *
from flaneur import app


def auth():
    options = app.config['TWITTER']
    return OAuth(
        consumer_key=options['consumer_key'],
        consumer_secret=options['consumer_secret'],
        token=options['oauth_token'],
        token_secret=options['oauth_secret']
    )


def rest_client():
    return Twitter(auth=auth())
    
    
    
def stream_client():
    return TwitterStream(auth=auth())
    
    
def cooper_account_id():
    return app.config['TWITTER']['cooper_id']
    
    
def cooperista_list_id():
    return app.config['TWITTER']['cooperista_list_id']