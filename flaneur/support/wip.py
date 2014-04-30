from datetime import datetime, timedelta
import gspread

wip = {}
last_update = None


def get(username, password):
    global last_update
    now = datetime.now()
    if not last_update or now - last_update < timedelta(minutes=1):
        last_update = now
        update(username, password)
    return wip
    

def update(username, password):
    gc = gspread.login(username, password)
    sheet = gc.open_by_key('0Asqb35iBXqGTdG5EUFUwYUlYS09NMUFlZDc3STdpN2c').get_worksheet(0)
    rows = sheet.get_all_values()
    wip['projects'] = get_projects(rows)
    wip['assignments'] = get_assignments(rows)
    
    
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
    