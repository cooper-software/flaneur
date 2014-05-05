from ..support import wip


INTERVAL = {
    'hours': 6
}


def setup(options, publish):
    publish({'projects':[]})


def update(options, publish):
    projects = wip.get()['projects']
    publish({
        'projects': projects
    })