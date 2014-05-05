import gspread
import gevent
from gevent.queue import Queue
from datetime import datetime
from flaneur import app

wip = {}
updating = False
listeners = []


def get():
    q = Queue()
    listeners.append(q)
    gevent.spawn(update)
    return q.get()
    

def update():
    global updating, listeners
    
    if updating:
        return
    
    updating = True
    
    gc = gspread.login(app.config['GOOGLE_DOCS']['username'], app.config['GOOGLE_DOCS']['password'])
    sheet = gc.open_by_key('0Asqb35iBXqGTdG5EUFUwYUlYS09NMUFlZDc3STdpN2c').get_worksheet(0)
    rows = sheet.get_all_values()
    wip['projects'] = get_projects(rows)
    wip['assignments'] = get_assignments(rows)
    to_notify = listeners[:]
    listeners = []
    for q in to_notify:
        print q
        q.put(wip)
    
    
def get_projects(rows):
    projects = []
    for row in rows[1:]:
        if row[0] == '':
            break
        else:
            projects.append({
                'id': row[0],
                'name': row[1],
                'team': [n.strip() for n in row[2].split(',')]
            })
    return projects
    
    
def get_assignments(rows):
    assignments = []
    dates = get_dates(rows)
    for row in rows[1:]:
        if row[0] == '':
            break
        else:
            name = row[4]
            for i, project_id in enumerate(row[5:]):
                if not project_id:
                    project_id = None
                assignments.append((dates[i], name, project_id))
    return assignments
    
    
def get_dates(rows):
    dates = []
    for v in rows[0][5:]:
        m,d,y = map(int, v.split('/'))
        dates.append(datetime(year=y,month=m,day=d))
    return dates
    