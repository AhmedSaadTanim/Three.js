import * as THREE from 'three'; 

const MAKE_SPOTLIGHT = function ([x, y, z],intensity, scene) {
	const spotLight = new THREE.SpotLight(0xffffff, intensity); 
	spotLight.penumbra = 1; 
	scene.add(spotLight);
	// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	// scene.add(spotLightHelper);
	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024 * 4;
	spotLight.shadow.mapSize.height = 1024 * 4;  
  
	spotLight.shadow.radius = 5;    
	spotLight.shadow.camera.left = -30;
	spotLight.shadow.camera.right = 30; 
	spotLight.shadow.camera.near = 13;   
	// spotLight.shadow.camera.far = 250;
	spotLight.shadow.bias = -0.0002;     

	//rotate spotlight
	spotLight.position.set(x, y, z);
	spotLight.target.position.set(0, 0, 0);
	scene.add(spotLight.target);

	//make spotlight dat.gui
	// const gui = new dat.GUI(); 
	// const spotLightFolder = gui.addFolder('Spotlight');
	// spotLightFolder.add(spotLight.position, 'x').min(-50).max(50).step(0.01);
	// spotLightFolder.add(spotLight.position, 'y').min(-50).max(50).step(0.01);
	// spotLightFolder.add(spotLight.position, 'z').min(-50).max(50).step(0.01);
	// spotLightFolder.add(spotLight, 'intensity').min(0).max(1).step(0.01);
	// spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01);
	// spotLightFolder.add(spotLight.shadow.camera, 'near').min(0).max(50).step(0.01);
	// spotLightFolder.add(spotLight.shadow.camera, 'far').min(0).max(50).step(0.01);
	// spotLightFolder.add(spotLight.shadow.camera, 'left').min(-50).max(50).step(0.01);
	// spotLightFolder.add(spotLight.shadow.camera, 'right').min(-50).max(50).step(0.01);
	// spotLightFolder.add(spotLight.shadow.mapSize, 'width').min(0).max(2048).step(1);
	// spotLightFolder.add(spotLight.shadow.mapSize, 'height').min(0).max(2048).step(1);
	// spotLightFolder.add(spotLight.shadow, 'radius').min(0).max(50).step(0.01);
	// spotLightFolder.add(spotLight.shadow, 'bias').min(-0.01).max(0.01).step(0.0001);
	// spotLightFolder.open();  
}

export { MAKE_SPOTLIGHT }