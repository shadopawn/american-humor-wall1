let scene, camera, renderer, cube, cameraModel;

function init() {
    scene = new THREE.Scene();

    setupCamera();

    setupRenderer()

    document.body.appendChild(renderer.domElement);
    
    setupLighting();

    addCameraModel();

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
}

function setupLighting(){
    const hemiLight = new THREE.HemisphereLight(0xc7c1e1, 0x724d4d, 300)
    scene.add(hemiLight);

    const alight = new THREE.AmbientLight(0xFFFFFF, 100);
    //scene.add(alight);

    const directionalLight = new THREE.DirectionalLight(0xe2f3ff,35);
    directionalLight.position.set(-50,50,30);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.mapSize.width = 1024*4;
    directionalLight.shadow.mapSize.height = 1024*4;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff,30);
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

window.onscroll = function (e) {
    if(this.oldScroll > this.scrollY){
        //scroll up
        cameraModel.rotation.y += 0.015;
    }else{
        //scroll down
        cameraModel.rotation.y -= 0.015;
    }

    this.oldScroll = this.scrollY;
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

init();
animate();