"use-strict";

import * as MODEL_LIST from "../request-controller/rqst-model-list-ctrl";
import * as AUTH from "../request-controller/rqst-authenticate-ctrl.js";

/**
 * Génération de l'interface
 */
const modelUploadList = document.querySelector("#pickfile-model");
const panoUploadList = document.querySelector("#pickfile-pano");
const csvUploadList = document.querySelector("#pickfile-csv");

const model = new MODEL_LIST.RequestModelList(
  "sample-model",
  modelUploadList,
  "sample-panorama",
  panoUploadList,
  "sample-csv",
  csvUploadList
);

/**
 * Génération de la liste des modèles
 */

const listModel = await model.getModel();

const list = document.querySelector(".model-list-container");

let cities = [];

listModel.forEach((element) => {
  if (cities.includes(element.CITY)) {
    document.querySelector(
      `.${element.CITY}`
    ).innerHTML += `<li>model : ${element.MNAME}</li>`;
  } else {
    cities.push(element.CITY);

    list.innerHTML += `<details class="list" name="${element.CITY}"><summary>--- ${element.CITY} ---</summary><ul class="${element.CITY}"><li class="${element.MNAME}">model: ${element.MNAME}</li></ul></details>`;
  }
});

/**
 * Formulaire d'ajout d'un modèles
 */

const btnAddModel = document.querySelector(".add-model");
const addModel = document.querySelector(".add-model-container");

btnAddModel.addEventListener("click", () => {
  console.log("ajout modèle");
  addModel.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target == addModel) {
    addModel.style.display = "none";
  }
});

const formAddModel = document.querySelector(".form-add-model");
formAddModel.addEventListener("submit", (e) => {
  e.preventDefault();

  addModel.style.display = "none";

  const city = document.querySelector("#city");
  const role = document.querySelector("#role-model");

  formUpload(city, role);

  city.value = "";
  role.value = "";
});

async function formUpload(city, role) {
  const uploadStatus = await model.addModel(city.value, role.value);

  console.log(uploadStatus);

  if (!uploadStatus) {
    updateKO();
  }
}

/**
 * Vue des utilisateurs
 */

const users = new AUTH.RequestgetUsers();
const usersList = await users.getUsers();

const listUser = document.querySelector(".user-list-container");

usersList.forEach((user) => {
  listUser.innerHTML += `<li id="container-${user[0]}" class="">
  <p>${user[0]}</p>
  <p>${user[1]}</p>
  <p>${user[2]}</p>
  <div class="alter-bdd">
    <button class="modify-user" id="${user[0]}">Modifier</button>
    <button class="delete-user" id="${user[0]}">Supprimer</button>
  </div>
  </li>`;
});

/**
 * Modification d'un utilisateur
 */

// Valeur des modifications
const updateUname = document.querySelector("#update-login");
const updateEmail = document.querySelector("#update-email");
const updateRole = document.querySelector("#update-role");

let curentUname;

const btnModifyUser = document.querySelectorAll(".modify-user");
// console.log(btnModifyUser);
const modifyUser = document.querySelector(".update-user-container");

window.addEventListener("click", (e) => {
  if (e.target == modifyUser) {
    modifyUser.style.display = "none";

    updateUname.value = "";
    updateRole.value = "";
    updateEmail.value = "";
  }
});

btnModifyUser.forEach((element) => {
  // console.log(element);
  element.addEventListener("click", () => {
    // console.log(element.id);
    const elemToModif = document.querySelectorAll(`#container-${element.id} p`);
    console.log(elemToModif);

    updateUname.value = elemToModif[0].innerHTML;
    updateEmail.value = elemToModif[2].innerHTML;
    updateRole.value = elemToModif[1].innerHTML;

    curentUname = elemToModif[0].innerHTML;

    modifyUser.style.display = "flex";
  });
});

/**
 * Formulaire modification d'un utilisateur
 */

const formUpdate = document.querySelector(".update-user-container");
formUpdate.addEventListener("submit", (e) => {
  e.preventDefault();

  modifyUser.style.display = "none";

  formUpdateUser(
    curentUname,
    updateUname.value,
    updateRole.value,
    updateEmail.value
  );

  updateUname.value = "";
  updateRole.value = "";
  updateEmail.value = "";
});

