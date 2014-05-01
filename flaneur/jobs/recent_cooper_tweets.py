from twitter import *

INTERVAL = None
TWEETS_TO_KEEP = 10

def setup(options, publish):
    publish({'tweets': [], 'title': 'Cooper Tweets'})
    
    auth = OAuth(
        consumer_key=options['consumer_key'],
        consumer_secret=options['consumer_secret'],
        token=options['oauth_token'],
        token_secret=options['oauth_secret']
    )
    
    rest = Twitter(auth=auth)
    tweets = rest.statuses.user_timeline(screen_name="cooper", count=TWEETS_TO_KEEP)
    publish({'tweets': tweets, 'title': 'Cooper Tweets'})
    
    stream = TwitterStream(auth=auth)
    
    for status in stream.statuses.filter(follow=options['cooper_id']):
        tweets.append(status)
        tweets = tweets[-TWEETS_TO_KEEP:]
        publish({'tweets':tweets, 'title': 'Cooper Tweets'})
    