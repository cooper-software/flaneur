from ..support import wip


INTERVAL = {
    'hours': 6
}


def setup(options, publish):
    publish({'items':[], 'title': 'Designers on Whitespace'})


def update(options, publish):
    assignments = wip.get()['assignments']
    
    designers = set()
    
    for date, designer, project_id in assignments:
        if project_id is None:
            designers.add(designer)
    
    designers = sorted(list(designers))
    
    publish({
        # For list widget
        'items': designers, 
        'title': 'Designers on white space',
        
        # For count widget
        'count': len(designers),
        'icon': '&#x1F464;',
        'label': 'Designers on white space'
    })