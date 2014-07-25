from flaneur import app
import time
from ..support import slack

INTERVAL = {
    'minutes': 7
}

TITLE = 'Away'



def setup(options, publish):
    publish({'title': TITLE, 'messages': []})
    
    
def update(options, publish):
    res = slack.get_client().channels.history(
        channel=app.config['SLACK']['general_channel'],
        oldest=time.time()-172800
    )
    if res.error:
        log.error(res.error)
        return
    
    messages = []
    
    for m in res.body['messages']:
        if m['type'] == 'message' and 'subtype' not in m and\
            -1 < m['text'].find('#away'):
            messages.append(slack.process_message(m))
    
    publish({
        'title': TITLE,
        'messages': messages
    })