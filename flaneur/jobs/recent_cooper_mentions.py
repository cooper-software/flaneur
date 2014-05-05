from ..support import twitterstuff

INTERVAL = {
    'minutes': 3
}
TWEETS_TO_KEEP = 10

data = {'tweets': [], 'title': 'Cooper Mentions'}

def setup(options, publish):
    publish(data)
    
    
def update(options, publish):
    rest = twitterstuff.rest_client()
    result = rest.search.tweets(q="@cooper", count=TWEETS_TO_KEEP, result_type='recent')
    data['tweets'] = result['statuses']
    publish(data)
    