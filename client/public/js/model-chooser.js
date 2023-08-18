"use-strict";

import * as MODEL_LIST from "../controller/rqst-model-list-ctrl.js";
import * as MODEL_SET from "../controller/rqst-model-set-ctrl.js";

// /**
//  * Récupération des modèles de l'utilisateur connecté
//  */

// getRole du user connecté
const rid = await fetch(
  "https://archi-explorer.com/controller/get-role-session.php",
  {
    method: "GET",
  }
)
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    return error;
  }); //retourne le role id du user connecté
//console.log("rid current user : " + rid);

const model = new MODEL_LIST.RequestModelList(rid);
const listModel = await model.getModel();

const list = document.querySelector(".model-list-container");
// console.log(list);

listModel.forEach((element) => {
  var listElements = `<li class="model-li" id=${element[3]}/${element[1]}> 
    <div><p class="model-name" id=${element[0]}>${element[1]}</p></div>
    <div><p class="model-extension" id=${element[3]}>${element[3]}</p></div>
    <div><p class="model-city" id=${element[1]}>${element[2]}</p></div> 
    </li>`;

  list.innerHTML += listElements;
});

// /**
//  * Selection du modèle à afficher
//  */

const modelBlocks = document.querySelectorAll(".model-li");

modelBlocks.forEach((block) => {
  block.addEventListener("click", (e) => {
    // block.id de la forme : extension/modelName
    let extension = block.id.split("/")[0];
    let modelName = block.id.split("/")[1];
    // console.log("model name is : " + modelName);
    // console.log("extension is : " + extension);

    let model;

    if (extension != "" && modelName != "") {
      model = new MODEL_SET.RequestModelSet(extension, block.id);

      model.setModel();
    } else {
      console.log("error : extension or model name is empty");
    }
  });
});
