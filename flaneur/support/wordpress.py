from MySQLdb import connect
from flaneur import app

def connection():
    options = app.config['WORDPRESS']
    return connect(host=options['mysql_host'],
                   user=options['mysql_user'], 
                   passwd=options['mysql_passwd'],
                   db=options['mysql_db'])
    
    
def site_url():
    return app.config['WORDPRESS']['wordpress_url']