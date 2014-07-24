from MySQLdb import connect
from flaneur import app

def connection():
    options = app.config['WORDPRESS']
    return connect(host=options['mysql_host'],
                   user=options['mysql_user'], 
                   passwd=options['mysql_passwd'],
                   db=options['mysql_db'])
    
    
def get_post_authors(conn, post_id):
    cur = conn.cursor()
    cur.execute("""SELECT ID, display_name, user_nicename
        FROM wp_users
        INNER JOIN (
        wp_terms, wp_term_taxonomy, wp_term_relationships
        ) ON ( wp_term_taxonomy.term_taxonomy_id=wp_term_relationships.term_taxonomy_id
        AND wp_terms.term_id=wp_term_taxonomy.term_id
        AND wp_users.user_nicename=SUBSTRING( wp_terms.slug, 5 ) ) 
        WHERE wp_term_taxonomy.taxonomy='author'
        AND wp_term_relationships.object_id=%(post_id)s

        UNION        

        SELECT wp_users.ID, wp_users.display_name, wp_users.user_nicename 
        FROM wp_users
        INNER JOIN wp_posts ON wp_users.ID=wp_posts.post_author
        WHERE wp_posts.ID=%(post_id)s""", {'post_id': post_id})
    return map(lambda x: dict(zip(('id', 'display_name', 'username'), x)), cur.fetchall())
    
    
def site_url():
    return app.config['WORDPRESS']['wordpress_url']