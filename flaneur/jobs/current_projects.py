from ..support import wip


INTERVAL = {
    'hours': 6
}


def setup(options, publish):
    publish({'projects':[]})


def update(options, publish):
    q = wip.get(options['google_username'], options['google_password'])
    projects = q.get()['projects']
    publish({
        'projects': projects
    })