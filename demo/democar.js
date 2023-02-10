import * as THREE from 'three';
import carData from './MuscleCar.obj.json' assert {type: 'json'}; 

export default (scene) => {
	const vertices = carData.vertices;
	const faces = carData.faces;

	const geometry = new THREE.BufferGeometry();
	geometry.computeVertexNormals()
	geometry.setAttribute(
		'position',
		new THREE.BufferAttribute(new Float32Array(vertices), 3)
	);

	geometry.setIndex(
		new THREE.BufferAttribute(
			new Uint32Array(faces),
			1 
		)
	);

	const texture = new THREE.TextureLoader().load('./texture.jpg');  

	// use texture
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture, flatShading: true });  

	// add an ambient light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
	scene.add(ambientLight);
	const mesh = new THREE.Mesh(geometry, material);

	scene.add(mesh); 

	// make a wheel 
	const wheelGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.23, 32);
	const wheelTexture = new THREE.TextureLoader().load('./wheel.png');  
	const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: wheelTexture });
	const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
	wheel.position.set(0.05, -0.35, 0.45);
	wheel.rotation.x = Math.PI / 2; 
	wheel.castShadow = true;
	wheel.receiveShadow = true;
	wheel.name = 'wheel';
	scene.add(wheel);
	const wheel2 = wheel.clone();
	wheel2.position.set(0.05, -0.35, -0.45);
	wheel2.name = 'wheel2';
	scene.add(wheel2);
	const wheel3 = wheel.clone();
	wheel3.name = 'wheel3';
	wheel3.position.set(-1.83, -0.35, 0.45);
	scene.add(wheel3);
	const wheel4 = wheel.clone();
	wheel4.name = 'wheel4'; 
	wheel4.position.set(-1.83, -0.35, -0.45); 
	scene.add(wheel4); 



}