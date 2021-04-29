let scene, camera, renderer;

function initialize() {
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
        .setPath('assets/cubeMap/Bridge2/')
        .load([
            'negx.jpg',
            'negy.jpg',
            'negz.jpg',
            'posx.jpg',
            'posy.jpg',
            'posz.jpg'
        ]);
}

function setupLighting(){
    const hemiLight = new THREE.HemisphereLight(0xc7c1e1, 0x724d4d, 0.5);
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xe2f3ff, 2);
    directionalLight.position.set(-50, 50, 30);
    applyLightSettings(directionalLight);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(80, 15, 30);
    applyLightSettings(spotLight);
    scene.add(spotLight);
}

function applyLightSettings(light){
    light.castShadow = true;
    light.shadow.bias = -0.0001;
    light.shadow.mapSize.width = 1024*4;
    light.shadow.mapSize.height = 1024*4;
}

const loader = new THREE.GLTFLoader();
let kennedyAwardModel, peabodyAwardModel, markTwainAwardModel;
let selectedModel;
// based on model load time the modelList order isn't always consistent
// modelList contains objects with the model, originalPosition and collisionMesh
let modelList = [];

function addKennedyAwardModel(){
    loader.load('assets/models/kennedyAward/scene.gltf', function (gltf) {
        kennedyAwardModel = gltf.scene;
        kennedyAwardModel.scale.set(0.01, 0.01, 0.01);

        kennedyAwardModel.name = "Kennedy Award";
        
        model = gltf.scene.children[0];
        model.position.z = 0;
        model.rotation.x = -0.2;
        applyMeshSettings(model);

        let kennedyCollisionMesh = addKennedyCollisionMesh(model);

        modelList.push({
            model: kennedyAwardModel,
            originalPosition: kennedyAwardModel.position.clone(),
            collisionMesh: kennedyCollisionMesh
        });

        scene.add(kennedyAwardModel);
    }, undefined, function (error) {
        console.error(error);
    });
}

function addKennedyCollisionMesh(model){
    let boundingBoxSize = getBoundingBoxSize(model);

    const geometry = new THREE.PlaneGeometry(boundingBoxSize.x, boundingBoxSize.y);
    const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, opacity: 0, transparent: true});
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(25, 160, -20);
    model.add(plane);
    return plane;
}

function addPeabodyAwardModel(){
    loader.load('assets/models/peabodyAward/scene.gltf', function (gltf) {
        peabodyAwardModel = gltf.scene;
        peabodyAwardModel.scale.set(2.2, 2.2, 2.2);
        peabodyAwardModel.position.x = 22;

        peabodyAwardModel.name = "Peabody Award";

        model = gltf.scene.children[0];
        applyMeshSettings(model);

        let peabodyCollisionMesh = addPeabodyCollisionMesh(model);

        modelList.push({
            model: peabodyAwardModel,
            originalPosition: peabodyAwardModel.position.clone(),
            collisionMesh: peabodyCollisionMesh
        });

        scene.add(peabodyAwardModel);
    }, undefined, function (error) {
        console.error(error);
    });
}

function addPeabodyCollisionMesh(model){
    let boundingBoxSize = getBoundingBoxSize(model);

    let radius = boundingBoxSize.x/2;
    const geometry = new THREE.CylinderGeometry(radius, radius, boundingBoxSize.y);
    const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, opacity: 0, transparent: true});
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.x = Math.PI/2;
    model.add(cylinder);
    return cylinder;
}

function addMarkTwainAwardModel(){
    loader.load('assets/models/markTwainAward/scene.gltf', function (gltf) {
        markTwainAwardModel = gltf.scene;
        markTwainAwardModel.scale.set(2, 2, 2);
        markTwainAwardModel.position.x = -22;

        markTwainAwardModel.name = "Mark Twain Award";

        model = gltf.scene.children[0];
        model.position.z = 0;
        model.position.x = -1.9;
        model.position.y = -4;
        applyMeshSettings(model);

        let markTwainCollisionMesh = addMarkTwainCollisionMesh(model);

        modelList.push({
            model: markTwainAwardModel,
            originalPosition: markTwainAwardModel.position.clone(),
            collisionMesh: markTwainCollisionMesh
        });

        scene.add(markTwainAwardModel);
    }, undefined, function (error) {
        console.error(error);
    });
}

