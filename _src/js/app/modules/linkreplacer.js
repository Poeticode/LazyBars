module.exports = function(history) {
    $('a').each(function(index, link) {
        let $link = $(link);
        let urlToGet = $link.attr('href');
        let elementToReplace = $link.data('replace');
        if (!elementToReplace) elementToReplace = 'body';

        $link.unbind('click');
        console.log('unbinding shit');
        $link.click(function () {
            var pageState = localforage.getItem(urlToGet + "_" + elementToReplace);
            if (pageState) {
                // load it up!
                console.log('loading cached shit');
                require('./loadelement.js')(history, elementToReplace, pageState);
            } else {
                // ajax it in then load it up
                console.log('ajaxing in shit');
                require('./goto.js')(history, urlToGet, elementToReplace);
            }

            return false;
        });

    });
}