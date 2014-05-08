from ..support import twitterstuff

INTERVAL = {
    'hours': 1
}
FOLLOWERS_TO_KEEP = 10

data = {'users': [], 'title': 'Recent Followers'}


def setup(options, publish):
    publish(data)
    
    
def update(options, publish):
    client = twitterstuff.rest_client()
    result = client.followers.list(user_id=twitterstuff.cooper_account_id(), count=FOLLOWERS_TO_KEEP)
    data['users'] = result['users']
    publish(data)