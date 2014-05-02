from ..support import wip


INTERVAL = {
    'hours': 6
}


def setup(options, publish):
    publish({'items':[], 'title': 'Designers on Whitespace'})


def update(options, publish):
    q = wip.get(options['google_username'], options['google_password'])
    assignments = q.get()['assignments']
    
    designers = set()
    
    for date, designer, project_id in assignments:
        if project_id is None:
            designers.add(designer)
    
    publish({'items':sorted(list(designers)), 'title': 'Designers on Whitespace'})