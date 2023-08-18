"use-strict";

import * as THREE from "../imports/three/build/three.module.js";
import { OrbitControls } from "../imports/three/examples/jsm/controls/OrbitControls.js";

import * as REQUEST from "../controller/rqst-model-data-ctrl.js";
import * as MODEL from "./module/model-module.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "../imports/three/examples/jsm/renderers/CSS2DRenderer.js";

/**************************************
 * DEMO VIEWER 3D POUR LA PAGE D'ACCUEIL
 *************************************/

const path = "../models/fbx/eglise";

const request = new REQUEST.RequestAPI(path);
const reqres = await request.init();

const container = document.querySelector(".demo-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3042);

const camera = new THREE.PerspectiveCamera(
  70,
  container.clientWidth / container.clientHeight,
  0.1,
  2500
);

const renderer = new THREE.WebGLRenderer({ antialias: true }); // correction les effets de crénelage
renderer.setSize(container.clientWidth, container.clientHeight); // taille du moteur de rendu
renderer.setPixelRatio(window.devicePixelRatio); // taille du pixel du moteur de rendu par rapport au pc utilisé
renderer.physicallyCorrectLights = true; // Activation du rendu PBR
container.append(renderer.domElement); // ajout du moteur de rendu dans le container

/**************************************
 * ECLAIRAGE DE LA SCENE
 *************************************/

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.color.setHSL(0.1, 1, 0.95);
dirLight.position.set(-1, 1.75, 1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d = 50;

dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = -0.0001;

/**************************************
 * TEXTE DEMO
 *************************************/
const textZone = new CSS2DRenderer();
textZone.domElement.innerHTML = "← Toucher pour interagir avec le modèle 3D →";
textZone.domElement.style.color = "white";
textZone.domElement.style.fontFamily = "Arial";
textZone.domElement.style.backgroundColor = "rgba(0,0,0,0.2)";
textZone.domElement.style.fontSize = "1em";
textZone.domElement.style.width = "auto";
textZone.domElement.style.height = "auto";
textZone.domElement.style.textAlign = "center";
textZone.domElement.style.paddingTop = "10px";
textZone.domElement.style.bottom = "25px";
textZone.setSize(container.clientWidth, container.clientHeight / 10);
textZone.domElement.style.position = "absolute";
container.appendChild(textZone.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controlsUpdate(1, true, true, true, true, controls);

/**************************************
 * Gestion du chargement de tous les modèles stockés dans le dossier correspondant
 *************************************/
const modelNames = request.getModelNames();
// console.log("modelnames areeeeee these : "+modelNames);

//-------------------------------------
// Génération des panoramas
//-------------------------------------

let panoPresence = false;

/**************************************
 * APPEL A MODEL-MODULE.JS
 *************************************/
const model = new MODEL.Model(
  scene,
  path,
  modelNames,
  panoPresence,
  container,
  camera,
  "fbx",
  controls,
  renderer,
  "welkome"
);

const toX = new THREE.Vector3(6, 0, 0);
const colorX = new THREE.Color(0xff0000);

const arrowHelperX = repereGeneration(toX, colorX);
// création de l'axe Y
const toY = new THREE.Vector3(5, 0, 1);
const colorY = new THREE.Color(0x0070c0);

const arrowHelperY = repereGeneration(toY, colorY);
// création de l'axe Z
const toZ = new THREE.Vector3(5, 1, 0);
const colorZ = new THREE.Color(0x00b050);

const arrowHelperZ = repereGeneration(toZ, colorZ);

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  model.render(renderer);
  render();
}

function render() {
  renderer.render(scene, camera);
}

/* Fonction permettant de factoriser les étapes de création du repère
 * @param {*} to
 * @param {*} color => la couleur de l'axe
 * @returns => un arrowHelper
 */
function repereGeneration(to, color) {
  const from = new THREE.Vector3(5, 0, 0);
  const direction = to.clone().sub(from);
  const l = direction.length();
  const arrowHelper = new THREE.ArrowHelper(
    direction.normalize(),
    from,
    l,
    color
  );
  return arrowHelper;
}

/**
 * Fonction de changement des paramètre inérents au controles de la vu du modèle 3D
 * @param {*} rotateSpeed => 1 par défault, vitesse de déplacement du modèle
 * @param {*} zoom => true par défault ; active ou non la possibilité de zoomer sur le modèle
 * @param {*} pan => true par défault ; active ou non la possibilité de naviger
 * @param {*} damping => true par défault ; permet d'activer ou non l'intertie dans la navigation
 * @param {*} rotate => true par défault ; permet d'activer ou non la manipulation en 3D du modèle
 */
function controlsUpdate(
  rotateSpeed = 1,
  zoom = true,
  pan = true,
  damping = true,
  rotate = true,
  controlsParam
) {
  if (controlsParam == undefined) {
    controls.rotateSpeed = rotateSpeed;
    controls.enableZoom = zoom;
    controls.enablePan = pan;
    controls.enableDamping = damping;
    controls.enableRotate = rotate;
    controls.update();
  } else {
    controlsParam.rotateSpeed = rotateSpeed;
    controlsParam.enableZoom = zoom;
    controlsParam.enablePan = pan;
    controlsParam.enableDamping = damping;
    controlsParam.enableRotate = rotate;
    controlsParam.update();
  }
}

/**
 * Tracage des mouvements de la souris
 */
function mouseMoove(e) {
  const mouse = { x: 0, y: 0 };

  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
  return mouse;
}

function modeVirtualVisit() {
  container.setAttribute("style", "cursor: grab");
  model.hideModel(); // désactive la visibilité de l'interface graphique du modèle 3D
}

function initVirtualVisit() {
  modeVirtualVisit();
  return renderer;
}

export { controlsUpdate, mouseMoove, initVirtualVisit };
