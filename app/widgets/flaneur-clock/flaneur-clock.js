Flaneur('flaneur-clock', function ($interval)
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