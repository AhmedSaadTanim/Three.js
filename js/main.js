//import constants
import CONSTANTS from "./constants.js";


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(CONSTANTS.CAMERA.FOV, CONSTANTS.CAMERA.ASPECT_RATIO, CONSTANTS.CAMERA.NEAR, CONSTANTS.CAMERA.FAR);

let light;
let mesh;

let rotationVal = 0.1;
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function init() {
	scene.background = new THREE.Color('black');
	camera.position.set(0, 4, 5);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function setLight() {
	// light = new THREE.AmbientLight(0xcccccc); 
	light = new THREE.DirectionalLight(0xcccccc, 2); 
	scene.add(light);
}

function loadGLTF() {
	let loader = new THREE.GLTFLoader();

	loader.load('assets/Mclaren.gltf', (gltf) => {
		mesh = gltf.scene;
		scene.add(mesh);
		mesh.position.x = 0;
		mesh.position.y = 0;
		mesh.position.z = -4; 
		mesh.rotation.y = 15;
	})

	loader.load('assets/hangar.gltf', (gltf) => {
		mesh = gltf.scene
		scene.add(mesh)
		mesh.position.x = 0
		mesh.position.y = -0.2
		mesh.position.z = 4
	})
}

function animate() {
	if (mesh && mesh.rotation) {
		// mesh.rotation.y -= 0.005;
	}

	camera.updateProjectionMatrix();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function setupKeyControls() {
	document.onkeydown = function (e) {
		if (e.key == 'a') {
			camera.rotation.y += rotationVal;
		}
		else if (e.key == 'd') {
			camera.rotation.y -= rotationVal;
		}
		else if (e.key == 'w') {
			camera.rotation.x += rotationVal;
		}
		else if (e.key == 's') {
			camera.rotation.x -= rotationVal;
		}
		else if (e.key == ']') {
			rotationVal += 0.1;
		}
		else if (e.key == '[') {
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
	console.log(e)
}

document.addEventListener('mousewheel', (event) => {
	camera.position.z += event.deltaY / 500;
});

window.addEventListener('mousemove', onMouseMove);
// document.addEventListener('mousedown', onDocumentMouseDown, false);
// document.addEventListener('mousemove', onDocumentMouseMove, false);
// document.addEventListener('mouseup', onDocumentMouseUp, false);