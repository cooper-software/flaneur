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