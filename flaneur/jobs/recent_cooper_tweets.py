from ..support import twitterstuff

INTERVAL = None
TWEETS_TO_KEEP = 10

data = {'tweets': [], 'title': 'Cooper Tweets'}

def setup(options, publish):
    publish(data)
    
    rest = twitterstuff.rest_client()
    tweets = rest.statuses.user_timeline(screen_name="cooper", count=TWEETS_TO_KEEP)
    data['tweets'] = tweets
    publish(data)
    
    stream = twitterstuff.stream_client()
    
    for status in stream.statuses.filter(follow=twitterstuff.cooper_account_id()):
        tweets.append(status)
        tweets = tweets[-TWEETS_TO_KEEP:]
        data['tweets'] = tweets
        publish(data)
    