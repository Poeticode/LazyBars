module.exports = function(pageName) {
    if (!pageName) pageName = $('body').attr("class");
    switch (pageName) {
        case "threejs":
            require("../pages/three_examples.js")();
            break;
        case "greensock":
            require("../pages/gs_examples.js")();
            break;
        case "cms":
            require("../pages/cms.js")();
            break;
    } 
}