(function ()
{

var app = angular.module('flaneur', [
    'ngSanitize',
    'ngTouch',
    'templates'
])

app.factory('Hub', function ($timeout)
{
    var started = false
    var Hub = function () {}
    Hub.prototype = 
    {
        subscribers: {},
        
        subscribe: function (channel, callback)
        {
            if (!this.subscribers[channel])
            {
                this.subscribers[channel] = []
            }
            
            this.subscribers[channel].push(callback)
        },
        
        publish: function (channel, data)
        {
            if (this.subscribers[channel])
            {
                this.subscribers[channel].forEach(function (callback)
                {
                    callback(data)
                })
            }
        },
        
        bind: function (channel, scope)
        {
            this.subscribe(channel, function (data)
            {
                $timeout(function ()
                {
                    for (var n in data)
                    {
                        scope[n] = data[n]
                    }
                })
            })
            
            if (!started && INITIAL_CHANNEL_DATA && INITIAL_CHANNEL_DATA[channel])
            {
                hub.publish(channel, INITIAL_CHANNEL_DATA[channel])
            }
        }
    }
    
    var hub = new Hub()
    var eventSource = new EventSource('/subscribe')
    
    eventSource.onmessage = function (msg)
    {
        started = true
        var data = JSON.parse(msg.data)
        
        if (data && data.channel && data.data)
        {
            hub.publish(data.channel, data.data)
        }
    }
    
    return hub
})

window.Flaneur = function (name, create_fn)
{
    var getDashedName = function (name)
    {
        if (-1 < name.indexOf('-'))
        {
            return name
        }
        else
        {
            return name
                    .replace(/([a-z])([A-Z])/, '$1 $2')
                    .split(' ')
                    .map(function (n) { return n.toLowerCase() })
                    .join('-')
        }
    }
    
    var getCamelCaseName = function (name)
    {
        if (name.indexOf('-') < 0)
        {
            return name
        }
        else
        {
            return name
                    .split('-')
                    .map(function (n, i)
                    {
                        if (i == 0)
                        {
                            return n
                        }
                        else
                        {
                            return n.charAt(0).toUpperCase() + n.substr(1)
                        }
                    })
                    .join('')
        }
    }
    
    var dashedName = getDashedName(name),
        camelName = getCamelCaseName(name)
    
    app.directive(camelName, function ($injector, Hub)
    {
        var options = create_fn ? $injector.invoke(create_fn) : {}
        
        return {
            restrict: 'E',
            scope: {  channel: '@'},
            templateUrl: options.templateUrl ? options.templateUrl : 'app/widgets/' + dashedName + '/' + dashedName + '.html',
            link: function ($scope, $element, $attrs, $transclude)
            {
                if ($scope.channel)
                {
                    Hub.bind($scope.channel, $scope)
                }
                
                if (options.link)
                {
                    options.link($scope, $element, $attrs, $transclude)
                }
            }
        }
    })
}

app.run(function ()
{
    qbert('.widgets', {
        target_pixel_size: 218
    })
})

})()