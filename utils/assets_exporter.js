import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader  } from 'three/addons/loaders/FBXLoader.js'; 

const loader = new GLTFLoader();

const LOAD_GARAGE = ({ path, transforms }, scene) => {
	loader.load(path, function (gltf) {
		gltf.scene.name = 'garage'
		scene.add(gltf.scene);
		setTransforms(gltf.scene, transforms)

		//enable shadows
		gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.receiveShadow = true;
				// child.castShadow = true;
				// child.material =  new THREE.MeshNormalMaterial() 
			}
		});
	})
}
const REMOVE_ALL_CARS = (scene) => { 
	scene.children = scene.children.filter(child => !child.name.includes('car')) 
	// console.log(scene.children) 
}
const LOAD_CAR = (car, scene, lookAt = null) => {
	if (car.path.includes('.fbx')) {
		let loader = new FBXLoader() 
		loader.load(car.path, function (fbx) {
			const gui = new dat.GUI() 
			fbx.scene.name = 'car ' +car.name.toLowerCase()
			scene.add(fbx.scene);
 
			const cubeFolder = gui.addFolder(car.name)
			// //add rotation in degrees
			cubeFolder.add(fbx.scene.rotation, 'x', -10, 10).step(0.01)
			cubeFolder.add(fbx.scene.rotation, 'y', -10, 10).step(0.01)
			cubeFolder.add(fbx.scene.rotation, 'z', -10, 10).step(0.01) 

			// //add position
			cubeFolder.add(fbx.scene.position, 'x', -10, 10).step(0.1)
			cubeFolder.add(fbx.scene.position, 'y', -10, 10).step(0.1)
			cubeFolder.add(fbx.scene.position, 'z', -10, 10).step(0.1)
			
			// //add scale
			cubeFolder.add(fbx.scene.scale, 'x', -10, 10).step(0.1)
			cubeFolder.add(fbx.scene.scale, 'y', -10, 10).step(0.1)
			cubeFolder.add(fbx.scene.scale, 'z', -10, 10).step(0.1) 

			setTransforms(fbx.scene, car.transforms)
			//enable shadows
			fbx.scene.traverse(function (child) {
				if (child.isMesh) {
					// child.receiveShadow = true;
					child.castShadow = true;
				}
			});
		})

		return;
	}
	loader.load(car.path, function (gltf) {
		const gui = new dat.GUI() 
		gltf.scene.name = 'car ' +car.name.toLowerCase()
		if(car.drive_path){
			gltf.scene.userData.drive_path = car.drive_path
		}

		if(car.wheel_path){
			gltf.scene.userData.wheel_path = car.wheel_path
		}
		scene.add(gltf.scene);

		// const cubeFolder = gui.addFolder(car.name)
		// // //add rotation in degrees
		// cubeFolder.add(gltf.scene.rotation, 'x', -10, 10).step(0.01)
		// cubeFolder.add(gltf.scene.rotation, 'y', -10, 10).step(0.01)
		// cubeFolder.add(gltf.scene.rotation, 'z', -10, 10).step(0.01) 

		// // //add position
		// cubeFolder.add(gltf.scene.position, 'x', -10, 10).step(0.1)
		// cubeFolder.add(gltf.scene.position, 'y', -10, 10).step(0.1)
		// cubeFolder.add(gltf.scene.position, 'z', -10, 10).step(0.1)
		
		// // //add scale
		// cubeFolder.add(gltf.scene.scale, 'x', -10, 10).step(0.1)
		// cubeFolder.add(gltf.scene.scale, 'y', -10, 10).step(0.1)
		// cubeFolder.add(gltf.scene.scale, 'z', -10, 10).step(0.1) 

		setTransforms(gltf.scene, car.transforms)
		//enable shadows
		gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				// child.receiveShadow = true;
				child.castShadow = true;
			}
		});
	})
}

// const LOAD_CARS = (cars, scene) => {
// 	const gui = new dat.GUI()
	
// 	// console.log(scene.getObjectByName('Senna'))

// 	cars.forEach(car => {
// 		loader.load(car.path, function (gltf) {
// 			gltf.scene.name = car.name
// 			scene.add(gltf.scene);
 
// 			const cubeFolder = gui.addFolder(car.name)
// 			//add rotation in degrees
// 			cubeFolder.add(gltf.scene.rotation, 'x', -10, 10)
// 			cubeFolder.add(gltf.scene.rotation, 'y', -10, 10)
// 			cubeFolder.add(gltf.scene.rotation, 'z', -10, 10) 

// 			//add position
// 			cubeFolder.add(gltf.scene.position, 'x', -10, 10)
// 			cubeFolder.add(gltf.scene.position, 'y', -10, 10)
// 			cubeFolder.add(gltf.scene.position, 'z', -10, 10)
			
// 			//add scale
// 			cubeFolder.add(gltf.scene.scale, 'x', -10, 10)
// 			cubeFolder.add(gltf.scene.scale, 'y', -10, 10)
// 			cubeFolder.add(gltf.scene.scale, 'z', -10, 10) 

// 			setTransforms(gltf.scene, car.transforms)
// 			//enable shadows
// 			gltf.scene.traverse(function (child) {
// 				if (child.isMesh) {
// 					// child.receiveShadow = true;
// 					child.castShadow = true;
// 				}
// 			});
// 		})
// 	})
// 	cubeFolder.open()

// }
const setTransforms = (object, transforms) => {
	if (transforms?.position) {
		object.position.set(...transforms?.position)
	}
	if (transforms?.rotation) {
		object.rotation.set(...transforms?.rotation)
	}
	if (transforms?.scale) {
		object.scale.set(...transforms?.scale)
	}
}

export { LOAD_GARAGE, LOAD_CAR, REMOVE_ALL_CARS }
