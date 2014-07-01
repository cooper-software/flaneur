exports.config = 
{
    paths: {
        'public': 'flaneur/static'
    },
    
    files:
    {
        javascripts:
        {
            joinTo:
            {
                "js/app.js": /^app/,
                "js/vendor.js": /^(vendor|bower_components)/
            },
            order:
            {
                before: 'app/app.js'
            }
        },
        
        stylesheets:
        {
            joinTo:
            {
                "css/main.css": /^app/
            }
        },
        
        templates:
        {
            joinTo: 
            {
                "js/templates.js": /^app/
            }
        }
    },
    
    modules:
    {
        wrapper: false,
        definition: false
    }
}