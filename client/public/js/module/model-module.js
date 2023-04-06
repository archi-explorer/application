import * as THREE from "../../imports/three/build/three.module.js";
import { MTLLoader } from "../../imports/three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "../../imports/three/examples/jsm/loaders/OBJLoader.js";
import { GUI } from "../../imports/three/examples/jsm/libs/dat.gui.module.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "../../imports/three/examples/jsm/renderers/CSS2DRenderer.js";

import { mouseMoove } from "../model-viewer.js";

/**
 * Classe de gestion du modèle 3D
 */
class Model {
  _scene;
  _path;
  _names;
  _presencePano;

  _cam;
  _mouse;

  _gui;
  _set;
  _modelFolder;

  _pickableMesurement;
  _labelRenderer;
  _removableItemsMesh;
  _removableItemsLabel;

  /**
   * Variables de prise de mesure
   */
  _line;
  _lineId;
  _measureLabel;
  _raycast;
  _drawing;
  _intersectedMesh;

  _guiStatus;

  constructor(scene, path, names, pano, container, cam) {
    this._scene = scene;
    console.log(this._scene);
    this._path = path;
    this._names = names;
    this._presencePano = pano;

    this._cam = cam;
    this.initMouse();

    this._gui = new GUI({ autoPlace: false });
    this.initGui();

    this._set = {};
    this.initSettings();

    this._modelFolder = this._gui.addFolder("Model");

    this._pickableMesurement = [];
    this.initMesurement(container);

    this.init();

    this._removableItemsLabel = [];

    this._lineId = 0;
    this._removableItemsMesh = [];
    this._measureLabel = {};
    this._drawing = false;
    this._intersectedMesh = undefined;

    this.initRaycast();

    this.clickMesureHandler = this.clickMesure.bind(this);
    this.mouseMesureHandler = this.mesureMouseMoove.bind(this);

    this._guiStatus = false;
  }

  initRaycast() {
    const raycast = new THREE.Raycaster();
    this._raycast = raycast;
  }

  initMouse() {
    const mouse = new THREE.Vector2();
    this._mouse = mouse;
  }

  /**
   * Fonction d'initialisation de l'outil de mesure sur le modèle
   * @param {*} container
   */
  initMesurement(container) {
    this._labelRenderer = new CSS2DRenderer();
    this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this._labelRenderer.domElement.style.position = "absolute";
    this._labelRenderer.domElement.style.top = "0px";
    this._labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(this._labelRenderer.domElement);

    // window.addEventListener(
    //   "resize",
    //   this.windowRecize(container, renderer),
    //   false
    // );
  }

  addToMeasurement(c) {
    this._pickableMesurement.push(c);
  }

  /**
   * Fonction de mesure sur le modèle
   * @param {*} render
   * @param {*} control
   */
  mesure(render, control) {
    console.log("enter in mesure mode");

    /**
     * Prise de la mesure
     */
    window.addEventListener("keydown", (e) => {
      if (e.key == "Control") {
        console.log("ctrl activate");

        console.log(this._raycast);

        control.enabled = false;
        render.domElement.style.cursor = "crosshair";

        render.domElement.addEventListener(
          "pointerdown",
          this.clickMesureHandler
        );
        document.addEventListener("mousemove", this.mouseMesureHandler);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key == "Control") {
        console.log("ctrl disable");
        control.enabled = true;
        render.domElement.style.cursor = "default";

        if (this._drawing) {
          this._scene.remove(this._line);
          this._scene.remove(this._measureLabel[this._lineId]);
          this._drawing = false;
        }

        render.domElement.removeEventListener(
          "pointerdown",
          this.clickMesureHandler
        );
        document.removeEventListener("mousemove", this.mouseMesureHandler);
      }
    });

    //   render.domElement.addEventListener(
    //     "pointerdown",
    //     this.clickMesure(drawingLine, raycastMesure),
    //     false
    //   );
    // }
  }

