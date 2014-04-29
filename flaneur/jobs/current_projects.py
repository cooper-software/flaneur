from ..lib import wip


INTERVAL = {
    'hours': 12
}


data = {
    'title': 'Current Projects',
    'items': []
}


def update(options):
    projects = wip.get(options['google_username'], options['google_password'])['projects']
    data['items'] = [p['name'] for p in projects]