from flaneur import app
import time
from ..support import slack
import logging
log = logging.getLogger(__name__)

INTERVAL = {
    'minutes': 7
}

TITLE = 'Away'



def setup(options, publish):
    publish({'title': TITLE, 'messages': []})
    
    
def update(options, publish):
    channel = slack.get_channel_by_name('away')
    if not channel:
        log.error('Could not find an #away channel!')
        return
    
    res = slack.get_client().channels.history(
        channel=channel['id'],
        oldest=time.time()-172800
    )
    if res.error:
        log.error(res.error)
        return
    
    messages = []
    
    for m in res.body['messages']:
        if m['type'] == 'message' and 'subtype' not in m:
            messages.append(slack.process_message(m))
    
    publish({
        'title': TITLE,
        'messages': messages
    })