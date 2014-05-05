from datetime import datetime, timedelta
from ..support import twitterstuff

INTERVAL = {
    'hours': 6
}

data = {
    'tweets': [],
    'title': 'Most Retweeted'
}

def setup(options, publish):
    publish(data)
    
    
def update(options, publish):
    cutoff_date = datetime.now() - timedelta(days=20)
    rest = twitterstuff.rest_client()
    max_id = None
    tweets = []
    
    while 1:
        kwargs = dict(user_id=twitterstuff.cooper_account_id(), exclude_replies=True, include_rts=False)
        if max_id is not None:
            kwargs['max_id'] = max_id
        new_tweets = rest.statuses.user_timeline(**kwargs)
        if len(new_tweets) == 0:
            break
        tweets += new_tweets
        oldest_date = datetime.strptime(tweets[-1]['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
        if oldest_date < cutoff_date:
            break
        else:
            max_id = tweets[-1]['id']
    
    tweets.sort(lambda a,b: cmp(b['retweet_count'], a['retweet_count']))
    data['tweets'] = tweets[:10]
    publish(data)