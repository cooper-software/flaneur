from datetime import datetime

INTERVAL = {
    "seconds": 2
}

data = {
    'count': 0,
    'label': '# of things'
}

def update(options):
    data['count'] += 1