module.exports = function(history, urlToGet, elementToReplace) {

    // send a damn ajax request. 
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlToGet, true);
    xhr.responseType = 'document'; // make sure we read it as a document
    xhr.overrideMimeType('text/html'); // it better be html, or else!
    xhr.onload = function () { 
        if (xhr.readyState === xhr.DONE) { 
            if (xhr.status === 200) {
                // auhohoho WE GOT THE DATA BOYZ
                var $receivedElement = $(xhr.responseXML).find(elementToReplace);

                require('./loadelement.js')(history, elementToReplace, $receivedElement);

                if (elementToReplace === 'body') {
                    history.push({
                        pathname: urlToGet,
                    });
                }
                localforage.setItem(urlToGet + "_" + elementToReplace, {element: elementToReplace, content: $receivedElement});
            }
        }
    }; 

    xhr.send(null);


}