//global viewer
import * as THREE from "../imports/three/build/three.module.js";
import { OrbitControls } from "../imports/three/examples/jsm/controls/OrbitControls.js";
import * as REQUEST from "../controller/rqst-model-data-ctrl.js";

//fbx
// import Stats from "../imports/three/examples/jsm/libs/stats.module.js";

//obj-mtl
import * as PANO from "./module/panorama-module.js";
import * as MODEL from "./module/model-module.js";

/**
 * Déclenchement de la récupération des données en fonction du modèle set dans l'applciation
 */
const URLmodel = await fetch("../controller/get-model-loader.php", {
  //retourne fbx/maison.fbx ou obj-mtl/maison
  method: "GET",
})
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    return error;
  });
// console.log("apres tout, le nom model est : " + URLmodel);

let rendererVirtualVisit = undefined;
let renderer = undefined;
let model = undefined;
let controls = undefined;
let camera = undefined;
let modeMesure = false;

//split by '/' and get the last element
// we will get "maison" from "obj-mtl/maison"
const modelName = URLmodel.split("/").pop();
// console.log(modelName);

// selectionne le loader à utiliser
const extension = URLmodel.split("/")[0]; // fbx ou obj-mtl
const path = `../models/${extension}/${modelName}`; //
const panoramaPath = `../models/${extension}/${modelName}/panoramas`; //

/***************
// Initialisation de la requête
****************/
const request = new REQUEST.RequestAPI(path);
const resreq = await request.init();

/**************
 * Partie commune à tous les LOADERS
 *************/
const container = document.querySelector(".scene-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d3042);

if (extension == "fbx") {
  camera = createCamera(70, 0.1, 2500);

  renderer = createRenderer();
  container.append(renderer.domElement);

  allSetupForModel(camera, renderer);
} else if (extension == "obj-mtl") {
  camera = createCamera(75, 0.1, 1000);

  renderer = createRenderer();
  container.append(renderer.domElement);

  allSetupForModel(camera, renderer);
} else {
  console.log("erreur : extension non reconnue (dans merge.js)");
  window.location.assign("https://archi-explorer.com/admin");
  exit(1);
}

/*
 * Fonction qui permet de charger un modèle 3D
 * @param {string} path - chemin vers le modèle 3D
 * @param {string} extension - extension du modèle 3D
 */
function allSetupForModel(camera, renderer) {
  //extension, path, panoramaPath = global
  /**************************************
   * ECLAIRAGE
   *************************************/
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );

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

  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHelper );

  //setup global
  if (renderer == undefined) {
    console.log("renderer is undefined");
    return;
  }
  if (camera == undefined) {
    console.log("camera is undefined");
    return;
  }

  controls = new OrbitControls(camera, renderer.domElement);
  if (controls == undefined) {
    console.log("controls is undefined");
    return;
  }
  controlsUpdate(1, true, true, true, true, controls);

  const mouse = { x: 0, y: 0 }; // Déclaration du traque de la souris

  rendererVirtualVisit = renderer;

  /**************************************
   * Gestion du chargement de tous les modèles stockés dans le dossier correspondant
   *************************************/
  const modelNames = request.getModelNames();
  // console.log("modelnames are these : " + modelNames);

  //-------------------------------------
  // Génération des panoramas
  //-------------------------------------

  let panoPresence = false;
  const loaderPanorama = new THREE.TextureLoader();
  const listPano = request.getPano(); // retourne un tableau avec tous les noms des panoramas
  const textureLoad = initTexture(loaderPanorama);

  /**
   * Fonction d'initialisation des textures des panoramas
   * @param {*} loader
   * @returns
   */
  function initTexture(loader) {
    if (listPano.length == 0) {
      // coord.csv n'est pas pris en compte dans la liste des panos
      return null;
    }

    let texture = [];

    for (let i = 0; i < listPano.length; i++) {
      texture[i] = loader.load(`${panoramaPath}/${listPano[i]}`); // "../models/extension/modele/panoramas/pano1.jpg..."
    }

    return texture;
  }
  // console.log("texture load (panorama load result) is : " + textureLoad);

  const list = request.getCoord();

  let pano = undefined; // par défault on considère que il n'y a pas de panoramas

  switch (list) {
    case null:
      // console.log("No panorama to load");
      panoPresence = false;
      break;
    default:
      panoPresence = true;
      // Initialisation de la classe Panorama
      pano = new PANO.Pano(scene, list, textureLoad, camera, mouse, renderer);
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

  /**************************************
   * APPEL A MODEL-MODULE.JS
   *************************************/
  model = new MODEL.Model(
    scene,
    path,
    modelNames,
    panoPresence,
    container,
    camera,
    extension,
    controls,
    renderer,
    "model-viewer"
  );

  if (model == undefined) {
    console.log("model is undefined after model creation");
    return;
  }
  // console.log("camera position is : " + JSON.stringify(camera.position));
  toggleManagerHelp(model);

  //---------------------------------------------
  // Après avoir chargé et préparé le modèle, on setup les outils et HUD
  //--------------------------------------------
  /**
   * Gestion du positionnement de la caméra en mode nav
   */
  document.querySelector(".navigationMode").addEventListener("click", () => {
    console.log("navigation mode clicked");
    const OGCamPosition = model.getOGCamPosition();
    const CurrentCenter = model.getCurrentCenter();

    camera.position.set(OGCamPosition[0], OGCamPosition[1], OGCamPosition[2]);
    camera.lookAt(
      new THREE.Vector3(CurrentCenter[0], CurrentCenter[1], CurrentCenter[2])
    );
    controlsUpdate(1, true, true, true, true, controls);
    //camera.updateProjectionMatrix();
    animate();
  });

  /**
   * Gestion du positionnement de la caméra en mode overView
   */
  document.querySelector(".overView").addEventListener("click", () => {
    console.log("overview mode clicked");
    const CurrentCenter = model.getCurrentCenter();

    camera.position.set(
      CurrentCenter[0],
      CurrentCenter[1] * 4,
      CurrentCenter[2]
    );
    camera.lookAt(
      new THREE.Vector3(CurrentCenter[0], CurrentCenter[1], CurrentCenter[2])
    );
    controlsUpdate(1, true, true, true, false, controls);
    //camera.updateProjectionMatrix();
    animate();
  });

  /**
   * Gestion du mode mesure
   */

  document.querySelector(".mesure").addEventListener("click", () => {
    toggleManager();
    modeMesure = toggleManagermesure(modeMesure, model);
    model.mesure(renderer, controls);
  });

  document.querySelector(".closeMesure").addEventListener("click", () => {
    model.clearMeasurement();
    toggleManager();
    modeMesure = toggleManagermesure(modeMesure, model);
    renderer.domElement.style.cursor = "default";
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
        console.log("No pano to load");
        alert("There is no pano in this model");
    }
  });

  /**
   * Gestion au click sur l'icon plein écran
   */
  document.querySelector(".fullScreen").addEventListener("click", () => {
    console.log("fullScreen");
    const elem = document.querySelector("body");
    fullScreen(elem);
  });

  /**
   * Gestion de l'outil d'aide
   */
  document.querySelector(".helpLink").addEventListener("click", () => {
    toggleManager();
    toggleManagerHelp(model);
  });

  document.querySelector(".closeHelp").addEventListener("click", () => {
    toggleManager();
    toggleManagerHelp(model);
  });

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
  animate();
}

