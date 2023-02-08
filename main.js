import * as THREE from 'three';
import initDemoCar from './assets/democar.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LOAD_GARAGE, LOAD_CARS } from './utils/assets_exporter.js';
import { MAKE_SPOTLIGHT } from './utils/util.js';
import init_demo_ground from './assets/demo_ground.js';


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

// add axis
const axesHelper = new THREE.AxesHelper(500);
// axesHelper.position.set(0, 3, 0);
scene.add(axesHelper);

// MAKE_SPOTLIGHT([0, 20, -19], 0.5)
// MAKE_SPOTLIGHT([0, 20, 20], 0.2)
init_demo_ground(scene)
initDemoCar(scene)
// LOAD_GARAGE({
// 	path: 'assets/garage.glb',
// 	transforms: {
// 		scale: [0.04, 0.04, 0.04],
// 	},
// }, scene)


// LOAD_CARS([
// 	{
// 		path: 'assets/cars/ferzor.glb',
// 		transforms: {
// 			position: [2, 0.2, 1],
// 			rotation: [0, 70, 0],
// 		}
// 	},
// 	{
// 		path: 'assets/cars/senna_2018.glb',
// 		transforms: {
// 			position: [-2, 0.2, 0], 
// 			rotation: [0, 15, 0],
// 		} 
// 	},
// 	{
// 		path: 'assets/cars/f50.glb',
// 		transforms: {
// 			position: [2, 0.2, -6],
// 			rotation: [0, 15, 0],
// 			scale: [1.1, 1.1, 1.1],
// 		}
// 	}, {
// 		path: 'assets/cars/centenario_rs.glb',
// 		transforms: {
// 			position: [-2, 0.2, -6],
// 			rotation: [0, 15, 0],
// 			scale: [1.2, 1.2, 1.2],
// 		}
// 	}], scene)

