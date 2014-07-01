angular.module('flaneur')

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