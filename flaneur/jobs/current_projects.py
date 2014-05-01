from ..support import wip


INTERVAL = {
    'hours': 6
}


def setup(options, publish):
    publish({'projects':[]})


def update(options, publish):
    publish({
        'projects': wip.get(options['google_username'], options['google_password'])['projects']
    })