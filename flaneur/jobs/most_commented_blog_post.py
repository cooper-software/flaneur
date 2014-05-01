from datetime import datetime
from MySQLdb import connect

INTERVAL = {
    "minutes": 1
}

data = {
    'title': '',
    'url': '',
    'description': 'has the most comments'
}


def setup(options, publish):
  publish(data)


def update(options, publish):
    conn = connect(host=options['mysql_host'],
                   user=options['mysql_user'], 
                   passwd=options['mysql_passwd'],
                   db=options['mysql_db'])
    cur = conn.cursor()
    cur.execute('SELECT ID, post_title, comment_count FROM wp_posts ORDER BY comment_count DESC LIMIT 1')
    post_id, title, comment_count = cur.fetchone()
    data['title'] = title
    data['url'] = "%s?p=%s" % (options['wordpress_url'], post_id)
    data['description'] = 'has the most comments (%d)' % comment_count
    publish(data)
    