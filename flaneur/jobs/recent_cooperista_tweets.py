from twitter import *

INTERVAL = None
TWEETS_TO_KEEP = 10

def setup(options, publish):
    publish({'tweets': [], 'title': 'Cooperista Tweets'})
    
    auth = OAuth(
        consumer_key=options['consumer_key'],
        consumer_secret=options['consumer_secret'],
        token=options['oauth_token'],
        token_secret=options['oauth_secret']
    )
    
    rest = Twitter(auth=auth)
    tweets = rest.lists.statuses(list_id=options['cooperista_list_id'], count=TWEETS_TO_KEEP)
    publish({'tweets': tweets, 'title': 'Cooperista Tweets'})
    
    cursor = '-1'
    member_ids = []
    while 1:
        response = rest.lists.members(list_id=options['cooperista_list_id'], include_entities=False, skip_status=True, cursor=cursor)
        member_ids += [m['id_str'] for m in response['users']]
        cursor = response['next_cursor_str']
        if not cursor or cursor == '0':
            break
    
    stream = TwitterStream(auth=auth)
    
    for status in stream.statuses.filter(follow=','.join(member_ids)):
        tweets.append(status)
        tweets = tweets[-TWEETS_TO_KEEP:]
        publish({'tweets':tweets, 'title': 'Cooperista Tweets'})