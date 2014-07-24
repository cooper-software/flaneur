Flaneur('cooper-journal-posts')

angular.module('flaneur')

.filter('cooperJournalPostAuthors', function ()
{
    return function (value)
    {
        if (value.length == 1)
        {
            return value[0].display_name
        }
        else
        {
            var last = value[value.length-1]
            return (value.slice(0,-1).map(function (v) { return v.display_name }).join(', ') + ' and ' + last.display_name)
        }
    }
})

.filter('cooperJournalPostDate', function ($filter)
{
    return function (value)
    {
        var date = new Date(value * 1000)
        return $filter('date')(date, 'short')
    }
})