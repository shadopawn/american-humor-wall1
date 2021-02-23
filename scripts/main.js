let scene, camera, renderer;

function init() {
    scene = new THREE.Scene();

    setupCamera();

    setupRenderer();

    document.body.appendChild(renderer.domElement);
    
    setupLighting();

    addKennedyAwardModel();
    addPeabodyAwardModel();
    addMarkTwainAwardModel();

    //scene.add( new THREE.AxesHelper(500));
    
}

function setupCamera(){
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 60;
    camera.position.y = 20;
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
    const hemiLight = new THREE.HemisphereLight(0xc7c1e1, 0x724d4d, 1);
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
let kennedyAwardModel, peabodyAwardModel, markTwainAwardModel;
let modelList = [];
let selectedModel;

function addKennedyAwardModel(){
    loader.load( 'assets/models/vintage_camera/scene.gltf', function ( gltf ) {
        kennedyAwardModel = gltf.scene;
        kennedyAwardModel.scale.set(0.07, 0.07, 0.07);
        model = gltf.scene.children[0];
        model.position.y = 75;
        applyMeshSettings(model);
        scene.add(kennedyAwardModel);

        modelList.push(kennedyAwardModel);
    }, undefined, function (error) {
        console.error(error);
    } );
}

function addPeabodyAwardModel(){
    loader.load( 'assets/models/microphone/scene.gltf', function ( gltf ) {
        peabodyAwardModel = gltf.scene;
        peabodyAwardModel.scale.set(10, 10, 10);
        peabodyAwardModel.position.x = -22;
        peabodyAwardModel.rotation.y = 0.785398
        model = gltf.scene.children[0]; 
        applyMeshSettings(model);
        scene.add(peabodyAwardModel);

        modelList.push(peabodyAwardModel);
    }, undefined, function (error) {
        console.error(error);
    } );
}

function addMarkTwainAwardModel(){
    loader.load( 'assets/models/1980_tv/scene.gltf', function ( gltf ) {
        markTwainAwardModel = gltf.scene;
        markTwainAwardModel.scale.set(10, 10, 10);
        markTwainAwardModel.position.x = 22;
        markTwainAwardModel.rotation.y = -0.2
        model = gltf.scene.children[0]; 
        applyMeshSettings(model);
        scene.add(markTwainAwardModel);

        modelList.push(markTwainAwardModel);
    }, undefined, function (error) {
        console.error(error);
    } );
}

function applyMeshSettings(model){
    model.traverse(mesh => { 
        if ( mesh.isMesh ) {
            mesh.castShadow = true; 
            mesh.receiveShadow = true;
            if(mesh.material.map) 
                mesh.material.map.anisotropy = 16; 
        }
    });
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
    angularVelocity = getScrollSpeed()/1000;

    //moveModelToTheSide();
}

function moveModelToTheSide(){
    let transitionStart = 4000;
    let transitionEnd = 4800;
    if(window.scrollY >= transitionStart && window.scrollY <= transitionEnd){
        let mappedXPosition = mapRange(window.scrollY, transitionStart, transitionEnd, 0, -15);
        if(selectedModel)
            selectedModel.position.x = mappedXPosition;
    }
}

function applyAngularVelocity(){
    if(selectedModel){
        selectedModel.rotation.y += angularVelocity;
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
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children, true );

	for ( let i = 0; i < intersects.length; i ++ ) {
        let intersectedObject = intersects[i].object;

        intersectedObject.traverseAncestors(parentObject => {
            if (modelList.includes(parentObject)){
                selectModel(parentObject);
            }
        });

	}

}

const originalCornerPosition = new THREE.Vector3( 190, 25, -280 );

async function selectModel(model){
    console.log("model selected");
    window.scrollTo(0, 0);

    await loadHtmlForModel(model);

    selectedModel = model;
    moveModelToCenter(selectedModel);
    let newCornerPosition = originalCornerPosition.clone();
    modelList.forEach(model =>{
        if (model != selectedModel){
            moveModelToCorner(model, newCornerPosition);
            newCornerPosition.x += 30; 
        }
    });

    addMoveModelToTheSideController(selectedModel);
}

async function loadHtmlForModel(model){
    if (model == kennedyAwardModel){
        console.log("Kennedy award selected");
        await loadHtmlFromFile("kennedyAward.html");
    }
    else if (model == peabodyAwardModel){
        console.log("Peabody award selected");
        await loadHtmlFromFile("peabodyAward.html");
    }
    else if (model == markTwainAwardModel){
        console.log("Mark Twain award selected");
        await loadHtmlFromFile("markTwainAward.html");
    }
}

async function loadHtmlFromFile(fileName){
    let contentContainer = document.getElementById('content-container');
    await fetch(fileName)
        .then(data => data.text())
        .then(html => contentContainer.innerHTML = html);
    addAllOrbitAnimations();
}

function moveModelToCenter(modelToAnimate){
    TweenMax.to(modelToAnimate.position, 4, {x: 0, ease: Expo.easeOut});
    TweenMax.to(modelToAnimate.position, 4, {y: 6, ease: Expo.easeOut});
    TweenMax.to(modelToAnimate.position, 4, {z: 10, ease: Expo.easeOut});
}

function moveModelToCorner(modelToAnimate, position){
    TweenMax.to(modelToAnimate.position, 4, {x: position.x, ease: Expo.easeOut});
    TweenMax.to(modelToAnimate.position, 4, {y: position.y, ease: Expo.easeOut});
    TweenMax.to(modelToAnimate.position, 4, {z: position.z, ease: Expo.easeOut});
}

let moveToSideScene;

function addMoveModelToTheSideController(selectedModel){
    if(moveToSideScene)
        moveToSideScene.destroy();

    let moveToSideController = new ScrollMagic.Controller();

    let moveToSideTimeLine = new TimelineMax();
    moveToSideTimeLine.to(selectedModel.position, 1, {x: -15});

    moveToSideScene = new ScrollMagic.Scene({
        triggerElement: ".right-side",
        duration: 800,
        triggerHook: 0.9
    })
        .setTween(moveToSideTimeLine)
        .addTo(moveToSideController);
}

init();
animate();