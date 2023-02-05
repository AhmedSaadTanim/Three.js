import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();

const LOAD_GARAGE = ({ path, transforms }, scene) => {
	loader.load(path, function (gltf) {
		scene.add(gltf.scene);
		setTransforms(gltf.scene, transforms)

		//enable shadows
		gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.receiveShadow = true;
				// child.castShadow = true; 
			}
		});
	})
}

const LOAD_CARS = (cars, scene) => {
	cars.forEach(car => {
		loader.load(car.path, function (gltf) {
			scene.add(gltf.scene);
			setTransforms(gltf.scene, car.transforms)
			//enable shadows
			gltf.scene.traverse(function (child) {
				if (child.isMesh) {
					// child.receiveShadow = true;
					child.castShadow = true;
				}
			});
		})
	})
}
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

export { LOAD_GARAGE, LOAD_CARS }
