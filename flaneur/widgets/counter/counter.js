angular.module('flaneur').directive('flaneurCounter', function (Hub)
{
    return {
        restrict: 'E',
        scope: {
            channel: '@'
        },
        templateUrl: 'widgets/counter/counter.html',
        link: function (scope, attrs)
        {
            Hub.bind(scope.channel, scope)
        }
    }
})