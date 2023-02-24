/**
 * Import de la lib ThreeJS ainsi que de certaines focntion du script principal
 */
import * as THREE from "../../imports/three/build/three.module.js";

import {
  modeVirtualVisit,
  controlsUpdate,
  mouseMoove,
  initVirtualVisit,
} from "../model-viewer.js";

/**
 * Création d'une classe de gestion de toutes les vues panoramiques du programme
 */
class Pano {
  _scene; // => scène pour l'affichage
  _list; // => liste des coodronnées des panoramas dans le modèle
  _texture; // => liste des panoramas

  _mesh;
  _raycasterPanorama;
  pickableObjects;
  _pickablePreviousMesh;
  _pickableNextMesh;
  _intersects;
  _intersectedObject;

  _cam; // => caméra sur le modèle
  _mouse; // => traqueur de la souris

  _activePano;
  _panoNames;

  constructor(scene, list, texture, cam, mouse) {
    this._scene = scene;
    this._list = list;
    this._texture = texture;

    this._mouse = mouse;
    this._cam = cam;

    this._activePano = "";
    this._panoNames = {};

    this.pickableObjects = [];
    this._pickablePreviousMesh = [];
    this._pickableNextMesh = [];
    this._intersects = [];
    this._intersectedObject;

    this.initValues();
    this.initRaycast();
    this.setPickablePreviousMesh();
    this.setPickableNextMesh();
  }

  /**
   * Fonction d'initialisation de toutes les figures 3D du modèle
   */
  initValues() {
    // console.log(this._list.listStations.length);
    const geometry = initGeometry(this._list);
    // console.log(geometry);
    const material = initMaterial(this._list, this._texture);
    // console.log(material);
    const mesh = initMesh(this._list, geometry, material);
    // console.log(mesh);

    // positionnement de la coordonnée X sur des maillages
    for (let i = 0; i < this._list.listX.length; i++) {
      mesh.meshPositionnement[i].position.x = this._list.listX[i];
      mesh.meshPanorama[i].position.x = this._list.listX[i];
      mesh.meshPrevious[i].position.x = this._list.listXPrecedent[i];
      mesh.meshNext[i].position.x = this._list.listXSuivant[i];
    }

    // positionnement de la coordonnée Y dans tous les maillages
    for (let i = 0; i < this._list.listY.length; i++) {
      mesh.meshPositionnement[i].position.y = this._list.listY[i];
      mesh.meshPanorama[i].position.y = this._list.listY[i];
      mesh.meshPrevious[i].position.y = this._list.listYPrecedent[i];
      mesh.meshNext[i].position.y = this._list.listYSuivant[i];
    }

    // positionnement de la coordonnée Z dans tous les maillages
    for (let i = 0; i < this._list.listZ.length; i++) {
      mesh.meshPositionnement[i].position.z = this._list.listZ[i];
      mesh.meshPanorama[i].position.z = this._list.listZ[i];
      mesh.meshPrevious[i].position.z = this._list.listZPrecedent[i];
      mesh.meshNext[i].position.z = this._list.listZSuivant[i];
    }

    // mise à jour du nom des maillages
    for (let i = 0; i < this._list.listStations.length; i++) {
      mesh.meshPositionnement[i].name = this._list.listStations[i];
      mesh.meshPanorama[i].name = this._list.listStations[i];
      mesh.meshPrevious[i].name = this._list.listStations[i];
      mesh.meshNext[i].name = this._list.listStations[i];
    }

    // Ajout des mesh initialisé à la mesh
    for (let i = 0; i < this._list.listStations.length; i++) {
      this._scene.add(mesh.meshPositionnement[i]);
      this._scene.add(mesh.meshPrevious[i]);
      this._scene.add(mesh.meshNext[i]);
      this._scene.add(mesh.meshPanorama[i]);
    }

    this._mesh = mesh;
    // console.log(this._mesh);
  }

  /**
   * Fonction d'initialisation du Raycast
   */
  initRaycast() {
    const raycast = new THREE.Raycaster();
    this._raycasterPanorama = raycast;
    // console.log(this._raycasterPanorama);
  }

