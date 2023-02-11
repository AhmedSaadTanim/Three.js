import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LOAD_CAR, LOAD_GARAGE, REMOVE_ALL_CARS } from './utils/assets_exporter.js';
import { MAKE_SPOTLIGHT } from './utils/util.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// const controls = new OrbitControls(camera, renderer.domElement);
renderer.outputEncoding = THREE.sRGBEncoding  //gamma correction
const initial_camera_props = {
	position: {x: -11.865113888411006, y: 1.1325965727864835, z: -7.166462717091821},
	rotation: {_x: -2.9924316504531876, _y: -0.8544188815908706, _z: -3.0287367822776},  
}

const animate = function () {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	camera.updateProjectionMatrix() 
}
// let initial_camera_position = [-8.575898669016357,2.7334088950337563,-8.862992367247971]
// camera.position.set(...initial_camera_position)
camera.position.set(initial_camera_props.position.x, initial_camera_props.position.y, initial_camera_props.position.z)
camera.rotation.set(initial_camera_props.rotation._x, initial_camera_props.rotation._y, initial_camera_props.rotation._z) 

camera.updateProjectionMatrix()
camera.updateMatrixWorld(true)
animate()

//enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.width = 2048
renderer.shadowMap.height = 2048

// add axis
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

MAKE_SPOTLIGHT([0, 20, 12.25], 0.45, scene)
MAKE_SPOTLIGHT([-12, 20, -23], 0.7, scene)
MAKE_SPOTLIGHT([50, 7.85, -9.74], 0.41, scene)


//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);

LOAD_GARAGE({
	path: 'assets/garage.glb',  
	transforms: {
		scale: [0.013, 0.013, 0.013], 
	},
}, scene)

const cars =  [
	{
		name: 'Ferzor', 
		path: 'assets/cars/ferzor.glb',
		transforms: {
			rotation: [0, 3, 0],
			position: [-8, 0, -4], 
		}
	}, 
	{
		name: 'centenario',
		path: 'assets/cars/centenario_rs.glb',
		transforms: {
			rotation: [0, -1.7, 0],
			position: [-8.6, 0, -4.8],  
		}
	},
	{
		name: 'f50',
		path: 'assets/cars/f50.glb',
		transforms: {
			rotation: [0, -1.75, 0],
			position: [-8.6, 0, -4.8],  
		}
	},
	{
		name: 'senna',
		path: 'assets/cars/senna_2018.glb',
		transforms: {
			rotation: [0, -1.7, 0],
			position: [-7.7, 0, -4.4], 
		}
	}
]

// ui elements
const car_list = document.getElementById('car-selection')
car_list.addEventListener('change', (e) => {
	let selected_car = cars.find(car => car.name.toLowerCase() === e.target.value.toLowerCase())
	REMOVE_ALL_CARS(scene) 
	LOAD_CAR(selected_car, scene) 
})

car_list.dispatchEvent(new Event('change')) 

// LOAD_CARS([
// 	{
// 		name: 'Ferzor', 
// 		path: 'assets/cars/ferzor.glb',
// 		transforms: {
// 			rotation: [0, 3, 0],
// 			position: [-8, 0, -4], 
// 		}
// 	}], scene) 

 
