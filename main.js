import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LOAD_GARAGE, LOAD_CARS } from './assets_exporter.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
renderer.outputEncoding = THREE.sRGBEncoding  //gamma correction

const animate = function () {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
camera.position.set(0, 2, 0)
animate()

//enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 


const MAKE_SPOTLIGHT = function ([x, y, z],intensity) {
	const spotLight = new THREE.SpotLight(0xffffff, intensity); 
	spotLight.penumbra = 0.5;
	scene.add(spotLight);
	const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);
	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024 * 2;
	spotLight.shadow.mapSize.height = 1024 * 2;
	//rotate spotlight
	spotLight.position.set(x, y, z);
	spotLight.target.position.set(0, 0, 0);
	scene.add(spotLight.target);
}


MAKE_SPOTLIGHT([0, 20, -19], 0.5)
MAKE_SPOTLIGHT([0, 20, 20], 0.2)

LOAD_GARAGE({
	path: 'assets/warehouse.glb',
	transforms: {
		scale: [0.04, 0.04, 0.04],
	},
}, scene)

// add axis
const axesHelper = new THREE.AxesHelper(500);
axesHelper.position.set(0, 3, 0);
scene.add(axesHelper);

LOAD_CARS([
	{
		path: 'assets/cars/ferzor.glb',
		transforms: {
			position: [2, 0.2, 1],
			rotation: [0, 70, 0],
		}
	},
	{
		path: 'assets/cars/senna_2018.glb',
		transforms: {
			position: [-2, 0.2, 0], 
			rotation: [0, 15, 0],
		} 
	},
	{
		path: 'assets/cars/f50.glb',
		transforms: {
			position: [2, 0.2, -6],
			rotation: [0, 15, 0],
			scale: [1.1, 1.1, 1.1],
		}
	}, {
		path: 'assets/cars/centenario_rs.glb',
		transforms: {
			position: [-2, 0.2, -6],
			rotation: [0, 15, 0],
			scale: [1.2, 1.2, 1.2],
		}
	}], scene)

