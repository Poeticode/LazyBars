(function() {
    var test = () => console.log('test');
    test(); 
    
    if($('body').hasClass('threejs')) {
        console.log("woah");
        var threejs = require("./scene.js");
        threejs();
    }
    
})();