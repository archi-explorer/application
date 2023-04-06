/**
 * Import de la librairie ThreeJS ainsi que des différents modules de l'application
 */
import * as THREE from "../imports/three/build/three.module.js";
import { OrbitControls } from "../imports/three/examples/jsm/controls/OrbitControls.js";

import * as REQUEST from "../request-controller/rqst-model-data-ctrl.js";
import * as PANO from "./module/panorama-module.js";
import * as MODEL from "./module/model-module.js";

/**
 * Déclanchement de la récupération des données en fonction du modèle set dans l'applciation
 */

const request = new REQUEST.RequestAPI();
await request.init();

/**
 * Récupération du modèle à afficher
 */

const modelName = request.getMname();
console.log(modelName);

/**
 * Définition des variables d'initialisations de la scène
 */
const container = document.querySelector(".scene-container");

// Déclaration de la scène dans son ensemble
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3042);

// Déclaration des lumières de la scène
const l1 = new THREE.HemisphereLight("white", 3);
const l2 = new THREE.DirectionalLight("white", 5);
const l3 = new THREE.DirectionalLight("white", 5);
// Positionnement des lumières
l1.position.set(0, -100, 0);
l2.position.set(-100, 50, 100);
l3.position.set(100, 50, -100);
// Ajout des lumières à la scène
scene.add(l1, l2, l3);

// Ajout de la camèra de la scène
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
); // Paramètre de la caméra
camera.position.set(0, 3, 20); // mise en place de la caméra assez loin du modèle

// Création du moteur de rendu en activant la correction des effets d'anticrénelage
const renderer = new THREE.WebGLRenderer({ antialias: true }); // correction les effets de crénelage
renderer.setSize(container.clientWidth, container.clientHeight); // taille du moteur de rendu
renderer.setPixelRatio(window.devicePixelRatio); // taille du pixel du moteur de rendu par rapport au pc utilisé
renderer.physicallyCorrectLights = true; // Activation du rendu PBR
container.append(renderer.domElement);
// Fin déclaration de la scène

// Déclaration du traque de la souris
const mouse = { x: 0, y: 0 };

/**
 * Déclaration des moyens de contrôles autorisés sur les modèles
 */
const controls = new OrbitControls(camera, renderer.domElement); // controles autorisés : zoom, rotation et translation sans contraintes limites
controlsUpdate(); // initialisation par défault des paramètres de navigation dans le modèle 3D

//-------------------------------------
// Génération des panoramas
//-------------------------------------

let panoPresence = false;

const loaderPanorama = new THREE.TextureLoader();
const listPano = request.getPano();
console.log(listPano);

const textureLoad = initTexture(loaderPanorama);

/**
 * Fonction d'initialisation des textures des panoramas
 * @param {*} loader
 * @returns
 */
function initTexture(loader) {
  if (listPano.length == 0) {
    return null;
  }

  let texture = [];

  for (let i = 0; i < listPano.length; i++) {
    texture[i] = loader.load(`../../panoramas/${modelName}/${listPano[i]}`);
  }

  return texture;
}
console.log(textureLoad);

const list = request.getCoord();
console.log(list);

let pano = undefined; // par défault on considère que il n'y a pas de panoramas

switch (list) {
  case null:
    console.log("No panorama to load");
    panoPresence = false;
    break;
  default:
    panoPresence = true;
    // Initialisation de la classe Panorama
    pano = new PANO.Pano(scene, list, textureLoad, camera, mouse);
    console.log(pano);

    scene.traverseVisible((child) => {
      if (child.isMesh && (child.geometry.type = THREE.SphereGeometry)) {
        const m = child;
        pano.pickableObjects.push(m);
      }
    });

    console.log(pano.pickableObjects);

    /**
     * Fonction anonyme d'initialisation de toute la partie vu panoramique sur le modèle
     */
    renderer.domElement.addEventListener(
      "click",
      (e) => {
        console.log("activate pano");
        pano.panoDisplay(e);
      },
      false
    );

    console.log("init pano done");
}

function initVirtualVisit() {
  modeVirtualVisit();
  return renderer;
}

