import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;

// Sets the color of the background
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Camera positioning
camera.position.set(12, 6, 6);

// Sets orbit control to move the camera around
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;

const dLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(dLight);
dLight.position.set(3, 3, -3);
dLight.castShadow = true;
dLight.shadow.mapSize.width = 1024;
dLight.shadow.mapSize.height = 1024;

const planeGeo = new THREE.PlaneGeometry(6, 6);
const planeMat = new THREE.MeshStandardMaterial();
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
scene.add(planeMesh);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.receiveShadow = true;

const loader = new GLTFLoader();

const lod = new THREE.LOD();
scene.add(lod);

loader.load('/Cactus_high.glb', function (glb) {
  const model = glb.scene;
  console.log(model);
  model.traverse(function (node) {
    if (node.isMesh) node.castShadow = true;
  });
  //scene.add(model);
  lod.addLevel(model, 0);
});

loader.load('/Cactus_medium.glb', function (glb) {
  const model = glb.scene;
  model.traverse(function (node) {
    if (node.isMesh) node.castShadow = true;
  });
  //scene.add(model);
  lod.addLevel(model, 10);
});

loader.load('/Cactus_low.glb', function (glb) {
  const model = glb.scene;
  model.traverse(function (node) {
    if (node.isMesh) node.castShadow = true;
  });
  //scene.add(model);
  lod.addLevel(model, 20);
});

function animate() {
  controls.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
