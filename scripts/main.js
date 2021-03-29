let scene, camera, renderer;

function init() {
    scene = new THREE.Scene();

    setupCamera();

    setupRenderer();

    document.body.appendChild(renderer.domElement);

    addCubeMap();
    
    setupLighting();

    addKennedyAwardModel();
    addPeabodyAwardModel();
    addMarkTwainAwardModel();

    //scene.add( new THREE.AxesHelper(500));
}

function setupCamera(){
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 60;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0xdddddd, 0 );
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    renderer.shadowMap.enabled = true;

    renderer.gammaOutput = true;
    renderer.gammaFactor = 9.2;
}

function addCubeMap(){
    scene.environment = new THREE.CubeTextureLoader()
	.setPath( 'assets/cubeMap/Bridge2/' )
	.load( [
		'negx.jpg',
		'negy.jpg',
		'negz.jpg',
		'posx.jpg',
		'posy.jpg',
		'posz.jpg'
	] );
}

function setupLighting(){
    const hemiLight = new THREE.HemisphereLight(0xc7c1e1, 0x724d4d, 0.5);
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xe2f3ff, 2);
    directionalLight.position.set(-50, 50, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.mapSize.width = 1024*4;
    directionalLight.shadow.mapSize.height = 1024*4;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(80, 15, 30);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024*4;
    spotLight.shadow.mapSize.height = 1024*4;
    scene.add(spotLight);
}

const loader = new THREE.GLTFLoader();
let kennedyAwardModel, peabodyAwardModel, markTwainAwardModel;
let selectedModel;
// based on model load time the modelList order isn't always consistent
// modelList contains objects with the model and originalPosition
let modelList = [];

function addKennedyAwardModel(){
    loader.load( 'assets/models/kennedyAward/scene.gltf', function (gltf) {
        kennedyAwardModel = gltf.scene;
        kennedyAwardModel.scale.set(0.01, 0.01, 0.01);
        kennedyAwardModel.position.x = -22;

        kennedyAwardModel.name = "Kennedy Award";
        
        model = gltf.scene.children[0];
        model.position.z = 0;
        model.rotation.x = -0.2;
        applyMeshSettings(model);
        
        scene.add(kennedyAwardModel);

        modelList.push({model: kennedyAwardModel, originalPosition: kennedyAwardModel.position.clone()});
        //originalPositions.push(kennedyAwardModel.position.clone());
    }, undefined, function (error) {
        console.error(error);
    });
}

function addPeabodyAwardModel(){
    loader.load( 'assets/models/peabodyAward/scene.gltf', function (gltf) {
        peabodyAwardModel = gltf.scene;
        peabodyAwardModel.scale.set(2.2, 2.2, 2.2);

        peabodyAwardModel.name = "Peabody Award";

        model = gltf.scene.children[0];
        applyMeshSettings(model);

        scene.add(peabodyAwardModel);

        modelList.push({model: peabodyAwardModel, originalPosition: peabodyAwardModel.position.clone()});
        //originalPositions.push(peabodyAwardModel.position.clone());
    }, undefined, function (error) {
        console.error(error);
    });
}

function addMarkTwainAwardModel(){
    loader.load( 'assets/models/markTwainAward/scene.gltf', function (gltf) {
        markTwainAwardModel = gltf.scene;
        markTwainAwardModel.scale.set(2, 2, 2);
        markTwainAwardModel.position.x = 22;

        markTwainAwardModel.name = "Mark Twain Award";

        model = gltf.scene.children[0];
        model.position.z = 0;
        //model.position.x = -1.6;
        model.position.y = -4;
        applyMeshSettings(model);

        scene.add(markTwainAwardModel);

        modelList.push({model: markTwainAwardModel, originalPosition: markTwainAwardModel.position.clone()});
        //originalPositions.push(markTwainAwardModel.position.clone());
    }, undefined, function (error) {
        console.error(error);
    });
}

