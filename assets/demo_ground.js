export default (scene) =>{
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const helper = new THREE.CameraHelper( camera );
    scene.add(helper);
    scene.add(camera);

}