Flaneur('flaneur-tweets')

angular.module('flaneur').filter('twitterDate', function ($filter)
{
    return function (value)
    {
        var date = new Date(Date.parse(value))
        return $filter('date')(date, 'short')
    }
})