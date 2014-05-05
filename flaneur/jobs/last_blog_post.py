from datetime import datetime
from ..support import wordpress

INTERVAL = {
    "minutes": 1
}

data = {
  'count': 0,
  'label': 'days since the last blog post'
}

def setup(options, publish):
  publish(data)
  

def update(options, publish):
    conn = wordpress.connection()
    cur = conn.cursor()
    cur.execute("""
      SELECT post_date_gmt 
      FROM wp_posts 
      WHERE post_type='post' 
        AND post_status='publish' 
        AND post_date_gmt < NOW() 
      ORDER BY post_date_gmt DESC 
      LIMIT 1""")
    last_post_date = cur.fetchone()[0]
    now = datetime.utcnow()
    data['count'] = (now - last_post_date).days
    publish(data)