function addMarkTwainCollisionMesh(model){
    let boundingBoxSize = getBoundingBoxSize(model);

    const geometry = new THREE.BoxGeometry(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z);
    const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, opacity: 0, transparent: true});
    const cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = Math.PI/2;
    cube.position.set(-0.5, 2, 4.2);
    model.add(cube);
    return cube;
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

function getBoundingBoxSize(model){
    let boundingBox = new THREE.Box3().setFromObject(model);
    let boundingBoxSize = new THREE.Vector3();
    boundingBox.getSize(boundingBoxSize);
    return boundingBoxSize;
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    updateCornerPosition();
});

let angularVelocity = 0;

window.onscroll = () =>{
    let scrollSpeed = getScrollSpeed();
    //console.log(scrollSpeed);
    angularVelocity = scrollSpeed/2000;
}

let modelRotationEnabled = true;

function applyAngularVelocity(){
    if(selectedModel && modelRotationEnabled){
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

function toggleModelRotation(){
    modelRotationEnabled = !modelRotationEnabled;
}

function enableModelRotation(){
    modelRotationEnabled = true;
}

let getScrollSpeed = function(){
    let lastPosition, newPosition, timer, delta;
    clearDelay = 500; // in "ms" (higher means lower fidelity)

    function clear() {
        lastPosition = null;
        delta = 0;
    }

    clear();

    return () =>{
        newPosition = window.pageYOffset;
        if (lastPosition != null){ 
            delta = newPosition - lastPosition;
        }
        lastPosition = newPosition;
        clearTimeout(timer);
        timer = setTimeout(clear, delay);
        return delta;
    }
}();

let mouseMoveEvent;
window.addEventListener("mousemove", onMouseMove);
function onMouseMove(event){
    event.preventDefault();
    mouseMoveEvent = event;
}

function setMouseCursorStyle(event){
    // possibly update only if mouse position has sufficient delta
    if(event){
        let intersectedModel = getIntersectedModel(event)
        if(intersectedModel != selectedModel && intersectedModel != null){
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

function getIntersectedModel(event){
	const intersects = getRayIntersections(event);
    
    let intersectedModel;
    if (intersects.length > 0){
        let intersectedObject = intersects[0].object;
        modelList.forEach(({model, collisionMesh}) =>{
            if (collisionMesh == intersectedObject){
                intersectedModel = model;
            }
        });
    }
    return intersectedModel;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getRayIntersections(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

    let collisionMeshList = modelList.map(item => item.collisionMesh);

	const intersects = raycaster.intersectObjects(collisionMeshList, true);
    
    return intersects;
}

async function selectModel(model){
    if (allModelsLoaded() == false){
        return;
    }

    if (model == selectedModel){
        return;
    }

    modelList.sort((a, b) => (a.originalPosition.x < b.originalPosition.x) ? 1 : -1);
    
    selectedModel = model;

    await loadHtmlForModel(selectedModel);

    onModelSelected(selectedModel);

    window.scrollTo(0, 0);
}

function allModelsLoaded(){
    let anyAwardNull = kennedyAwardModel == null || peabodyAwardModel == null || markTwainAwardModel == null;
    if(anyAwardNull){
        return false;
    }
    return true;
}

function onModelSelected(model){
    enableModelRotation();
    enableCornerPositionUpdate();
    moveModelsToSelectionPositions(model);
    addMoveModelToTheSideController(model);
    modelsToOriginalPositionOnScroll();
    fadeOutStartingText();
}

async function loadHtmlForModel(model){
    if (model == kennedyAwardModel){
        await loadHtmlFromFile("kennedyAward.html");
    }
    else if (model == peabodyAwardModel){
        await loadHtmlFromFile("peabodyAward.html");
    }
    else if (model == markTwainAwardModel){
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
    fadeInStartingTextOnScroll();
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

const cornerModelSpacing = -18;

function moveModelsToCorner(selectedModel){
    let newCornerPosition = getCornerVector();
    modelList.forEach(({model}) =>{
        if (model != selectedModel){
            moveModelToPosition(model, newCornerPosition);
            newCornerPosition.x += cornerModelSpacing;

            let forwardYRotation = getNearestForwardRotation(model);
            animateModelToYRotation(model, forwardYRotation);
        }
    });
}

let canUpdateCornerPosition = true;

function updateCornerPosition(){
    if(canUpdateCornerPosition == false){
        window.scrollTo(0, document.body.scrollHeight);
        return;
    }

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

function toggleCanUpdateCornerPosition(){
    canUpdateCornerPosition = !canUpdateCornerPosition;
}

function enableCornerPositionUpdate(){
    canUpdateCornerPosition = true;
}

function getCornerVector(){
    let plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -200));
    let corner2D = new THREE.Vector2(0.91, 0.85); // NDC (Normalized Device Coordinate) of the corner position
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

function animateModelToYRotation(modelToAnimate, rotation){
    TweenMax.to(modelToAnimate.rotation, 4, {y: rotation, ease: Power2.easeInOut});
}

function getNearestForwardRotation(model){
    let modelForward = new THREE.Vector3();
    model.getWorldDirection(modelForward);
    let angleToForward = modelForward.angleTo(new THREE.Vector3(0, 0, 1));
    if (modelForward.x > 0){
        return model.rotation.y - angleToForward;
    }
    else
    {
        return model.rotation.y + angleToForward;
    }
}

let moveToSideController;

function addMoveModelToTheSideController(selectedModel){
    if(moveToSideController)
        moveToSideController.destroy();

    moveToSideController = new ScrollMagic.Controller();

    let moveToSideTimeLine = new TimelineMax();
    moveToSideTimeLine.to(selectedModel.position, 1, {x: -20});

    let triggerElement = ".right-side";
    let duration = 800;
    let triggerHook = 0.9;

    let moveToSideScene = new ScrollMagic.Scene({
        triggerElement,
        duration,
        triggerHook
    })
        .setTween(moveToSideTimeLine)
        .addTo(moveToSideController);

    moveToSideScene.on("start", () => {
        toggleModelRotation();
        
        // The rotation animation is added on start because the model rotation
        // can be inconsistent and the animation target needs to be calculated
        // based on the model's current rotation
        rotateForwardDuringMoveToSide();
    });

    let rotateForwardScene;

    function rotateForwardDuringMoveToSide(){
        if (rotateForwardScene)
            rotateForwardScene.destroy();

        let forwardYRotation = getNearestForwardRotation(selectedModel);
        forwardYRotation += 0.4
        rotateForwardScene = new ScrollMagic.Scene({
            triggerElement,
            duration,
            triggerHook
        })
            .setTween(selectedModel.rotation, 1, {y: forwardYRotation})
            .addTo(moveToSideController);
    }
}

let moveToOriginalPositionController;

function modelsToOriginalPositionOnScroll(){

    if (moveToOriginalPositionController)
        moveToOriginalPositionController.destroy();

    moveToOriginalPositionController = new ScrollMagic.Controller();

    let scrollDuration = 1.5*window.innerHeight;

    let lastMoveToOriginalPositionScene;
    modelList.forEach(({model, originalPosition}) =>{
        lastMoveToOriginalPositionScene = new ScrollMagic.Scene({
            triggerElement: "#bottom-spacer",
            duration: scrollDuration,
            triggerHook: 0.1
        })
            .setTween(model.position, 1, {x: originalPosition.x, y: originalPosition.y, z: originalPosition.z})
            .addTo(moveToOriginalPositionController);
    });

    lastMoveToOriginalPositionScene.on("start", () => {
        toggleCanUpdateCornerPosition();
    });

    rotateModelToForwardOnScroll(scrollDuration);
}

function rotateModelToForwardOnScroll(scrollDuration){
    let rotationScenes = [];

    modelList.forEach(({model}) =>{
        let rotationScene = new ScrollMagic.Scene({
            triggerElement: "#bottom-spacer",
            duration: scrollDuration,
            triggerHook: 0.1
        })
            .addTo(moveToOriginalPositionController);

        rotationScenes.push({
            scene: rotationScene,
            sceneModel: model
        });
    });

    rotationScenes.forEach(({scene, sceneModel}) =>{
        scene.on("start", () => {
            let forwardYRotation = getNearestForwardRotation(sceneModel);
            scene.setTween(sceneModel.rotation, 1, {y: forwardYRotation});
        });
    });
}

function animate() {

    requestAnimationFrame(animate);

    applyAngularVelocity();

    setMouseCursorStyle(mouseMoveEvent);
    
    renderer.render(scene, camera);
}

initialize();
animate();