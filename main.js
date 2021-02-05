let scene, camera, renderer, cameraModel;

function init() {
    scene = new THREE.Scene();

    setupCamera();

    setupRenderer()

    document.body.appendChild(renderer.domElement);
    
    setupLighting();

    addCameraModel();

    //scene.add( new THREE.AxesHelper(500));
    
}

function setupCamera(){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0xdddddd, 0 );
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
}

function setupLighting(){
    const hemiLight = new THREE.HemisphereLight(0xc7c1e1, 0x724d4d, 175)
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xe2f3ff,20);
    directionalLight.position.set(-50,50,30);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.mapSize.width = 1024*4;
    directionalLight.shadow.mapSize.height = 1024*4;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff,20);
    spotLight.position.set(80,15,30);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024*4;
    spotLight.shadow.mapSize.height = 1024*4;
    scene.add(spotLight);
}


function addCameraModel(){
    const loader = new THREE.GLTFLoader();
    loader.load( 'assets/models/zenit_ttl/scene.gltf', function ( gltf ) {
        cameraModel = gltf.scene
        gltf.scene.scale.set(0.05, 0.05, 0.05)
        //gltf.scene.position.x = -15;
        model = gltf.scene.children[0]; 
          model.traverse(mesh => { if ( mesh.isMesh ) {
            mesh.castShadow = true; 
            mesh.receiveShadow = true;
            if(mesh.material.map) mesh.material.map.anisotropy = 16; 
        }});
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

var getScrollSpeed = (function(settings){
    settings = settings || {};

    var lastPos, newPos, timer, delta, 
        delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

    function clear() {
      lastPos = null;
      delta = 0;
    }

    clear();

    return function(){
      newPos = window.scrollY;
      if ( lastPos != null ){ // && newPos < maxScroll 
        delta = newPos -  lastPos;
      }
      lastPos = newPos;
      clearTimeout(timer);
      timer = setTimeout(clear, delay);
      return delta;
    };
})();

let angularVelocity = 0;

window.onscroll = function (e) {
    angularVelocity = getScrollSpeed()/1000
}

function animate() {
    requestAnimationFrame(animate);

    cameraModel.rotation.y += angularVelocity;
    if (Math.abs(angularVelocity) > 0.00001){
        angularVelocity *= 0.99;
    }else{
        angularVelocity = 0;
    }
    
    renderer.render(scene, camera);
}

init();
animate();