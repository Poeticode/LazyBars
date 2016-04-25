module.exports = function() {
    var smartresize = require('../vendor/smartresize.js');
    var $board = $('.board');
    var rows = $board.data('rows');
    var cols = $board.data('cols');
    var $boxes = $board.find('.box');
    let initWidth = $board.width();
    // $boxes.addClass('c'+( (12/cols)/2) );
    // $boxes.width( (initWidth*.75)/cols );
    // $boxes.height( $boxes.width() );
    $boxes.css({'width': 'calc(100%/12)'});
    $(window).smartresize(function() {
        // let boardWidth = $board.width();
        // $boxes.width( (boardWidth*.75)/cols );        
        // $boxes.height( $boxes.width() );
    }); 
}