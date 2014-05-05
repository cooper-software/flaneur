from ..support import twitterstuff

INTERVAL = None
TWEETS_TO_KEEP = 10

data = {'tweets': [], 'title': 'Cooperistas Tweets'}


def setup(options, publish):
    publish(data)
    
    rest = twitterstuff.rest_client()
    tweets = rest.lists.statuses(list_id=twitterstuff.cooperista_list_id(), count=TWEETS_TO_KEEP)
    data['tweets'] = tweets
    publish(data)
    
    cursor = '-1'
    member_ids = []
    while 1:
        response = rest.lists.members(list_id=twitterstuff.cooperista_list_id(), include_entities=False, skip_status=True, cursor=cursor)
        member_ids += [m['id_str'] for m in response['users']]
        cursor = response['next_cursor_str']
        if not cursor or cursor == '0':
            break
    
    stream = twitterstuff.stream_client()
    
    for status in stream.statuses.filter(follow=','.join(member_ids)):
        tweets.append(status)
        tweets = tweets[-TWEETS_TO_KEEP:]
        publish({'tweets':tweets, 'title': 'Cooperista Tweets'})