let scene, camera, renderer;

function init() {
    scene = new THREE.Scene();

    setupCamera();

    setupRenderer()

    document.body.appendChild(renderer.domElement);
    
    setupLighting();

    addCameraModel();
    addMicrophoneModel();
    addTelevisionModel();

    scene.add( new THREE.AxesHelper(500));
    
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

    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
}

function setupLighting(){
    const hemiLight = new THREE.HemisphereLight(0xc7c1e1, 0x724d4d, 1)
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xe2f3ff,2);
    directionalLight.position.set(-50,50,30);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.mapSize.width = 1024*4;
    directionalLight.shadow.mapSize.height = 1024*4;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff,1);
    spotLight.position.set(80,15,30);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024*4;
    spotLight.shadow.mapSize.height = 1024*4;
    scene.add(spotLight);
}

const loader = new THREE.GLTFLoader();
let cameraModel, microphoneModel, TelevisionModel;

function addCameraModel(){
    loader.load( 'assets/models/zenit_ttl/scene.gltf', function ( gltf ) {
        cameraModel = gltf.scene
        cameraModel.scale.set(0.05, 0.05, 0.05)
        model = gltf.scene.children[0]; 
          model.traverse(mesh => { 
            if ( mesh.isMesh ) {
                mesh.castShadow = true; 
                mesh.receiveShadow = true;
                if(mesh.material.map) 
                    mesh.material.map.anisotropy = 16; 
            }
        });
        scene.add( cameraModel );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function addMicrophoneModel(){
    loader.load( 'assets/models/microphone/scene.gltf', function ( gltf ) {
        microphoneModel = gltf.scene
        microphoneModel.scale.set(10, 10, 10)
        microphoneModel.position.x = -22;
        microphoneModel.rotation.y = 0.785398
        model = gltf.scene.children[0]; 
          model.traverse(mesh => { 
            if ( mesh.isMesh ) {
                mesh.castShadow = true; 
                mesh.receiveShadow = true;
                if(mesh.material.map) 
                    mesh.material.map.anisotropy = 16; 
            }
        });
        scene.add( microphoneModel );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function addTelevisionModel(){
    loader.load( 'assets/models/1980_tv/scene.gltf', function ( gltf ) {
        TelevisionModel = gltf.scene
        TelevisionModel.scale.set(10, 10, 10)
        TelevisionModel.position.x = 22;
        TelevisionModel.rotation.y = -0.2
        model = gltf.scene.children[0]; 
          model.traverse(mesh => { 
            if ( mesh.isMesh ) {
                mesh.castShadow = true; 
                mesh.receiveShadow = true;
                if(mesh.material.map) 
                    mesh.material.map.anisotropy = 16; 
            }
        });
        scene.add( TelevisionModel );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}


window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});

function animate() {

    requestAnimationFrame(animate);

    applyAngularVelocity();
    
    renderer.render(scene, camera);
}


let angularVelocity = 0;

window.onscroll = function (e) {
    angularVelocity = getScrollSpeed()/1000

    moveModelToTheSide();
}

function moveModelToTheSide(){
    let transitionStart = 4000;
    let transitionEnd = 4800;
    if(window.scrollY >= transitionStart && window.scrollY <= transitionEnd){
        let mappedXPosition = mapRange(window.scrollY, transitionStart, transitionEnd, 0, 15);
        cameraModel.position.x = -mappedXPosition;
    }
}

function applyAngularVelocity(){
    if(cameraModel){
        cameraModel.rotation.y += angularVelocity;
    }

    if (Math.abs(angularVelocity) > 0.00001){
        angularVelocity *= 0.99;
    }else{
        angularVelocity = 0;
    }
}

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


const mapRange = (num, inMin, inMax, outMin, outMax) => {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

window.addEventListener("click", onMouseClick);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event){
    event.preventDefault()

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children, true );

	for ( let i = 0; i < intersects.length; i ++ ) {
        let intersectedObject = intersects[i].object

        intersectedObject.traverseAncestors(parentObject => {
            if (parentObject == cameraModel){
                TweenMax.to(parentObject.position, 2, {z: 5, ease: Expo.easeOut})
                TweenMax.to(parentObject.position, 2, {y: 3, ease: Expo.easeOut})
            }
        });

	}

}



init();
animate();