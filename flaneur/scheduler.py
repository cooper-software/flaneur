import os
from importlib import import_module
from apscheduler.scheduler import Scheduler
from flaneur import app, jobs
import sse


jobs = {}
scheduler = Scheduler()

def update(job_name, job, options):
    job.update(options)
    sse.publish(job_name, job.data)

for module in os.listdir(os.path.join(os.path.dirname(__file__), 'jobs')):
    if module == '__init__.py' or module[-3:] != '.py':
        continue
    job_name = module[:-3]
    job = import_module("flaneur.jobs.%s" % job_name)
    if hasattr(job, 'INTERVAL') and hasattr(job, 'update'):
        jobs[job_name] = job
        kwargs = job.INTERVAL.copy()
        options = app.config.get(job_name.upper())
        kwargs['args'] = (job_name, job, options)
        
        if hasattr(job, 'setup'):
            job.setup(options)
        
        scheduler.add_interval_job(update, **kwargs)
        
def get_job_data():
    return dict([(k, v.data) for k,v in jobs.items()])