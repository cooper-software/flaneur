angular.module('flaneur')

.directive('flaneurClock', function ($interval)
{
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'widgets/clock/clock.html',
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

.filter('flaneurClockTime', function ()
{
    return function (date)
    {
        return date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
    }
})