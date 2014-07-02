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
    qbert('#widgets', {
        target_pixel_size: 218
    })
})

})()
;angular.module('flaneur')

.filter('zeroPadding', function ()
{
    return function (value, size)
    {
        var valueStr = (value + '')
        
        if (valueStr.length < size)
        {
            var diff = size - valueStr.length
            for (var i=0; i<diff; i++)
            {
                valueStr = '0' + valueStr
            }
        }
        
        return valueStr
    }
})
;angular.module('flaneur')

.directive('flaneurPagesControl', function ($timeout)
{
    return {
        restrict: 'E',
        templateUrl: 'app/paging/pages-control.html',
        scope: {
            items: '=',
            perPage: '@',
            page: '='
        },
        link: function ($scope, $element)
        {
            var updatePages = function ()
            {
                var numPages = $scope.items ? Math.ceil($scope.items.length / $scope.perPage) : 0,
                    pages = []
                
                for (var i=0; i<numPages; i++)
                {
                    pages.push(i)
                }
                
                $scope.pages = pages
            }
            
            updatePages()
            $scope.$watch('items', updatePages)
            $scope.$watch('perPage', updatePages)
            
            $element.on('click', function ()
            {
                $timeout(function ()
                {
                    if ($scope.page == $scope.pages.length - 1)
                    {
                        $scope.page = 0
                    }
                    else
                    {
                        $scope.page += 1
                    }
                })
            })
        }
    }
})

.directive('flaneurPages', function ($swipe, $timeout, $interval)
{
    return {
        restrict: 'E',
        scope: {
            items: '=',
            perPage: '@',
            page: '=',
            rotateEvery: '@'
        },
        transclude: true,
        link: function ($scope, $element, $attrs, $controller, $transclude)
        {
            var groups = []
            
            $scope.$watchCollection('items', function (items)
            {
                if (!items)
                {
                    items = []
                }
                
                if (groups.length > 0)
                {
                    for (var i=0; i<groups.length; i++)
                    {
                        var group = blocks[i]
                        for (var j=0; j<group.children.length; j++)
                        {
                            group.children[j].$scope.$destroy()
                        }
                        group.element.remove()
                    }
                }
                groups.length = 0
                
                var currentGroup = []
                
                for (var i=0; i<items.length; i++)
                {
                    if (currentGroup.length == $scope.perPage)
                    {
                        groups.push({
                            items: currentGroup
                        })
                        currentGroup = [items[i]]
                    }
                    else
                    {
                        currentGroup.push(items[i])
                    }
                }
                
                if (currentGroup.length > 0)
                {
                    groups.push({
                        items: currentGroup
                    })
                }
                
                for (var i=0; i<groups.length; i++)
                {
                    var childScope = $scope.$new(),
                        group = groups[i]
                    group.element = angular.element('<div></div>')
                    group.children = []
                    
                    group.element.addClass('page')
                    $element.append(group.element)
                    childScope.items = group.items
                    childScope.$itemOffset = i * $scope.perPage
                    
                    $transclude(childScope, function (clone)
                    {
                        group.element.append(clone)
                        group.children.push(
                        {
                            element: clone,
                            scope: childScope
                        })
                    })
                }
            })

            $scope.$watch('page', function (page)
            {
                if (groups && groups[0])
                {
                    groups[0].element.animate({ marginLeft: - $element.width() * page }, 150)
                }
            })
            
            var rotateInterval = parseFloat($attrs.rotateEvery) * 1000,
                rotatePromise = null,
                shouldRotate = $attrs.rotateEvery && true
                rotate = function ()
                {
                    if (shouldRotate)
                    {
                        rotatePromise = $interval(function ()
                        {
                            if ($scope.page == groups.length - 1)
                            {
                                $scope.page = 0
                            }
                            else
                            {
                                $scope.page += 1
                            }
                        }, rotateInterval)
                    }
                },
                stopRotating = function ()
                {
                    $interval.cancel(rotatePromise)
                }
            rotate()
            
            var pagingController =
            {
                startPos: null,
                offset: 0,
                
                setOffset: function (x)
                {
                    this.offset = x
                    groups[0].element.css('margin-left',  (-1 * $scope.page * $element.width()) + x)
                },
                
                snap: function ()
                {
                    var pageWidth = $element.width(),
                        absOffset = Math.abs(this.offset)
                    
                    if (absOffset > pageWidth / 2)
                    {
                        this.updatePage()
                    }
                    else
                    {
                        this.snapToCurrent()
                    }
                },
                
                snapToCurrent: function ()
                {
                    groups[0].element.animate({ 'margin-left': -1 * $scope.page * $element.width() }, 150)
                },
                
                updatePage: function ()
                {
                    if (this.offset < 0)
                    {
                        if ($scope.page < groups.length - 1)
                        {
                            $timeout(function ()
                            {
                                $scope.page += 1
                            })
                        }
                        else
                        {
                            this.snapToCurrent()
                        }
                    }
                    else
                    {
                        if ($scope.page > 0)
                        {
                            $timeout(function ()
                            {
                                $scope.page -= 1
                            })
                        }
                        else
                        {
                            this.snapToCurrent()
                        }
                    }
                },
                
                start: function (pos)
                {
                    stopRotating()
                    this.startPos = pos
                },
                
                cancel: function ()
                {
                    this.snap()
                    rotate()
                },
                
                move: function (pos)
                {
                    this.setOffset(pos.x - this.startPos.x)
                },
                
                end: function ()
                {
                    if (this.offset == 0)
                    {
                        return
                    }
                    
                    this.updatePage()
                    rotate()
                }
            }
            
            $swipe.bind($element, pagingController)
        }
    }
})
;Flaneur('cooper-current-projects', function ()
{
    return {
        link: function ($scope)
        {
            $scope.page = 0
        }
    }
})
;Flaneur('flaneur-clock', function ($interval)
{
    return {
        link: function (scope)
        {
            scope.date = new Date()
            
            $interval(function ()
            {
                scope.date = new Date()
            }, 0.7)
        }
    }
})

angular.module('flaneur').filter('flaneurClockTime', function ()
{
    return function (date)
    {
        return date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
    }
})
;Flaneur('flaneur-counter')
;Flaneur('flaneur-link')
;Flaneur('flaneur-list')
;Flaneur('flaneur-tweets')

angular.module('flaneur').filter('twitterDate', function ($filter)
{
    return function (value)
    {
        var date = new Date(Date.parse(value))
        return $filter('date')(date, 'short')
    }
})
;Flaneur('flaneur-twitter-users', function ()
{
    return {
        link: function ($scope)
        {
            $scope.page = 0
        }
    }
})
;
//# sourceMappingURL=app.js.map