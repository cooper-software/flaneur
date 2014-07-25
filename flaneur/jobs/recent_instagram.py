from ..support import instagramstuff as instagram

INTERVAL = {
    'minutes': 27
}

TITLE = 'Instagram'
CHANNEL = 'cooperux'
NUMBER_OF_PHOTOS = 9

def setup(options, publish):
    publish({'title': TITLE, 'photos':[]})
    
    
def update(options, publish):
    ig = instagram.get_client()
    media, next_url = ig.tag_recent_media(NUMBER_OF_PHOTOS, None, CHANNEL)
    photos = []
    for m in media:
        photos.append({
            'image_url': m.get_standard_resolution_url(),
            'thumbnail_url': m.get_thumbnail_url(),
            'link_url': m.link
        })
    publish({
        'title': TITLE,
        'photos': photos
    })
    