  /**
   * Fonction de set des Cones précédentes en fonction du panorama actif actuellement
   */
  setPickablePreviousMesh() {
    // Stockage des cones de déplacement vers le panorama précédent
    for (let i = 0; i < this._list.listStations.length; i++) {
      this._pickablePreviousMesh[i] = this._mesh.meshPrevious[i];
    }
    // console.log(this._pickablePreviousMesh);
  }

  /**
   * Fonction de set des Cones suivants en fonction du panorama actif actuellement
   */
  setPickableNextMesh() {
    // Stockage des cones de déplacement vers le panorama suivant
    for (let i = 0; i < this._list.listStations.length; i++) {
      this._pickableNextMesh[i] = this._mesh.meshNext[i];
    }
    // console.log(this._pickableNextMesh);
  }

  /**
   * Fonction de set du panorama dans l'espace
   * @param {*} e
   * @param {*} container
   * @param {*} renderer
   */
  panoDisplay(e) {
    console.log("mode pano");

    this._mouse = mouseMoove(e);
    this._raycasterPanorama.setFromCamera(this._mouse, this._cam);
    this._intersects = this._raycasterPanorama.intersectObjects(
      this.pickableObjects,
      false
    );

    console.log(this._intersects);

    if (this._intersects.length > 0) {
      this._intersectedObject = this._intersects[0].object;
      console.log(this._intersectedObject.name);
      this.virtualVisit(this._intersectedObject.name);
    }
  }

  /**
   * Fonction permettant de charger le panorama à afficher, permet au moment de l'activation du mode visite virtuelle de choisir le premier panorama à charger mais également d'afficher le panorama sur lequel l'utilisateur aurait cliqué
   * @param {*} activePano
   */
  virtualVisit(activePano) {
    console.log("debut visite virtuelle");

    const renderer = initVirtualVisit();
    console.log(renderer);

    if (activePano === undefined) {
      console.log("Aucun panorama n'est actif");
    } else {
      this._activePano = activePano;
      this._mesh.meshPanorama.forEach((pano) => {
        if (pano.name == this._activePano) {
          pano.visible = true;

          this._intersectedObject = pano;
        } else {
          pano.visible = false;
        }
      });

      this._panoNames = viewPano(this._activePano);
      console.log(this._panoNames);

      console.log(this._intersectedObject);

      this._cam = camPosition(this._cam, this._intersectedObject);

      // Désactive les vus des autres sphères en mode panorama
      this._mesh.meshPositionnement.forEach((m) => {
        m.visible = false;
      });
      coneActivation(this._mesh.meshPrevious, this._panoNames.previous);
      coneActivation(this._mesh.meshNext, this._panoNames.next);
    }

    // Fonction importé de mise à jour du panorama
    controlsUpdate(-0.25, false, false, true);

    const previousMeshRaycaster = new THREE.Raycaster();
    const nextMeshRaycaster = new THREE.Raycaster();

    /**
     * Set du listener sur les cones pour le passage au panorama précédent
     */
    renderer.domElement.addEventListener(
      "click",
      (e) => {
        (this._mouse = mouseMoove(e)),
          this.previousPanoNavigation(previousMeshRaycaster);
      },
      false
    );

    /**
     * Set du listener sur les cones pour le passage au panorama suivant
     */
    renderer.domElement.addEventListener("click", (e) => {
      (this._mouse = mouseMoove(e)), this.nextPanoNavigation(nextMeshRaycaster);
    });

    window.addEventListener(
      "keydown",
      (e) => {
        console.log(e);
        if (e.key === "Escape") {
          this.closePano();
        }
      },
      false
    );
  }