async function formUpdateUser(uname, nUname, nRole, nEmail) {
  const update = new AUTH.RequestUpdateUser(uname, nUname, nRole, nEmail);
  const stateUpdate = await update.updateUser();

  console.log(stateUpdate);

  if (stateUpdate) {
    location.reload();
    updateOK();
  } else {
    updateKO();
  }
}

/**
 * Changement du mot de passse
 */

const btnChangePsw = document.querySelector("#psw-form");
const pswChangeContainer = document.querySelector(".change-psw-container");

const nPsw = document.querySelector("#update-psw");
const nPswConf = document.querySelector("#update-psw-conf");

window.addEventListener("click", (e) => {
  if (e.target == pswChangeContainer) {
    pswChangeContainer.style.display = "none";

    nPsw.value = "";
    nPswConf.value = "";
  }
});
// console.log(changePsw);
btnChangePsw.addEventListener("click", () => {
  modifyUser.style.display = "none";

  pswChangeContainer.style.display = "flex";
  nPsw.value = "";
  nPswConf.value = "";
});

/**
 * Formulaire changement du psw
 */

const formPsw = document.querySelector(".form-change-psw");
formPsw.addEventListener("submit", (e) => {
  e.preventDefault();

  pswChangeContainer.style.display = "none";

  if (nPsw.value === nPswConf.value) {
    formModifPsw(curentUname, nPsw.value);
  }

  nPsw.value = "";
  nPswConf.value = "";
});

async function formModifPsw(uname, nPsw) {
  console.log("update");
  const update = new AUTH.RequestUpdatePsw(uname, nPsw);
  const updateStatu = await update.updatePsw();

  if (updateStatu) {
    updateOK();
  } else {
    updateKO();
  }
}

/**
 * Suppression d'un utilisateur
 */

const confDelUser = false;

const deleteUser = document.querySelectorAll(".delete-user");
// console.log(deleteUser);

deleteUser.forEach((element) => {
  // console.log(element);
  element.addEventListener("click", () => {
    formDeleteUser(element.id);
  });
});

async function formDeleteUser(id) {
  // console.log(element.id);
  const del = new AUTH.RequestDeleteUser(id);
  const statDel = await del.deleteUser();

  console.log(statDel);

  if (statDel) {
    location.reload();
    updateOK();
  } else {
    updateKO();
  }
}

/**
 * Comportement formulaire ajout utilisateur
 */

const btnAddUser = document.querySelector(".add-user");
const addUser = document.querySelector(".add-user-container");

btnAddUser.addEventListener("click", () => {
  console.log("ajout utilisateur");
  addUser.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target == addUser) {
    addUser.style.display = "none";
  }
});

/**
 * Formulaire d'ajout d'un nouvel utilisateur
 */

const formAddUser = document.querySelector(".form-add-user");
formAddUser.addEventListener("submit", (e) => {
  e.preventDefault();

  formAddUserSubmit();
});

async function formAddUserSubmit() {
  const mname = document.querySelector("#login");
  const psw = document.querySelector("#psw");
  const pswConfirmation = document.querySelector("#psw-confirmation");
  const role = document.querySelector("#role-user");
  const email = document.querySelector("#email");

  if (psw.value == pswConfirmation.value) {
    addUser.style.display = "none";

    const newUser = new AUTH.RequestCreateUser(
      mname.value,
      psw.value,
      role.value,
      email.value
    );
    const state = await newUser.createUser();

    mname.value = "";
    psw.value = "";
    pswConfirmation.value = "";
    role.value = "";
    email.value = "";

    if (state) {
      location.reload();
    } else {
      updateKO();
    }
  } else {
    alert("Veuillez renseigner le même mot de passe");
  }
}

/**
 * Pop up d'état de la mise à jour
 */

function updateOK() {
  const popUp = document.querySelector(".update-ok");
  console.log(popUp);
  popUp.style.display = "flex";
  setTimeout(() => {
    popUp.style.display = "none";
  }, 5000);
}

function updateKO() {
  const popUp = document.querySelector(".update-ko");
  console.log(popUp);
  popUp.style.display = "flex";
  setTimeout(() => {
    popUp.style.display = "none";
  }, 5000);
}

/**
 * Lien dans le header
 */

const signout = document.querySelector(".signout");
signout.addEventListener("click", () => {
  console.log("signout");
  const signout = new AUTH.RequestSignout();
  signout.signout();
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
