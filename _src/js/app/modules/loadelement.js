module.exports = function(history, elementToReplace, $receivedElement) {
    console.log($receivedElement);
    $(elementToReplace).empty().html($receivedElement.children());
    if (elementToReplace === 'body') {
        // this means it's a page load
        var $body = $('body');
        var newBodyClasses = $receivedElement.attr('class');
        $body.attr('class', newBodyClasses);
        $body.attr('data-body', newBodyClasses);
        require('./linkreplacer.js')(history);
        require('./initializer.js')($receivedElement.data('body'));
    }
}