  /**
   * Fonction de passage au panorama précédent
   * @param {*} raycaster
   */
  previousPanoNavigation(raycaster) {
    // console.log("previous pano");
    console.log(this._activePano);
    console.log(this._panoNames);

    raycaster.setFromCamera(this._mouse, this._cam);
    // console.log(this._pickablePreviousMesh);
    const intersectPano = raycaster.intersectObjects(
      this._pickablePreviousMesh,
      false
    );

    console.log(intersectPano);

    if (intersectPano.length > 0) {
      for (let i = 0; i < intersectPano.length; i++) {
        if (
          intersectPano[i].object.name === this._panoNames.previous.toString()
        ) {
          console.log("Pano activate");
          this._mesh.meshPanorama.forEach((p) => {
            if (p.name === this._panoNames.previous.toString()) {
              p.visible = true;
              this._cam = camPosition(this._cam, this._intersectedObject);
              console.log("nouveau panorama activé");
              this._activePano = this._panoNames.previous;
            } else {
              p.visible = false;
            }
          });
        }
      }
      this._panoNames = viewPano(this._activePano);

      updatePanoNav(this._mesh.meshNext, this._panoNames.next);
      updatePanoNav(this._mesh.meshPrevious, this._panoNames.previous);
      console.log("fin update");
    }
  }

  /**
   * Fonction de passage au panorama suivant
   * @param {*} raycaster
   */
  nextPanoNavigation(raycaster) {
    // console.log("next pano");
    console.log(this._activePano);
    console.log(this._panoNames);

    raycaster.setFromCamera(this._mouse, this._cam);
    // console.log(this._pickableNextMesh);
    const intersectPano = raycaster.intersectObjects(
      this._pickableNextMesh,
      false
    );

    console.log(intersectPano);

    if (intersectPano.length > 0) {
      for (let i = 0; i < intersectPano.length; i++) {
        if (intersectPano[i].object.name === this._panoNames.next.toString()) {
          console.log("Pano activate");
          this._mesh.meshPanorama.forEach((p) => {
            if (p.name === this._panoNames.next.toString()) {
              p.visible = true;
              this._cam = camPosition(this._cam, this._intersectedObject);
              console.log("nouveau panorama activé");
              this._activePano = this._panoNames.next;
            } else {
              p.visible = false;
            }
          });
        }
      }
      this._panoNames = viewPano(this._activePano);

      updatePanoNav(this._mesh.meshNext, this._panoNames.next);
      updatePanoNav(this._mesh.meshPrevious, this._panoNames.previous);
    }
  }

  /**
   * Fonction de set de la sortie du mode panorama lorsqu'on appui sur la touche "Esc"
   * @param {*} e
   */
  closePano() {
    console.log("sortie mode pano");
    location.reload();
  }
}

/**
 * Initialisation des variables geometry
 * @returns
 */
const initGeometry = (list) => {
  let geo = {
    geometryPositionnement: [],
    geometryPrevious: [],
    geometryNext: [],
    geometryPanorama: [],
  };
  for (let i = 0; i < list.listStations.length; i++) {
    // Implémentation des géométries des différents éléments
    geo.geometryPositionnement[i] = new THREE.SphereGeometry(0.1, 32, 32); // sphère de 0.1m de rayon
    geo.geometryPrevious[i] = new THREE.ConeGeometry(0.6, 3, 32); // cone de 0.6m Nextn
    geo.geometryNext[i] = new THREE.ConeGeometry(0.6, 3, 32);
    geo.geometryPanorama[i] = new THREE.SphereGeometry(
      50,
      32,
      32,
      0,
      Math.PI * 2,
      0,
      Math.PI - THREE.MathUtils.degToRad(39)
    ); // Créé une sphère de 50m de rayon à 360°
  }
  // console.log(geo);

  return geo;
};

/**
 * Initialisation des variables material
 * @returns
 */
const initMaterial = (list, texture) => {
  let mat = {
    materialPositionnement: [],
    materialPrevious: [],
    materialNext: [],
    materialPanorama: [],
  };
  for (let i = 0; i < list.listStations.length; i++) {
    // Implémentation des textures des différents éléments
    mat.materialPositionnement[i] = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    mat.materialPositionnement[i].tranparent = true;
    mat.materialPositionnement[i].opacity = 0.75;

    mat.materialPrevious[i] = new THREE.MeshBasicMaterial({ color: 0x4dc1ed });
    mat.materialPrevious[i].tranparent = true;
    mat.materialPrevious[i].opacity = 0.5;

    mat.materialNext[i] = new THREE.MeshBasicMaterial({
      color: 0x9acd31,
    });
    mat.materialNext[i].tranparent = true;
    mat.materialNext.opacity = 0.5;

    // Création du panorama projeté
    for (let j = 0; j < list.listStations.length; j++) {
      texture[j].wrapS = THREE.RepeatWrapping;
      texture[j].repeat.x = -1; // Application de la texture dans le sens gauche droite
    }

    mat.materialPanorama[i] = new THREE.MeshBasicMaterial({
      map: texture[i],
      side: THREE.DoubleSide,
    });
    mat.materialPanorama[i].tranparent = true;
    // Fin création panoramas de projections
  }

  return mat;
};

