"use-strict";

import * as MODEL_LIST from "../request-controller/rqst-model-list-ctrl.js";
import * as MODEL_SET from "../request-controller/rqst-model-set-ctrl.js";

/**
 * Récupération des modèles de l'utilisateur connecté
 */

const model = new MODEL_LIST.RequestModelList();
const listModel = await model.getModel();

const list = document.querySelector(".model-list-container");
console.log(list);

let cities = [];

listModel.forEach((element) => {
  console.log(element);

  if (cities.includes(element.CITY)) {
    document.querySelector(
      `.${element.CITY}`
    ).innerHTML += `<li class="${element.MNAME}">model : ${element.MNAME}</li>`;
  } else {
    cities.push(element.CITY);

    list.innerHTML += `<details class="list" name="${element.CITY}"><summary>--- ${element.CITY} ---</summary><ul class="${element.CITY}"><li class="${element.MNAME}">model: ${element.MNAME}</li></ul></details>`;
  }
});

/**
 * Selection du modèle à afficher
 */

const modelToLoad = document.querySelectorAll("li");
console.log(modelToLoad);

modelToLoad.forEach((items) => {
  items.addEventListener("click", (e) => {
    console.log("model to load");
    console.log(e.target.className);
    const modelSet = new MODEL_SET.RequestModelSet(e.target.className);
    modelSet.setModel();
  });
});

/**
 * Interaction avec la barre de nav
 */

const log = document.querySelector(".login");
console.log(log);

log.addEventListener("click", () => {
  console.log("login");
  window.location.replace("http://archi-test.com/admin");
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
