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