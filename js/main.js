const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);  

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let light;
let mesh; 

let rotationVal = 0.1;
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function init() {
	scene.background = new THREE.Color('white');  
	camera.position.set(-10, 10, 20);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function setLight() {
	// light = new THREE.AmbientLight(0xffffff);
	light = new THREE.DirectionalLight(0xcccccc, 1); 
	scene.add(light);
}

function loadGLTF() {
	let loader = new THREE.GLTFLoader();

	loader.load('assets/Mclaren.gltf', (gltf) => {  
		mesh = gltf.scene;
		scene.add(mesh);
		mesh.position.x = -10;
		mesh.position.y = 8;
		mesh.position.z = 10;
	})
}

function animate() {
	if(mesh && mesh.rotation){
		mesh.rotation.y -= 0.005;
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function setupKeyControls(){
	document.onkeydown = function (e){
		if(e.key == 'a'){
			camera.rotation.y += rotationVal;
		}
		else if(e.key == 'd'){
			camera.rotation.y -= rotationVal;
		}
		else if(e.key == 'w'){
			camera.rotation.x += rotationVal;
		}
		else if(e.key == 's'){
			camera.rotation.x -= rotationVal;
		}
		else if(e.key == ']'){
			rotationVal += 0.1;
		}
		else if(e.key == '['){
			rotationVal -= 0.1;
		}
	}
}

init();
setLight();
loadGLTF();
animate();
setupKeyControls();

const onMouseMove = (e) => {
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener( 'mousewheel', (event) => {
	camera.position.z +=	event.deltaY/500;d
});
window.addEventListener('mousemove', onMouseMove);
// document.addEventListener('mousedown', onDocumentMouseDown, false);
// document.addEventListener('mousemove', onDocumentMouseMove, false);
// document.addEventListener('mouseup', onDocumentMouseUp, false);