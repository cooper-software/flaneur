angular.module('flaneur').directive('flaneurList', function (Hub)
{
    return {
        restrict: 'E',
        scope: {
            channel: '@'
        },
        templateUrl: 'widgets/list/list.html',
        link: function (scope, attrs)
        {
            Hub.bind(scope.channel, scope)
        }
    }
})