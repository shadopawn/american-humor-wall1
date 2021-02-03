let scene, camera, renderer, cube, microphone;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0 );
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    //addCube();
    addMicrophone();

    camera.position.z = 4;
    camera.position.y = 0.2;
}

function addCube(){
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
}

function addMicrophone(){
    const loader = new THREE.GLTFLoader();

    loader.load( 'assets/models/microphone/scene.gltf', function ( gltf ) {

        microphone = gltf.scene

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});

window.onscroll = function (e) {
    if(this.oldScroll > this.scrollY){
        //scroll up
        microphone.rotation.y += 0.015;
    }else{
        //scroll down
        microphone.rotation.y -= 0.015;
    }

    this.oldScroll = this.scrollY;
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

init();
animate();