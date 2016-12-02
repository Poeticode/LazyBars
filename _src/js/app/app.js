import createHistory from 'history/createBrowserHistory';
import localforage from 'localforage';
(function() {

    const history = createHistory();
    const location = history.location;
    const unlisten = history.listen((location, action) => {
        // location is like window.location
        console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
        console.log(`The last navigation action was ${action}`);
        
        if (action === "POP") {
            localforage.getItem(urlToGet + "_" + elementToReplace, function(err, pageState) {
                if (!err) {
                    console.log('loading cached shit');
                    require('./modules/loadelement.js')(history, pageState.element, pageState.content);
                } else {
                    // ajax it in then load it up
                    console.log('ajaxing in shit');
                    require('./modules/goto.js')(history, location.pathname);
                } 
            });
        }
    });

    require("./modules/linkreplacer.js")(history);
    require("./modules/initializer.js")();

})();  