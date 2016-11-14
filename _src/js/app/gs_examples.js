module.exports = function() {
    var smartresize = require('../vendor/smartresize.js');
    $(window).smartresize(function() {
        console.log('debounced resize event');
    }); 
}