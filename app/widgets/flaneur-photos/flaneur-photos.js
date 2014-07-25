Flaneur('flaneur-photos', function ($interval)
{
    return {
        link: function ($scope, $element)
        {
            var $photos = $element.find('.photos')
            
            $interval(function ()
            {
                var $first = $element.find('.photo:first'),
                    $second = $element.find('.photo:nth-child(2)')
                
                $first.fadeOut(300, function ()
                {
                    $photos.append($first)
                    $first.show()
                })
            }, 8000)
        }
    }
})