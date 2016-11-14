module.exports = function() {
    var smartresize = require('../vendor/smartresize.js');
    var $board = $('.board');
    var rows = $board.data('rows');
    var cols = $board.data('cols');
    var $boxes = $board.find('.box');
    let initWidth = $board.width();
    $boxes.css({'width': 'calc(100%/12)'});
    $(window).smartresize(function() {
        console.log('wut');
    }); 
}