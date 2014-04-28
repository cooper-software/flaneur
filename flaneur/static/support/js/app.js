window.Flaneur = 
{
    widgets: [],
    createWidget: function(name, options)
    {
        this.widgets.append({ name: name, options: options })
    }
}


var app = angular.module('flaneur', ['templates'])

app.controller("AppCtrl", function ()
{
    
})

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

app.run(function ()
{
    $('.gridster ul').gridster({
        widget_margins: [0, 0]
    })
})