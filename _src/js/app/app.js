import createHistory from 'history/createBrowserHistory';
(function() {

    const history = createHistory();

    const location = history.location;

    const unlisten = history.listen((location, action) => {
        // location is like window.location
        console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
        console.log(`The last navigation action was ${action}`);
    });

    var test = function() {
        history.push({
            pathname: '/book.html',
            search: '?the=query',
            state: { some: 'state' }
        });
    };
  // test();

    $('a').each(function(index, link) {
        let $link = $(link);
        link.addEventListener('click', function() {

            // console.log(`${$link.data('url')} container`);
            $('.container').addClass('remove');
            $('#content').load(`${$link.data('url')} #ajax`, function( data ) {
                $('.remove').remove();
            });

        });
        console.log($link.data('url'));
    });

    console.log($('body').attr('class')); 

    switch ($('body').attr("class")) {
        case "threejs":
            var threejs = require("./three_examples.js");
            threejs();
            break;
        case "greensock":
            var battleship = require("./gs_examples.js");
            battleship();
            break;
        case "cms":
            var cms = require('./cms.js');
            cms();
            break;
    } 
    
})(); 