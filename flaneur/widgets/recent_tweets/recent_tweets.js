angular.module('flaneur').directive('flaneurRecentTweets', function (Hub)
{
    return {
        restrict: 'E',
        scope: {
            channel: '@'
        },
        templateUrl: 'widgets/recent_tweets/recent_tweets.html',
        link: function (scope, attrs)
        {
            Hub.bind(scope.channel, scope)
        }
    }
})