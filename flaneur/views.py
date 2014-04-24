import os
from flask import render_template, abort, request
from flaneur import app, sse


@app.route("/")
def index():
    return render_template("index.j2")
    
    
@app.route("/layout/<name>")
def layout(name):
    path = "layouts/%s.j2" % name
    if not os.path.exists(os.path.join(app.root_path, "templates", path)):
        abort(404)
    else:
        return render_template(path)
        
        
@app.route("/subscribe")
def subscribe():
    return sse.subscribe()
    
    
@app.route("/publish/<channel>")
def publish(channel):
    if request.json and 'auth_token' in request.json and \
        request.json['auth_token'] == app.config['AUTH_TOKEN']:
        data = request.json.copy()
        data.pop('auth_token')
        sse.publish(channel, data)
    else:
        abort(400)