  /**
   * début de la mesure sur le modèle
   */
  clickMesure() {
    console.log("click mesure");

    // console.log(this._raycast);
    // console.log(this._pickableMesurement);

    this._raycast.setFromCamera(this._mouse, this._cam);
    console.log(this._raycast);
    this._intersectedMesh = this._raycast.intersectObjects(
      this._pickableMesurement,
      false
    );

    // console.log(this._intersectedMesh);

    if (this._intersectedMesh.length > 0) {
      if (!this._drawing) {
        const points = [];
        points.push(this._intersectedMesh[0].point);
        points.push(this._intersectedMesh[0].point.clone());

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        this._line = new THREE.LineSegments(
          geometry,
          new THREE.LineBasicMaterial({
            color: 0xff0000,
            transparent: false,
            opacity: 1,
            linewidth: 1,
          })
        );
        console.log(points);
        this._line.frustumCulled = false;
        this._removableItemsMesh.push(this._line);

        console.log(this._line);
        this._scene.add(this._line);
        // création d'un élément pour afficher la mesure sur le label
        const mesurementDiv = document.createElement("div");
        mesurementDiv.className = "mesureLabel";
        mesurementDiv.innerText = "0.0m";

        const measurementLabel = new CSS2DObject(mesurementDiv);
        console.log(measurementLabel.position);
        measurementLabel.position.copy(this._intersectedMesh[0].point);

        this._measureLabel[this._lineId] = measurementLabel;
        this._removableItemsLabel.push(measurementLabel);

        this._scene.add(this._measureLabel[this._lineId]);
        this._drawing = true;
      } else {
        const positions = this._line.geometry.attributes.position.array;
        positions[3] = this._intersectedMesh[0].point.x;
        positions[4] = this._intersectedMesh[0].point.y;
        positions[5] = this._intersectedMesh[0].point.z;

        this._line.geometry.attributes.position.needsUpdate = true;
        this._lineId++;
        this._drawing = false;
      }
    }
  }

  /**
   * traquage de la souris pour mesurer une distance sur le modèle pour fin de la mesure
   * @param {*} e
   */
  mesureMouseMoove(e) {
    console.log("mesure");
    e.preventDefault();
    this._mouse = mouseMoove(e);

    if (this._drawing) {
      this._raycast.setFromCamera(this._mouse, this._cam);
      this._intersectedMesh = this._raycast.intersectObjects(
        this._pickableMesurement,
        false
      );

      if (this._intersectedMesh.length > 0) {
        const positions = this._line.geometry.attributes.position.array;
        const v0 = new THREE.Vector3(positions[0], positions[1], positions[2]);
        const v1 = new THREE.Vector3(
          this._intersectedMesh[0].point.x,
          this._intersectedMesh[0].point.y,
          this._intersectedMesh[0].point.z
        );
        positions[3] = this._intersectedMesh[0].point.x;
        positions[4] = this._intersectedMesh[0].point.y;
        positions[5] = this._intersectedMesh[0].point.z;
        this._line.geometry.attributes.position.needsUpdate = true;

        const distance = v0.distanceTo(v1);
        const dhz = Math.sqrt(Math.pow(v1.z - v0.z, 2));
        const dv = Math.sqrt(Math.pow(v1.y - v0.y, 2));

        this._measureLabel[this._lineId].element.innerText = `Mesure: 
        ${distance.toFixed(2)}m
        Mesure Horizontale:
        ${dhz.toFixed(2)}m
        Mesure verticale:
        ${dv.toFixed(2)}m`;

        this._measureLabel[this._lineId].position.lerpVectors(v0, v1, 0.5);
      }
    }
  }

  /**
   * Fonction de "netoyage de l'outil de mesure, efface les mesures prisent sur le modèle"
   */
  clearMeasurement() {
    if (this._removableItemsMesh.length > 0) {
      this._removableItemsMesh.forEach((mesh) => {
        this._scene.remove(mesh);
      });
      this._removableItemsLabel.forEach((label) => {
        this._scene.remove(label);
      });
      this._removableItemsMesh = [];
      this._removableItemsLabel = [];
    }
  }

  windowRecize(container, renderer) {
    this._cam.aspect = container.clientWidth / container.clientHeigth;
    this._cam.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeigth);
    renderer.setPixelRatio(window.devicePixelRatio);
    this._labelRenderer.setSize(window.innerWidth, window.innerHeight);

