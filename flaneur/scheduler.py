import os
from importlib import import_module
from datetime import datetime, timedelta
from functools import partial
from collections import namedtuple
from uuid import uuid4
import logging
import time
import gevent
import gevent.monkey

gevent.monkey.patch_all()

from flaneur import app, jobs
import sse

log = logging.getLogger(__name__)


class Scheduler(object):
    
    
    def __init__(self):
        self.jobs = []
        self.running = False
        
        
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
        self.running = False
            
            
    def _start(self):
        self.running = True
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
            'delay': delay
        }
        self.jobs.append(job)
        log.debug('Added \'%s\'', job['id'])
        
        if self.running:
            self.schedule(job, delay)
            
            
    def make_interval(self, value):
        if isinstance(value, (int, long, float)):
            return timedelta(seconds=value)
        elif isinstance(value, timedelta):
            return value
        else:
            raise ValueError, "Expected a timedelta or number of seconds, got %s" % str(value)
        
        
    def schedule(self, job, delay):
        log.debug('Scheduling \'%s\' to run in %d second%s', job['id'], delay.seconds, 
                                    's' if delay.seconds != 1 else '')
        gevent.spawn_later(delay.seconds, self.run_job, job)
        
        
    def run_job(self, job):
        while self.running:
            log.debug('Running \'%s\'', job['id'])
            last_run = datetime.now()
            try:
                job['func']()
            except:
                log.exception('Error running job')
            finally:
                next_run = last_run + job['interval']
                now = datetime.now()
                interval = next_run - now
                log.debug('Scheduling \'%s\' to run in %d second%s', job['id'], interval.seconds, 
                                    's' if interval.seconds != 1 else '')
                gevent.sleep(interval.seconds)
        
            
            

job_data = {}
_scheduler = None
_is_setup = False
    
    
def get_job_data():
    return job_data
    
    
def publish_job_data_to_channel(job_name, data):
    job_data[job_name] = data
    sse.publish(job_name, data)
    
    
def setup():
    global _is_setup, _scheduler
    _is_setup = True
    _scheduler = Scheduler()
    disabled_jobs = set(app.config.get('DISABLED_JOBS', []))
    for module in os.listdir(os.path.join(os.path.dirname(__file__), 'jobs')):
        if module.startswith('_') or module[-3:] != '.py':
            continue
            
        job_name = module[:-3]
        
        if job_name in disabled_jobs:
            continue
        
        job = import_module("flaneur.jobs.%s" % job_name)
        
        publish = partial(publish_job_data_to_channel, job_name)
        options = app.config.get(job_name.upper())
        
        if hasattr(job, 'setup'):
            log.debug('Spawning setup for \'%s\'', job_name)
            gevent.spawn(job.setup, options, publish)
        
        if hasattr(job, 'INTERVAL') and hasattr(job, 'update'):
            interval = timedelta(**job.INTERVAL)
            job_func = partial(job.update, options, publish)
            _scheduler.add(job_func, interval, delay=0, id=job_name)
            
            
def get_scheduler():
    if not _is_setup:
        setup()
    return _scheduler
