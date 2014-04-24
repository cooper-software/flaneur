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

app.service('Publisher', function ()
{
    this.subscribers = {}
    
    this.subscribe = function (channel, callback)
    {
        if (!this.subscribers[channel])
        {
            this.subscribers[channel] = []
        }
        
        this.subscribers[channel].append(callback)
    }
    
    var eventSource = new EventSource('/subscribe')
    eventSource.onmessage = function (msg)
    {
        console.log(msg)
    }
})

app.run(function ()
{
    $('.gridster ul').gridster()
})