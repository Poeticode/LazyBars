module.exports = function() {
    var THREE = require('three'); 
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight * 0.9 );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;
    var rotateX = 0.1;

    var buttons = $('button[data-rotate-x]');
    buttons.each(function(index, el) {
        $(el).on('click', function() {
            rotateX += parseInt($(this).data('rotate-x'))*0.10;
        });
    });

    var render = function () {
        requestAnimationFrame( render );
 
        cube.rotation.x += Math.sin(rotateX);
        cube.rotation.y += 0.1;

        renderer.render(scene, camera);
    };

    render();
}