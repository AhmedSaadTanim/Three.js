import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LOAD_CAR, LOAD_GARAGE, REMOVE_ALL_CARS } from './utils/assets_exporter.js';
import { MAKE_SPOTLIGHT } from './utils/util.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

// initiate 3js world
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding  //gamma correction
const initial_camera_props = {
	position: { x: -11.865113888411006, y: 1.1325965727864835, z: -7.166462717091821 },
	rotation: { _x: -2.9924316504531876, _y: -0.8544188815908706, _z: -3.0287367822776 },
}


camera.position.set(initial_camera_props.position.x, initial_camera_props.position.y, initial_camera_props.position.z)
camera.rotation.set(initial_camera_props.rotation._x, initial_camera_props.rotation._y, initial_camera_props.rotation._z)

camera.updateProjectionMatrix()
camera.updateMatrixWorld(true)

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})

// initiate cannon world
const world = new CANNON.World({
	gravity: new CANNON.Vec3(0, -9.82, 0),
});

const ground = new CANNON.Body({
	type: CANNON.Body.STATIC,
	shape: new CANNON.Plane(),
	material: new CANNON.Material({ friction: 2, restitution: 0.05 }),
});


ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

world.addBody(ground);

// const cannonDebugger = new CannonDebugger(scene, world);

const animate = function () {
	requestAnimationFrame(animate);

	// 3js
	renderer.render(scene, camera);
	camera.updateProjectionMatrix()

	// cannon
	world.fixedStep();
	// cannonDebugger.update();
}
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

