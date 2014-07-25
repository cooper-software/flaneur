from slacker import Slacker
import re
import logging
log = logging.getLogger(__name__)
from flaneur import app

slack = Slacker(app.config['SLACK']['token'])

CACHE = {}

def get_client():
    return slack
    
def get_cached(key, fn, body_key):
    if key not in CACHE:
        res = fn()
        if res.error:
            log.error(res.error)
            return {}
        members = dict(zip([m['id'] for m in res.body[body_key]], res.body[body_key]))
        CACHE[key] = members
    return CACHE[key]
    
def get_users():
    return get_cached('users', slack.users.list, 'members')
    
def get_user(user_id):
    return get_users().get(user_id, {'name': 'unknown'})
    
def get_channels():
    return get_cached('channels', slack.channels.list, 'channels')
    
def get_channel(channel_id):
    return get_channels().get(channel_id, {'name': 'unknown'})
    
def process_message(message):
    new_message = message.copy()
    new_message['user'] = get_user(message['user'])
    new_message['text'] = _process_links(message['text'])
    return new_message

LINK_PATTERN = re.compile('<(@|#|!)?([^\|>]+)(\|([^\|>]+))?>')

def _process_links(text):
    return LINK_PATTERN.sub(_replace_link, text)
    
def _replace_link(match):
    type_char, target, _, desc = match.groups()
    if type_char == '@':
        return '@' + get_user(target)['name']
    elif type_char == '#':
        return '#' + get_channel(target)['name']
    elif type_char == '!':
        return '!' + target
    else:
        return '<a href="%s" target="_blank">%s</a>' % (target, desc if desc else target)
        