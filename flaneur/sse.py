import gevent
from gevent.wsgi import WSGIServer
from gevent.queue import Queue
from flask import Response
import json

class ServerSentEvent(object):

    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data : "data",
            self.event : "event",
            self.id : "id"
        }

    def encode(self):
        if not self.data:
            return ""
        lines = ["%s: %s" % (v, k) 
                 for k, v in self.desc_map.iteritems() if k]
        
        return "%s\n\n" % "\n".join(lines)


subscriptions = []

def publish(channel, data):
    if channel not in subscriptions:
        return
        
    def notify():
        msg = json.dumps({
            'channel': channel,
            'data': data
        })
        for sub in subscriptions[:]:
            sub.put(msg)
    
    gevent.spawn(notify)
    
    
def subscribe():
    def gen():
        q = Queue()
        subscriptions.append(q)
        try:
            while True:
                result = q.get()
                ev = ServerSentEvent(str(result))
                yield ev.encode()
        except GeneratorExit:
            subscriptions.remove(q)

    return Response(gen(), mimetype="text/event-stream")


def run(app):
    name, port = app.config['SERVER_NAME'].split(':')
    server = WSGIServer((name, int(port)), app)
    print "Running server at %s" % app.config['SERVER_NAME']
    server.serve_forever()
    