//----------------------------------------------
// Génération du modèle à afficher
//----------------------------------------------

// Requête pour avoir la longueur du modèle choisi
const modelNames = request.getModelNames();
console.log(modelNames);
// Initialisation du modèle à afficher
const path = `../../model/${modelName}`;

const model = new MODEL.Model(
  scene,
  path,
  modelNames,
  panoPresence,
  container,
  camera
);

/**
 * Au chargement de la page on active les toggle par défault
 */
toggleManagerHelp();

//---------------------------------------------
// Gestion des tools à la disposition de l'utilisateur
//---------------------------------------------

/**
 * Gestion du positionnement de la caméra en mode nav
 */
document.querySelector(".navigationMode").addEventListener("click", () => {
  controls.reset();
  controlsUpdate();
  camera.position.set(0, 3, 20); // position de la caméra
  camera.up = new THREE.Vector3(0, 1, 0); // orientation de la caméra
  camera.updateProjectionMatrix();
  animate();
});

/**
 * Gestion du positionnement de la caméra en mode overView
 */
document.querySelector(".overView").addEventListener("click", () => {
  camera.position.set(0, 15, 0);
  camera.up = new THREE.Vector3(0, 0, -1);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  controlsUpdate(1, true, true, true, false);
  camera.updateProjectionMatrix();
  animate();
});

/**
 * Gestion du mode mesure
 */
let modeMesure = false;

document.querySelector(".mesure").addEventListener("click", () => {
  toggleManager();
  toggleManagermesure();

  model.mesure(renderer, controls);
});

document.querySelector(".closeMesure").addEventListener("click", () => {
  toggleManager();
  toggleManagermesure();

  renderer.domElement.style.cursor = "default";
  model.clearMeasurement();
});

document.querySelector(".clearMesure").addEventListener("click", () => {
  model.clearMeasurement();
});

/**
 * Gestion de la visite virtuelle
 */
document.querySelector(".virtualVisit").addEventListener("click", () => {
  switch (panoPresence) {
    case true:
      const curentPano = list.listStations[0];
      pano.virtualVisit(curentPano);
      break;
    default:
      alert("There is no pano in this model");
      console.log("No pano to load");
  }
});

/**
 * Gestion du plein écran
 */

/**
 * fonction de gestion du plein écran
 * @param {*} screen => moteur d'affichage de l'application
 */
function fullScreen(screen) {
  if (!document.fullscreenElement) {
    if (screen.requestFullscreen) {
      screen.requestFullscreen();
    } else if (screen.webkitRequestFullscreen) {
      screen.webkitRequestFullscreen();
    } else if (screen.msRequestFullscreen) {
      screen.msRequestFullscreen();
    }
  } else {
    if (screen.exitFullscreen) {
      screen.exitFullscreen(); //instruction pour la compatibilité avec les navigateurs courants type Opera ou Internet Explorer
    } else if (screen.webkitExitFullscreen) {
      screen.webkitExitFullscreen(); //instruction pour la compatibilité avec les navigateurs Chrome et Safari notamment
    } else if (screen.msExitFullscreen) {
      screen.msExitFullscreen(); //instruction pour la compatibilité avec le navigateur Mozilla Firefox
    }
  }
}

/**
 * Gestion au click sur l'icon plein écran
 */
document.querySelector(".fullScreen").addEventListener("click", () => {
  console.log("fullScreen");
  const elem = document.querySelector("body");
  fullScreen(elem);
});
// Fin gestion plein écran

/**
 * Gestion de l'outil d'aide
 */
document.querySelector(".helpLink").addEventListener("click", () => {
  toggleManager();
  toggleManagerHelp();
});

