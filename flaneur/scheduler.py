import os
from importlib import import_module
from threading import Timer, Event
from datetime import datetime, timedelta
from functools import partial
from collections import namedtuple
from uuid import uuid4
import logging
import time

from flaneur import app, jobs
import sse

log = logging.getLogger(__name__)

class Scheduler(object):
    
    
    def __init__(self):
        self.jobs = []
        self.running = Event()
        
        
    def start(self, block=False):
        if block:
            log.debug('Starting in blocking mode')
            self._start()
            try:
                while 1:
                    time.sleep(1)
            finally:
                self.stop()
        else:
            log.debug('Starting in background mode')
            self._start()
            
            
    def stop(self, wait=True):
        self.running.clear()
        for job in self.jobs:
            if job['timer']:
                job['timer'].cancel()
                if wait:
                    job['timer'].join()
            
            
    def _start(self):
        self.running.set()
        for job in self.jobs:
            self.schedule(job, job['delay'])
        
        
    def add(self, func, interval, delay=None, id=None):
        if not id:
            id = uuid4().hex
        if delay is None:
            delay = interval
        interval, delay = map(self.make_interval, (interval, delay))
        job = {
            'id': id, 
            'func': func,
            'interval': interval,
            'delay': delay,
            'timer': None
        }
        self.jobs.append(job)
        log.debug('Added job:%s', job['id'])
        
        if self.running.is_set():
            self.schedule(job, delay)
            
            
    def make_interval(self, value):
        if isinstance(value, (int, long, float)):
            return timedelta(seconds=value)
        elif isinstance(value, timedelta):
            return value
        else:
            raise ValueError, "Expected a timedelta or number of seconds, got %s" % str(value)
        
        
    def schedule(self, job, delay):
        log.debug('Scheduling job:%s to run in %d second%s', job['id'], delay.seconds, 
                                    's' if delay.seconds != 1 else '')
        job['timer'] = Timer(delay.seconds, partial(self.run_job, job))
        job['timer'].start()
        
        
    def run_job(self, job):
        if not self.running.is_set():
            return
        log.debug('Running job:%s', job['id'])
        last_run = datetime.now()
        try:
            job['func']()
        except:
            log.exception('Error running job')
        finally:
            next_run = last_run + job['interval']
            now = datetime.now()
            interval = next_run - now
            self.schedule(job, job['interval'])
            
            

jobs = {}
_scheduler = None
_is_setup = False

def update(job_name, job, options):
    job.update(options)
    sse.publish(job_name, job.data)
    
    
def get_job_data():
    return dict([(k, v.data) for k,v in jobs.items()])
    
    
def setup():
    global _is_setup, _scheduler
    _is_setup = True
    _scheduler = Scheduler()
    for module in os.listdir(os.path.join(os.path.dirname(__file__), 'jobs')):
        if module == '__init__.py' or module[-3:] != '.py':
            continue
        job_name = module[:-3]
        job = import_module("flaneur.jobs.%s" % job_name)
        if hasattr(job, 'INTERVAL') and hasattr(job, 'update'):
            jobs[job_name] = job
            interval = timedelta(**job.INTERVAL)
            options = app.config.get(job_name.upper())
            job_func = partial(update, job_name, job, options)
            
            if hasattr(job, 'setup'):
                job.setup(options)
                
            _scheduler.add(job_func, interval, delay=0, id=job_name)
            
            
def get_scheduler():
    if not _is_setup:
        setup()
    return _scheduler
