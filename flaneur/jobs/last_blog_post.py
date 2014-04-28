from datetime import datetime
from MySQLdb import connect

INTERVAL = {
    "seconds": 2
}

data = {
    'count': 0,
    'label': 'days since the last blog post'
}

def update(options):
    conn = connect(host=options['mysql_host'],
                   user=options['mysql_user'], 
                   passwd=options['mysql_passwd'],
                   db=options['mysql_db'])
    cur = conn.cursor()
    cur.execute('SELECT post_date FROM wp_posts ORDER BY post_date DESC LIMIT 1')
    last_post_date = cur.fetchone()[0]
    now = datetime.utcnow()
    data['count'] = (now - last_post_date).days
    print data