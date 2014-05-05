angular.module('flaneur')

.directive('flaneurTweets', function (Hub)
{
    return {
        restrict: 'E',
        scope: {
            channel: '@'
        },
        templateUrl: 'widgets/tweets/tweets.html',
        link: function (scope, attrs)
        {
            Hub.bind(scope.channel, scope)
        }
    }
})

.filter('twitterDate', function ($filter)
{
    return function (value)
    {
        var date = new Date(Date.parse(value))
        return $filter('date')(date, 'short')
    }
})