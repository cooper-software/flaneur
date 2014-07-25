angular.module('flaneur')

.filter('zeroPadding', function ()
{
    return function (value, size)
    {
        var valueStr = (value + '')
        
        if (valueStr.length < size)
        {
            var diff = size - valueStr.length
            for (var i=0; i<diff; i++)
            {
                valueStr = '0' + valueStr
            }
        }
        
        return valueStr
    }
})

.filter('formatTimestamp', function ($filter)
{
    return function (value)
    {
        var date = new Date(parseFloat(value) * 1000)
        return $filter('date')(date, 'short')
    }
})