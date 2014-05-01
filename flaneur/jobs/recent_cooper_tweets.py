from twitter import *

INTERVAL = None
TWEETS_TO_KEEP = 10

def setup(options, publish):
    publish({'tweets': [], 'title': 'Recent Cooper Tweets'})
    
    auth = OAuth(
        consumer_key=options['consumer_key'],
        consumer_secret=options['consumer_secret'],
        token=options['oauth_token'],
        token_secret=options['oauth_secret']
    )
    
    rest = Twitter(auth=auth)
    tweets = rest.statuses.user_timeline(screen_name="cooper", count=TWEETS_TO_KEEP)
    publish({'tweets': tweets, 'title': 'Recent Cooper Tweets'})
    
    stream = TwitterStream(auth=auth)
    
    for status in stream.statuses.filter(follow='17223242'):
        tweets.append(status)
        tweets = tweets[-TWEETS_TO_KEEP:]
        publish({'tweets':tweets, 'title': 'Recent Cooper Tweets'})
    