import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default (scene) =>{
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const helper = new THREE.CameraHelper( camera );
    scene.add(helper);
    camera.position.set(0,0,0)
    scene.add(camera);

    const light = new THREE.PointLight(0xcccccc, 10, 20);
    light.position.set(0,0.1,0);
    const helper2 = new THREE.PointLightHelper(light);
    scene.add(helper2);
    scene.add(light);

    const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const cam_tracker = new THREE.Object3D();
    const light_tracker = new THREE.Object3D();
    cam_tracker.name = "tCam";
    light_tracker.name = "tLight";
    cube.add(cam_tracker);
    cube.add(light_tracker);
    cam_tracker.add(camera);
    light_tracker.add(light);

    camera.position.x = 1;
    light.position.x = 1;
    camera.lookAt(cam_tracker.position);

    function setupKeyControls() {
        var tCam = scene.getObjectByName('tCam');
        document.onkeydown = function(e) {
          if(e.key == 'w')
            tCam.rotation.x += 0.1;
          if(e.key == 's')
            tCam.rotation.x -= 0.1;
          if(e.key == 'a')
            tCam.rotation.y += 0.1;
          if(e.key == 'd')
            tCam.rotation.y -= 0.1;
        };
      }

      setupKeyControls();
}

export function setupMouseControls(scene, button) {
    var tLight = scene.getObjectByName('tLight');
    var val = 0.01;
      if(button == 0)
        tLight.rotation.x += val;
      if(button == 2)
        tLight.rotation.x -= val;
      if(button == 3)
        tLight.rotation.y += val;
      if(button == 4)
        tLight.rotation.y -= val;
};