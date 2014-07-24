from datetime import datetime
import calendar
from ..support import wordpress

INTERVAL = {
    "minutes": 10
}

data = {
  'title': 'Journal posts in the last month',
  'posts': []
}


def setup(options, publish):
  publish(data)
  

def update(options, publish):
    now = datetime.utcnow()
    conn = wordpress.connection()
    cur = conn.cursor()
    cur.execute("""SELECT ID, post_date_gmt, post_title, comment_count 
      FROM wp_posts 
      WHERE post_type='post' 
        AND post_status='publish' 
        AND post_date_gmt >= DATE_SUB(%s, INTERVAL 30 DAY) 
      ORDER BY post_date_gmt DESC""", (now.strftime('%Y-%m-%d'),))
    posts = []
    for post_id, post_date, title, comment_count in cur.fetchall():
      posts.append({
        'title': title,
        'authors': wordpress.get_post_authors(conn, post_id),
        'timestamp': calendar.timegm(post_date.timetuple()),
        'url': "%s?p=%s" % (wordpress.site_url(), post_id),
        'comment_count': comment_count
      })
    data['posts'] = posts
    publish(data)