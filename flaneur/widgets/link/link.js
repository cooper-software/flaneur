angular.module('flaneur').directive('flaneurTitle', function (Hub)
{
    return {
        restrict: 'E',
        scope: {
            channel: '@'
        },
        templateUrl: 'widgets/link/link.html',
        link: function (scope, attrs)
        {
            Hub.bind(scope.channel, scope)
        }
    }
})