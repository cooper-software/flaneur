angular.module('flaneur').directive('flaneurCounter', function (Hub)
{
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'widgets/counter/counter.html',
        link: function (scope)
        {
            Hub.bind('counter', scope)
        }
    }
})