import gevent
from gevent.queue import Queue
from flask import Response
import json
from datetime import datetime
import calendar

class DateTimeJSONEncoder(json.JSONEncoder):
    
    def default(self, obj):
        if isinstance(obj, datetime):
            if obj.utcoffset() is not None:
                obj = obj - obj.utcoffset()
            ms = int(calendar.timegm(obj.timetuple()) * 1000 + obj.microsecond / 1000)
            return ms
        else:
            super(JSONEncoder, self).default(obj)


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
    def notify():
        msg = json.dumps({
            'channel': channel,
            'data': data
        }, cls=DateTimeJSONEncoder)
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
    