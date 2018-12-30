var scene, canvas, camera, renderer, controls;

//Check if WEBGL is available on the current browser
if (WEBGLTest.isWebGLAvailable()) 
{
    init();
    animate();
} 
else 
{
    var warning = WEBGLTest.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

function init()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0);

    //WebGL access setup
    canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl');

    // PerspectiveCamera (FOV, Aspect Ratio, near clipping plane, far clipping plane)
    // Clipping plane: Objects further away than far or closer than near will not render
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({canvas: canvas, context: gl});
    renderer.setSize(window.innerWidth, window.innerHeight); //CHANGE RESOLUTION BASED ON WINDOW SIZE HERE
    document.body.appendChild(renderer.domElement);

    //ORBIT CONTROLS
    controls = new THREE.OrbitControls( camera );  
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.maxPolarAngle = 1.39626;
    controls.minPolarAngle = 1.39626;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.05;
    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 2, 10 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

    initGeometry();
}

function initGeometry()
{
    let height = 100.0, width = 100.0, rows = 100, cols = 100;
	
    var imagePrefix = "images/";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 2*width+1, 2*height+1, 2*height+1 );	
	
    var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.translateY(-height/100.0);
	scene.add( skyBox );

}

function animate()
{
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
