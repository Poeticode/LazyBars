(function() {
    var test = () => console.log('test');
    test();
    
    console.log($('body').attr('class')); 
    switch ($('body').attr("class")) {
        case "threejs":
            var threejs = require("./scene.js");
            threejs();
            break;
        case "greensock":
            var battleship = require("./battleship.js");
            battleship();
            break;
    } 
    
})();