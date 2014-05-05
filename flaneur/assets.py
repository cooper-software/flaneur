import os.path
from webassets.filter import Filter, register_filter
from flask.ext.assets import Environment, Bundle
from flaneur import app


class AngularTemplatesFilter(Filter):
    name = "angular_templates"
    input_template = "$templateCache.put('%s', '%s');"
    output_template = "(function() { var module; try { module = angular.module('templates'); } catch (error) { module = angular.module('templates', []); } module.run(['$templateCache', function($templateCache) { %s }]); })();"
    
    def output(self, _in, out, **kwargs):
        out.write(self.output_template % _in.read())
        
    def input(self, _in, out, **kwargs):
        path = os.path.abspath(kwargs['source_path'])
        path = os.path.relpath(path, app.root_path)
        data = _in.read().replace("\n", "\\n").replace("'", "\\'")
        out.write(self.input_template % (path, data))
        

register_filter(AngularTemplatesFilter)



env = Environment(app)

env.register('all_js',
    Bundle(
        'support/js/vendor/angular.min.js',
        'support/js/vendor/angular-sanitize.min.js',
        'support/js/vendor/jquery.min.js',
        'support/js/vendor/jquery.gridster.min.js'
    ),
    Bundle(
        'support/templates/*.html',
        '../widgets/**/*.html',
        filters='angular_templates'
    ),
    Bundle(
        'support/js/app.js',
        filters='rjsmin'
    ),
    Bundle(
        '../widgets/**/*.js',
        filters='rjsmin'
    ),
    output='all.js'
)

env.register('all_css', Bundle(
    'support/css/main.css',
    'support/css/jquery.gridster.css',
    '../widgets/**/*.css',
    filters='cssmin',
    output='all.css'
))