function applyMeshSettings(model){
    model.traverse(mesh => { 
        if (mesh.isMesh) {
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

    updateCornerPosition();
});

let angularVelocity = 0;

window.onscroll = function (e) {
    angularVelocity = getScrollSpeed()/2000;
}

function applyAngularVelocity(){
    if(selectedModel){
        selectedModel.rotation.y += angularVelocity;
    }

    if (Math.abs(angularVelocity) > 0.00001){
        angularVelocity *= 0.99;
    }
    else
    {
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

let mouseMoveEvent;
//window.addEventListener("mousemove", onMouseMove);
function onMouseMove(event){
    event.preventDefault();
    mouseMoveEvent = event
}

function setMouseCursorStyle(event){
    // possibly update only if mouse position has sufficient delta
    if(event){
        if(isModelIntersected(event)){
            document.body.style.cursor = "pointer";
        }
        else
        {
            document.body.style.cursor = "default";
        }
    }
}

window.addEventListener("click", onMouseClick);
function onMouseClick(event){
    event.preventDefault();

    let intersectedModel = getIntersectedModel(event);

    if(intersectedModel){
        selectModel(intersectedModel);
    }
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getIntersectedModel(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(scene.children, true);
    
    let intersectedModel;
    if (intersects.length > 0){
        let intersectedObject = intersects[0].object;
        intersectedObject.traverseAncestors(parentObject => {
            if (modelList.some(element => element.model == parentObject)){
                intersectedModel = parentObject;
            }
        });
    }
    return intersectedModel;
}

function isModelIntersected(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(scene.children, true);
    
    return (intersects.length > 0);
}

async function selectModel(model){

    modelList.sort((a, b) => (a.originalPosition.x < b.originalPosition.x) ? 1 : -1);
    //console.log(modelList);

    if (model == selectedModel){
        return;
    }

    console.log("model selected");
    
    selectedModel = model;

    await loadHtmlForModel(selectedModel);

    moveModelsToSelectionPositions(selectedModel);

    addMoveModelToTheSideController(selectedModel);

    modelsToOriginalPositionOnScroll();

    window.scrollTo(0, 0);
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
    onHtmlLoaded();
}

function onHtmlLoaded(){
    addAllOrbitAnimations();
    addBottomSpacer();
    setupCarousel();
}

function addBottomSpacer(){
    let bottomDiv = document.createElement('div');
    bottomDiv.setAttribute("id", "bottom-spacer");
    let rightSide = document.getElementById('right-side');
    rightSide.appendChild(bottomDiv);
}


function moveModelsToSelectionPositions(selectedModel){
    moveModelToCenter(selectedModel);
    moveModelsToCorner(selectedModel);
}

const cornerModelSpacing = -25;

function moveModelsToCorner(selectedModel){
    let newCornerPosition = getCornerVector();
    modelList.forEach(({model}) =>{
        if (model != selectedModel){
            moveModelToPosition(model, newCornerPosition);
            newCornerPosition.x += cornerModelSpacing;
        }
    });
}

function updateCornerPosition(){
    if (selectedModel == null){
        return;
    }
    
    let newCornerPosition = getCornerVector();
    modelList.forEach(({model}) =>{
        if (model != selectedModel){
            model.position.copy(newCornerPosition);
            newCornerPosition.x += cornerModelSpacing;
        }
    });
}

function getCornerVector(){
    let plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -380));
    let corner2D = new THREE.Vector2(0.875, 0.85); // NDC (Normalized Device Coordinate) of the corner position
    let cornerPoint = new THREE.Vector3();

    raycaster.setFromCamera(corner2D, camera);
    raycaster.ray.intersectPlane(plane, cornerPoint);
    return cornerPoint;
}

function moveModelToCenter(modelToAnimate){
    const centerPosition = new THREE.Vector3(0, 2, 10);
    moveModelToPosition(modelToAnimate, centerPosition);
}

function moveModelToPosition(modelToAnimate, position){
    TweenMax.to(modelToAnimate.position, 4, {x: position.x, y: position.y, z: position.z, ease: Power2.easeInOut});
}

let moveToSideScene;

function addMoveModelToTheSideController(selectedModel){
    if(moveToSideScene)
        moveToSideScene.destroy();

    let moveToSideController = new ScrollMagic.Controller();

    let moveToSideTimeLine = new TimelineMax();
    moveToSideTimeLine.to(selectedModel.position, 1, {x: -20});

    moveToSideScene = new ScrollMagic.Scene({
        triggerElement: ".right-side",
        duration: 800,
        triggerHook: 0.9
    })
        .setTween(moveToSideTimeLine)
        .addTo(moveToSideController);
}

let moveToOriginalPositionController;

function modelsToOriginalPositionOnScroll(){

    if (moveToOriginalPositionController)
        moveToOriginalPositionController.destroy();

    moveToOriginalPositionController = new ScrollMagic.Controller();

    let scrollDuration = 1.5*window.innerHeight;

    modelList.forEach(({model, originalPosition}) =>{
        new ScrollMagic.Scene({
            triggerElement: "#bottom-spacer",
            duration: scrollDuration,
            triggerHook: 0.1
        })
            .setTween(model.position, 1, {x: originalPosition.x, y: originalPosition.y, z: originalPosition.z})
            .addTo(moveToOriginalPositionController);
    });
}

function animate() {

    requestAnimationFrame(animate);

    applyAngularVelocity();

    setMouseCursorStyle(mouseMoveEvent);
    
    renderer.render(scene, camera);
}

init();
animate();