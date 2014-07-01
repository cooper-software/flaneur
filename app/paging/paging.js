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

.directive('flaneurPages', function ()
{
    return {
        restrict: 'E',
        scope: {
            items: '=',
            perPage: '@',
            page: '='
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
                
                if (groups[$scope.page])
                {
                    groups[$scope.page].element.addClass('selected')
                }
            })

            $scope.$watch('page', function (page)
            {
                if (page >= groups.length)
                {
                    return
                }
                
                for (var i=0; i<groups.length; i++)
                {
                    if (i != page)
                    {
                        groups[i].element.removeClass('selected')
                    }
                }
                
                groups[page].element.addClass('selected')
            })
        }
    }
})