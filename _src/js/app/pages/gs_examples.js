module.exports = function() {
    // var smartresize = require('../../vendor/smartresize.js');
    console.log('initializatinaidsfn smarteresize');
    $(window).smartresize(function() {
        console.log('debounced resize event');
    }); 
}