const cars = [
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
		},
		drive_path: 'assets/cars/wheelless_senna.glb',
		wheel_path: 'assets/cars/senna_wheel.glb'
	},
	{
		name: 'test',
		path: 'assets/cars/test.glb',
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



document.getElementById('test-drive').addEventListener('click', async () => {
	scene.remove(scene.getObjectByName('garage'))
	new GLTFLoader().load('assets/racetrack.glb', (gltf) => {
		scene.add(gltf.scene) 
	})
	//add a directional light
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(0, 10, 0);
	directionalLight.castShadow = true;
	scene.add(directionalLight);
	

	const car_props = scene.getObjectByName('car ' + car_list.value)
	let car_path = car_props.userData.drive_path
	let wheel_path = car_props.userData.wheel_path

	scene.remove(car_props)
	document.getElementById('ui-screen-intro').style.display = 'none'

	// add cannon car
	const car_chassis = new CANNON.Body({
		mass: 5000,
		position: new CANNON.Vec3(0, 6, 0),
		shape: new CANNON.Box(new CANNON.Vec3(3.1, 0.64, 1.4)),
	})

	const vehicle = new CANNON.RigidVehicle({
		chassisBody: car_chassis
	})

	const axisWidth = 2.3

	let wheelPositions = [
		new CANNON.Vec3(-1.68, -.4, axisWidth / 2),
		new CANNON.Vec3(-1.68, -.4, -axisWidth / 2),
		new CANNON.Vec3(2.02, -.4, axisWidth / 2),
		new CANNON.Vec3(2.02, -.4, -axisWidth / 2),
	];

	// wheels
	for (let i = 0; i < 4; i++) {
		vehicle.addWheel({
			body: generateWheelBody(),
			position: wheelPositions[i],
			axis: new CANNON.Vec3(0, 0, 1),
			direction: new CANNON.Vec3(0, -1, 0), // direction the wheel is facing
		})
	}
	vehicle.addToWorld(world)

	document.addEventListener('keydown', (e) => {
		const speed = vehicle.chassisBody.velocity.length();
		let maxSteerVal = Math.PI / 8

		const maxForce = 3000

		switch (e.key) {
			case 'w':
				vehicle.setWheelForce(maxForce, 0)
				vehicle.setWheelForce(maxForce, 1)
				break
			case 's':
				vehicle.setWheelForce(-maxForce, 0)
				vehicle.setWheelForce(-maxForce, 1)
				break
			case 'a':
				vehicle.setSteeringValue(maxSteerVal, 0)
				vehicle.setSteeringValue(maxSteerVal, 1)
				break
			case 'd':
				vehicle.setSteeringValue(-maxSteerVal, 0)
				vehicle.setSteeringValue(-maxSteerVal, 1)
				break
		}
	})

	document.addEventListener('keyup', (e) => {
		switch (e.key) {
			case 'w':
				vehicle.setWheelForce(0, 0)
				vehicle.setWheelForce(0, 1)
				break
			case 's':
				vehicle.setWheelForce(0, 0)
				vehicle.setWheelForce(0, 1)
				break
			case 'a':
				vehicle.setSteeringValue(0, 0)
				vehicle.setSteeringValue(0, 1)
				break
			case 'd':
				vehicle.setSteeringValue(0, 0)
				vehicle.setSteeringValue(0, 1)
				break
		}
	})

	let car_wheel_list = []

	let loader = new GLTFLoader()
	let car;

	await loader.load(car_path, (gltf) => {
		car = gltf.scene
		car.name = 'car ' + car_list.value
		scene.add(gltf.scene)

		loader.load(wheel_path, (gltf) => {
			const wheel1 = gltf.scene
			wheel1.name = 'FL'
			scene.add(gltf.scene)

			const wheel2 = gltf.scene.clone()
			wheel2.name = 'FR'
			scene.add(wheel2)

			const wheel3 = gltf.scene.clone()
			wheel3.name = 'RL'
			scene.add(wheel3)

			const wheel4 = gltf.scene.clone()
			wheel4.name = 'RR'
			scene.add(wheel4)

			car_wheel_list.push(wheel1)
			car_wheel_list.push(wheel2)
			car_wheel_list.push(wheel3)
			car_wheel_list.push(wheel4)
		})
	})



	let radius = 10;
	let theta = Math.PI / 4;
	let phi = Math.PI / 4;
	let mousedown = false;

	document.onmousedown = () => {
		mousedown = true;
	};

	document.onmouseup = () => {
		mousedown = false;
	};

	document.onmousemove = (e) => {
		if (!mousedown) return;
		const x = e.clientX;
		const y = e.clientY;
		const width = window.innerWidth;
		const height = window.innerHeight;
		const dx = x - width / 2;
		const dy = y - height / 2;
		theta = Math.PI / 4 + dx / width * Math.PI / 2;
		phi = Math.PI / 4 + dy / height * Math.PI / 2;
	};

	//cam controls
	let trackerPosition = [
		[0.5, 1.3, 0],
		[0, 3, -6],
		[0, 3, 6],
	];

	let trackerRotation = [
		[9.6, 12.6, -3.2],
		[-2.9, -0.05, -3.13],
		[0, 0, 0],
	]
	
	let counter = 0;
	camera.position.set(trackerPosition[0][0], trackerPosition[0][1], trackerPosition[0][2]);
	camera.rotation.set(trackerRotation[0][0], trackerRotation[0][1], trackerRotation[0][2]);

	function setupKeyControls() {
        document.onkeydown = function(e) {
          if(e.key == 'v'){
			counter = counter + 1;
			if(trackerPosition.length <= counter)
				counter = 0;
			
			camera.position.set(trackerPosition[counter][0], trackerPosition[counter][1], trackerPosition[counter][2]);
			camera.rotation.set(trackerRotation[counter][0], trackerRotation[counter][1], trackerRotation[counter][2])
		  }
		  //debug
		  if(e.key == 'u'){
			camera.rotation.x += 0.1;
		  }
		  else if(e.key == 'i'){
			camera.rotation.y += 0.1;
		  }
		  else if(e.key == 'o'){
			camera.rotation.z += 0.1;
		  }
		  else if(e.key == 'j'){
			camera.rotation.x -= 0.1;
		  }
		  else if(e.key == 'k'){
			camera.rotation.y -= 0.1;
		  }
		  else if(e.key == 'l'){
			camera.rotation.z -= 0.1;
		  }
        };
      }

    setupKeyControls();
	const func = () => {
		if (car && car_wheel_list.length === 4) {
			car.position.copy(car_chassis.position)
			car.position.y -= 0.86
			car.quaternion.copy(car_chassis.quaternion)
			const offset = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
			car.quaternion.multiply(offset);

			car_wheel_list.forEach((wheel, i) => {
				wheel.position.copy(vehicle.wheelBodies[i].position)
				wheel.quaternion.copy(vehicle.wheelBodies[i].quaternion)
			})

			// follow camera
			

			const car_tracker = new THREE.Object3D();
			car_tracker.name = "carCam";
			car.add(car_tracker);
			car_tracker.add(camera);

			// camera.position.set(trackerPosition[0][0], trackerPosition[0][1], trackerPosition[0][2]);
			// camera.position.x = car.position.x + radius * Math.sin(phi) * Math.cos(theta);
			// camera.position.y = car.position.y + radius * Math.cos(phi);
			// camera.position.z = car.position.z + radius * Math.sin(phi) * Math.sin(theta);

			// camera.lookAt(car.position);
		}

		requestAnimationFrame(func)
		// console.log(vehicle) 
	}
	func()



})


function generateWheelBody() {
	const wheelShape = new CANNON.Sphere(0.5)
	const wheelMaterial = new CANNON.Material({ friction: 2, restitution: 0.01 })
	// what is restituion?
	// https://en.wikipedia.org/wiki/Coefficient_of_restitution

	const wheelBody = new CANNON.Body({ mass: 12, material: wheelMaterial })
	wheelBody.addShape(wheelShape)
	wheelBody.angularDamping = 0.5
	// set friction of wheels 
	wheelBody.friction = 10
	return wheelBody
}

