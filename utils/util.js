import * as THREE from 'three'; 

const MAKE_SPOTLIGHT = function ([x, y, z],intensity, scene) {
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

export { MAKE_SPOTLIGHT }