    this.render(renderer);
  }

  render(renderer) {
    this._labelRenderer.render(this._scene, this._cam);
    renderer.render(this._scene, this._cam);
  }

  /**
   * Fonction d'initialisation de l'interface du modèle 3D
   */
  initGui() {
    const containerGUI = document.querySelector(".guiContainer");
    containerGUI.appendChild(this._gui.domElement);
    this._gui.hide();
  }

  /**
   * Fonction d'initialisation des settings du modèle 3D
   */
  initSettings() {
    let set = {};
    for (let i = 0; i < this._names.length; i++) {
      const key = `Visibilité model ${this._names[i]}`;
      set[key] = true;
    }
    this._set = set;
  }

  /**
   * Fonction d'initialisation du modèle 3D
   */
  init() {
    for (let i = 0; i < this._names.length; i++) {
      const folder = this._modelFolder.addFolder(this._names[i]);
      this.loadModel(this._names[i], folder);
    }
  }

  /**
   * Chargement du modèle 3D
   * @param {Integer} id
   * @param {Path} folder
   */
  loadModel(name, folder) {
    try {
      const texture = new MTLLoader();
      texture.load(
        this._path + `/${name}/${name}.mtl`,
        (materials) => {
          try {
            materials.preload();

            const model = new OBJLoader();
            model.setMaterials(materials);
            model.load(
              this._path + `/${name}/${name}.obj`,
              (object) => {
                object.traverse((node) => {
                  if (node.material) {
                    // node.material.side = THREE.DoubleSide; // Affichage des 2 coté du modèle si cela existe
                    node.material.dithering = true;
                  }
                });
                // Ajout du modèle à la scène
                this._scene.add(object);

                // Rotation de l'object affiché
                // object.rotation.x = THREE.MathUtils.degToRad(-90);
                // object.rotation.y = THREE.MathUtils.degToRad(180);
                // object.rotation.z = THREE.MathUtils.degToRad(180);

                /**
                 * Fonction de modification de la visibilité
                 * @param {boolean} visibility
                 */
                function modelVisibility(visibility) {
                  object.visible = visibility;
                }

                // Ajout et lien du modèle 3D avec un dossier du GUI pour permettre de modifier ses propriétés de visibilité
                folder
                  .add(this._set, `Visibilité model ${name}`)
                  .onChange(modelVisibility);
                folder.open();

                this._scene.traverse((child) => {
                  if (child.isMesh) {
                    this.addToMeasurement(child);
                  }
                });

                document
                  .querySelector(".virtualVisit")
                  .addEventListener("click", () => {
                    object.traverse((o) => {
                      o.visible = false;
                    });
                  });

                window.addEventListener("keypress", (e) => {
                  if (e.keyCode === 27) {
                    object.traverse((o) => {
                      o.visibility = true;
                    });
                  }
                });
              },
              (xhr) => {
                //fonction qui permet d'afficher en continue le pourcentage de chargement du modèle dans la console du navigateur
                if ((xhr.loaded / xhr.total) * 100 != 100) {
                  // console.log(
                  //   (xhr.loaded / xhr.total) * 100 + "% loaded OBJ model" + id
                  // );
                } else {
                  this.loaderHidden(); // fonction d'affichage du modèle
                }
              }
            );
          } catch (error) {
            console.log(error.message);
          }
        },
        (xhr) => {
          console.log(
            (xhr.loaded / xhr.total) * 100 + "% loaded MTL model " + name
          );
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Fonction pour enlever l'icone de chargement une fois le chargement le modèle chargé
   */
  loaderHidden() {
    document
      .querySelector(".loader")
      .setAttribute("style", "visibility: hidden");

    this._gui.show();
  }

  /**
   * Fonction de changement de l'état du modèle 3D
   * @param {*} statu
   */
  hideModel() {
    if (this._guiStatus) {
      console.log("hide");
      this._gui.hide();
      this._scene.children.forEach((element) => {
        if (element.type == "Group") {
          element.visible = false;
        }
      });
      console.log("hiden");
      this._guiStatus = !this._guiStatus;
    } else {
      console.log("show");
      this._gui.show();
      this._scene.children.forEach((element) => {
        if (element.type == "Group") {
          element.visible = true;
        }
      });
      this._guiStatus = !this._guiStatus;
    }
  }

  hideGui() {
    if (this._guiStatus) {
      this._gui.hide();
      this._guiStatus = !this._guiStatus;
    } else {
      this._gui.show();
      this._guiStatus = !this._guiStatus;
    }
  }
}

export { Model };