/**
 * Initialisation des variables mesh
 * @param {*} geo
 * @param {*} mat
 * @returns
 */
const initMesh = (list, geo, mat) => {
  let mesh = {
    meshPositionnement: [],
    meshPrevious: [],
    meshNext: [],
    meshPanorama: [],
  };
  for (let i = 0; i < list.listStations.length; i++) {
    // Implémentation des maillages
    mesh.meshPositionnement[i] = new THREE.Mesh(
      geo.geometryPositionnement[i],
      mat.materialPositionnement[i]
    ); // maillages pour modélisation dans la scène
    mesh.meshPositionnement[i].visible = true;

    mesh.meshPrevious[i] = new THREE.Mesh(
      geo.geometryPrevious[i],
      mat.materialPrevious[i]
    );
    mesh.meshPrevious[i].rotation.z = THREE.MathUtils.degToRad(90);
    mesh.meshPrevious[i].visible = false;

    mesh.meshNext[i] = new THREE.Mesh(geo.geometryNext[i], mat.materialNext[i]);
    mesh.meshNext[i].rotation.z = THREE.MathUtils.degToRad(-90);
    mesh.meshNext[i].visible = false;

    mesh.meshPanorama[i] = new THREE.Mesh(
      geo.geometryPanorama[i],
      mat.materialPanorama[i]
    );
    mesh.meshPanorama[i].visible = false;
  }

  return mesh;
};

/**
 *
 * @param {*} activePano
 * @returns
 */
function viewPano(activePano) {
  const pano = setFollowingPano(activePano);

  console.log(pano);

  console.log(`Next panorama ${pano.next}`);
  console.log(`Previous panorama ${pano.previous}`);

  return pano;
}

/**
 * Fonction de mise à jour des pano suivant et précédent
 * @param {*} intersected
 * @returns
 */
function setFollowingPano(intersected) {
  const nextPanoName = parseFloat(intersected) + 1;
  console.log(nextPanoName);
  const previousPanoName = parseFloat(intersected) - 1;
  console.log(previousPanoName);

  const panoName = {
    next: nextPanoName,
    previous: previousPanoName,
  };

  return panoName;
}

/**
 * Fonction de mise à jour de la navigation entre les panoramas
 * @param {*} mesh => mesh du pano précédent ou suivant
 * @param {*} panoName => list des noms du panorama
 */
function updatePanoNav(mesh, panoName) {
  mesh.forEach((child) => {
    if (child.name === panoName.toString()) {
      child.visible = true; // visibilité du cone précédent
      console.log("flêche  " + child.name);
    } else {
      child.visible = false;
    }
  });
}

/**
 * Fonction d'activation des cones de déplacement
 * @param {*} mesh
 * @param {*} panoName
 */
function coneActivation(mesh, panoName) {
  // Active le cone de déplacement au panorama
  mesh.forEach((m) => {
    if (m.name === panoName.toString()) {
      m.visible = true;
    } else {
      m.visible = false;
    }
  });
}

//---------------------------------------------------------
// Fonctions de mise à jour des controles
//---------------------------------------------------------

/**
 * Fonction de repositionnement de la caméra
 * @param {*} cam
 * @param {*} intersectedObject
 */
function camPosition(cam, intersectedObject) {
  // position de la caméra au centre du panorama ; aucun mouvement 3D possible disponnible
  cam.position.x = intersectedObject.position.x + 1;
  cam.position.y = intersectedObject.position.y - 1;
  cam.position.z = intersectedObject.position.z - 1;

  return cam;
}

// Export de la class panorama
export { Pano };