document.querySelector(".closeHelp").addEventListener("click", () => {
  toggleManager();
  toggleManagerHelp();
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  model.render(renderer);
}
animate();

//-----------------------------------------------
// Gestion des lien vers le header
//-----------------------------------------------

const log = document.querySelector(".login");
log.addEventListener("click", () => {
  console.log("login");
  window.location.replace("http://archi-test.com/admin");
});

const modelChoosing = document.querySelector(".modelLink");
modelChoosing.addEventListener("click", () => {
  console.log("model");
  window.location.replace("http://archi-test.com/model-chooser");
});

//-----------------------------------------------
// Lien du footer
//-----------------------------------------------

/**
 * Lien vers FaceBook
 */
document.querySelector("#faceBook").addEventListener("click", () => {
  window.open("https://www.facebook.com/ArchimedGe");
});

/**
 * Lien vers Insta
 */
document.querySelector("#instagram").addEventListener("click", () => {
  window.open("https://www.instagram.com/archimedge");
});

/**
 * Lien vers LinkedIn
 */
document.querySelector("#linkedIn").addEventListener("click", () => {
  window.open("https://fr.linkedin.com/company/archimed-ge");
});

/**
 * Lien site groupe
 */
document.querySelector(".footerLeft").addEventListener("click", () => {
  window.open("https://www.archimed-ge.com/");
});

//-----------------------------------------------
// Création d'un repère 3D pour l'application
//-----------------------------------------------

/**
 * Fonction permettant de factoriser les étapes de création du repère
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

// Un repère 3D a 3 données X, Y et Z
// création de l'axe X
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

//------------------------------------------------
// Visibilité du repère XYZ
//------------------------------------------------

let landmarkVisibility = false; // Visibilité de l'axe à flase par défaut
window.addEventListener("keypress", (e) => {
  // console.log(e);
  if (e.key === "g" && !landmarkVisibility) {
    scene.add(arrowHelperX, arrowHelperY, arrowHelperZ);
    // console.log(landmarkVisibility);
    landmarkVisibility = !landmarkVisibility;
  } else if (e.key === "g" && landmarkVisibility) {
    scene.remove(arrowHelperX, arrowHelperY, arrowHelperZ);
    // console.log(landmarkVisibility);
    landmarkVisibility = !landmarkVisibility;
  }
});

//------------------------------------------
// Gestion de l'affichage de l'interface et des controls
//------------------------------------------
/**
 * Fonction de mise à jour de la vu en fonction du tool choisi
 */
function toggleManager() {
  container.setAttribute("style", "cursor: defalut");

  const tools = document.querySelector(".tools");
  const head = document.querySelector("header");
  const foot = document.querySelector("footer");
  const help = document.querySelector(".helpLink");

  tools.classList.toggle("hideElement");
  head.classList.toggle("hideElement");
  foot.classList.toggle("hideElement");
  help.classList.toggle("hideElement");
}

/**
 * Fonction de gestion de l'affichage du mode de mesure sur le modèle
 */
function toggleManagermesure() {
  const close = document.querySelector(".closeMesure");
  const clear = document.querySelector(".clearMesure");

  switch (modeMesure) {
    case false:
      close.setAttribute("style", "visibility: visible");
      clear.setAttribute("style", "visibility: visible");
      modeMesure = !modeMesure;
      model.hideGui();
      break;
    default:
      close.setAttribute("style", "visibility: hidden");
      close.setAttribute("style", "visibility: hidden");
      modeMesure = !modeMesure;
      model.hideGui();
  }
}

function toggleManagerHelp() {
  const help = document.querySelector(".helpPage");
  const helpContainer = document.querySelector(".helpContainer");

  help.classList.toggle("hideElement");
  helpContainer.classList.toggle("hideElement");

  model.hideModel(); // désactive la visibilité de l'interface graphique du modèle 3D
}

function modeVirtualVisit() {
  toggleManager();
  container.setAttribute("style", "cursor: grab");
  model.hideModel(); // désactive la visibilité de l'interface graphique du modèle 3D
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
  rotate = true
) {
  controls.rotateSpeed = rotateSpeed;
  controls.enableZoom = zoom;
  controls.enablePan = pan;
  controls.enableDamping = damping;
  controls.enableRotate = rotate;

  controls.update();
}

/**
 * Tracage des mouvements de la souri
 */
function mouseMoove(e) {
  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
  return mouse;
}

export {
  toggleManager,
  controlsUpdate,
  modeVirtualVisit,
  mouseMoove,
  initVirtualVisit,
};
