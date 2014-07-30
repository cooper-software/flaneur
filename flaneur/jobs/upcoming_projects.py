from ..support import tenthousandfeetstuff as tenthousandfeet
from datetime import datetime

INTERVAL = {
    'hours': 6
}


def setup(options, publish):
    publish({'items':[], 'title': 'Upcoming projects'})


def update(options, publish):
    client = tenthousandfeet.get_client()
    projects = client.projects.list(_from=datetime.today())
    items = []
    
    for p in projects:
        users = client.projects.users(p['id']).list()
        users_by_id = {}
        for user in users:
            users_by_id[user['id']] = user
        users = users_by_id.values()
        items.append({
            'title': '%s: %s' % (p['client'], p['name']) if p['client'] else p['name'],
            'text': ', '.join([u['first_name'] for u in users])
        })
    
    publish({'items':items, 'title': 'Upcoming projects'})