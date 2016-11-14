(function() {
    var test = () => console.log('test');
    test();
    
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
    }
    
})(); 