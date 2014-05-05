from ..support import twitterstuff

INTERVAL = None
TWEETS_TO_KEEP = 10

def setup(options, publish):
    publish({'tweets': [], 'title': 'Cooper Tweets'})
    
    rest = twitterstuff.rest_client()
    tweets = rest.statuses.user_timeline(screen_name="cooper", count=TWEETS_TO_KEEP)
    publish({'tweets': tweets, 'title': 'Cooper Tweets'})
    
    stream = twitterstuff.stream_client()
    
    for status in stream.statuses.filter(follow=twitterstuff.cooper_account_id()):
        tweets.append(status)
        tweets = tweets[-TWEETS_TO_KEEP:]
        publish({'tweets':tweets, 'title': 'Cooper Tweets'})
    