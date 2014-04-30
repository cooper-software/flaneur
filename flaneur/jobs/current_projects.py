from ..support import wip


INTERVAL = {
    'hours': 12
}


data = {
    'projects': []
}


def update(options):
    data['projects'] = wip.get(options['google_username'], options['google_password'])['projects']