/***************
 * Fonctions
 * *************/

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  model.render(renderer);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function createCamera(fov, near, far) {
  const camera = new THREE.PerspectiveCamera(
    fov,
    container.clientWidth / container.clientHeight,
    near,
    far
  );
  return camera;
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true }); // correction les effets de crénelage
  renderer.setSize(container.clientWidth, container.clientHeight); // taille du moteur de rendu
  renderer.setPixelRatio(window.devicePixelRatio); // taille du pixel du moteur de rendu par rapport au pc utilisé
  renderer.physicallyCorrectLights = true; // Activation du rendu PBR

  return renderer;
}

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     render()
// }

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

function toggleManagerHelp(model) {
  const help = document.querySelector(".helpPage");
  const helpContainer = document.querySelector(".helpContainer");

  help.classList.toggle("hideElement");
  helpContainer.classList.toggle("hideElement");

  model.hideModel(); // désactive la visibilité de l'interface graphique du modèle 3D
}

/**
 * Fonction de mise à jour de la vu en fonction du tool choisi
 */
function toggleManager() {
  container.setAttribute("style", "cursor: default");

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
function toggleManagermesure(modeMesure, model) {
  const close = document.querySelector(".closeMesure");
  const clear = document.querySelector(".clearMesure");

  if (modeMesure == false) {
    close.setAttribute("style", "visibility: visible");
    clear.setAttribute("style", "visibility: visible");
    modeMesure = !modeMesure;
    model.hideGui();
  } else if (modeMesure == true) {
    close.setAttribute("style", "visibility: hidden");
    clear.setAttribute("style", "visibility: hidden");
    modeMesure = !modeMesure;
    model.hideGui();
  }
  return modeMesure;
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

function modeVirtualVisit() {
  toggleManager();
  container.setAttribute("style", "cursor: grab");
  model.hideModel(); // désactive la visibilité de l'interface graphique du modèle 3D
}

function initVirtualVisit() {
  modeVirtualVisit();
  return renderer;
}

/* fonction de gestion du plein écran
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

export { toggleManager, controlsUpdate, modeVirtualVisit, initVirtualVisit };
