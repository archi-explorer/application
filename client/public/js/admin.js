"use-strict";

import * as MODEL_LIST from "../controller/rqst-model-list-ctrl";
import * as AUTH from "../controller/rqst-user-ctrl";
import * as ROLE from "../controller/rqst-role-ctrl";



/**
 * 
 * PARTIE MODELE
 * 
 */


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
  console.log("element dans listModel : "+element);
  
  if (cities.includes(element[2])) {
    document.querySelector(
      `.${element[2]}`
    ).innerHTML += `<li>model : ${element[1]}</li>`;
  } else {
    cities.push(element[2]);
  
    list.innerHTML += `<details class="list" name="${element[2]}"><summary>--- ${element[2]} ---</summary><ul class="${element[2]}"><li class="${element[1]}">model: ${element[1]}</li></ul></details>`;
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
 * 
 * PARTIE UTLISATEURS (ET ROLES)
 * 
 */


/**
 * Vue des utilisateurs && roles (MIXED BECAUSE OF DROPDOWN)
 */

// USERS
const users = new AUTH.RequestgetUsers();
const usersList = await users.getUsers();

//ROLES
const roles = new ROLE.RequestGetRoles();
const rolesList = await roles.getRoles();

if(usersList && rolesList){
  const listUser = document.querySelector(".user-list-container");
  

  //0 => login, 1 => name, 2 => role, 3 => email
  usersList.forEach((user) => { //gotta check if [3]
    listUser.innerHTML += `<li id="container-${user[0]}" class="">
    <p>${user[0]}</p>
    <p contenteditable="true" class="user-username" id="${user[0]}">${user[1]}</p>
    
    <select class="user-role-select" id="${user[0]}">
    ${rolesList.map((role) => {
      if(role[1] == user[2])
        return `<option value="${role[0]}" selected="selected">${role[1]}</option>`;
      else
        return `<option value="${role[0]}">${role[1]}</option>`;
    })}
    </select>

    <p contenteditable="true" class="user-email" id="${user[0]}">${user[3]}</p>

    <div class="alter-bdd">
      <button class="modify-user" id="${user[0]}">Changer Password</button>
      <button class="delete-user" id="${user[0]}">Supprimer</button>
    </div>
    </li>`;
  });


  const listRole = document.querySelector(".role-list-container");

  rolesList.forEach((role) => {
    listRole.innerHTML += `<li id="container-${role[0]}" class="">
    <p>${role[0]}</p>
    <p contenteditable="true" class="role-rname" id="${role[0]}">${role[1]}</p>
    <div class="alter-bdd">
      <button class="delete-role" id="${role[0]}">Supprimer</button>
    </div>
   </li>`;
  });
}


//select est rempli, maintenant on ajoute la requete qui changera dans la bdd la valeur du role
const roleSelectList = document.querySelectorAll(".user-role-select");

roleSelectList.forEach((element) => {
  const OGuserRole = element.value;
  element.addEventListener("change", (e) => {
    if(confirm("Voulez-vous vraiment changer le role de l'utilisateur ?")){
      updateUserRoleById(element.id, element.value);
      location.reload();
    }
    else
      element.value = OGuserRole;
  });
});

async function updateUserRoleById(username, roleid) {
  const userRoleUpdate = new AUTH.RequestUpdateRoleById(username, roleid);
  const userRoleStatus = await userRoleUpdate.updateRoleById();

  if (!userRoleStatus) {
    updateKO();
  }
}


/**
 * Modification du nom d'un utilisateur
 */

const editUsernameList = document.querySelectorAll(".user-username");
var OGname;

editUsernameList.forEach((element) => {
  element.addEventListener("focusin", (e) => {
    OGname = e.target.innerHTML;
  });

  element.addEventListener("focusout", (e) => {
    if (OGname != e.target.innerHTML) {
      if(confirm("Voulez-vous vraiment changer le nom d'utilisateur ?"))
        updateUsername(element.id, e.target.innerHTML)
      else
        e.target.innerHTML = OGname;
    }
    else{
      console.log("we do nothing");
    }
  });
});

async function updateUsername(username, name) {
  const usernameUpdate = new AUTH.RequestUpdateUsername(username, name);
  const usernameStatus = await usernameUpdate.updateUsername();

  if (!usernameStatus) {
    updateKO();
  }
}


/**
 * Modification d'un email d'un user
 */

const editEmailList = document.querySelectorAll(".user-email");
var OGemail;

editEmailList.forEach((element) => {
  element.addEventListener("focusin", (e) => {
    OGemail = e.target.innerHTML;
  });

  element.addEventListener("focusout", (e) => {
    if (OGemail != e.target.innerHTML) {
      if(confirm("Voulez-vous vraiment changer l'email de l'utilisateur?"))
        updateEmailFromId(element.id, e.target.innerHTML)
      else
        e.target.innerHTML = OGemail;
    }
    else{
      console.log("we do nothing");
    }
  });
});

async function updateEmailFromId(username, email) {
  const emailUpdate = new AUTH.RequestUpdateEmail(username, email);
  const emailStatus = await emailUpdate.updateEmail();

  if (!emailStatus) {
    updateKO();
  }
}


/**
 * Changement du mot de passse
 */

const btnChangePsw = document.querySelectorAll(".modify-user");
console.log("these are the buttons : \n"+ btnChangePsw);
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

btnChangePsw.forEach((element) => {
  element.addEventListener("click", () =>  {
    pswChangeContainer.style.display = "flex";
    nPsw.value = "";
    nPswConf.value = "";
  });
});

/**
 * Formulaire changement du psw
 */

const formPsw = document.querySelector(".form-change-psw");
formPsw.addEventListener("submit", (e) => {
  e.preventDefault();

  pswChangeContainer.style.display = "none";

  if (nPsw.value === nPswConf.value) {
    formModifPsw(currentUname, nPsw.value);
  }

  nPsw.value = "";
  nPswConf.value = "";
});

async function formModifPsw(username, nPsw) {
  console.log("update");
  const update = new AUTH.RequestUpdatePsw(username, nPsw);
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

deleteUser.forEach((element) => {
  element.addEventListener("click", () => {
    if(confirm("Voulez-vous vraiment supprimer l'utilisateur ?"))
      formDeleteUser(element.id);
  });
});

async function formDeleteUser(id) {
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
 * 
 * PARTIE ROLE
 * 
 */


/**
 * Ajout d'un role
 */


const btnAddRole = document.querySelector(".add-newrole");
const addRole = document.querySelector(".add-role-container");

btnAddRole.addEventListener("click", () => {
  console.log("ajout role");
  addRole.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target == addRole) {
    addRole.style.display = "none";
  }
});


/**
 * Formulaire d'ajout d'un nouveau role
 */

const formAddRole = document.querySelector(".form-add-role");
formAddRole.addEventListener("submit", (e) => {
  e.preventDefault();

  formAddRoleSubmit();
});

async function formAddRoleSubmit() {
  const rname = document.querySelector("#role-name");

  addRole.style.display = "none";

  const newRole = new ROLE.RequestCreateRole(rname.value);
  const state = await newRole.createRole();

  rname.value = "";

  if (state) {
    updateOK();
  } else {
    updateKO();
  }
}



/**
 * Modifications d'un role (role name dans la table role)
 */

const editRNameList = document.querySelectorAll(".role-rname");
var OGcontent;

editRNameList.forEach((element) => {
  element.addEventListener("focusin", (e) => {
    OGcontent = e.target.innerHTML;
  });

  element.addEventListener("focusout", (e) => {
    if (OGcontent != e.target.innerHTML) {
      if(confirm("Voulez-vous vraiment changer le nom du role ?"))
        updateRoleName(element.id, e.target.innerHTML)
      else
        e.target.innerHTML = OGcontent;
    }
    else{
      console.log("we do nothing");
    }
  });
});

async function updateRoleName(roleid, rname) {
  const roleUpdate = new ROLE.RequestUpdateRole(roleid, rname);
  const roleStatus = await roleUpdate.updateRole();

  if (!roleStatus) {
    updateKO();
  }
}
  



/**
 * Suppression d'un role
 */

const btnDelRole = document.querySelectorAll(".delete-role");

btnDelRole.forEach((element) => {
  element.addEventListener("click", () => {
    if(confirm("Voulez-vous vraiment supprimer le role ?"))
      formDeleteRole(element.id);
  });
});

async function formDeleteRole(id) {
  const del = new ROLE.RequestDeleteRole(id);
  const statDel = await del.deleteRole();

  if (statDel) {
    updateOK();
  } else {
    updateKO();
  }
}


/**
 * 
 * PARTIE POPUPS
 * 
 */


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

const signout = document.querySelector(".signout");
console.log(signout);
signout.addEventListener("click", () => {
  console.log("signout");
  const auth = new AUTH.RequestSignout();
  auth.signout();
});




/**
 * 
 * PARTIE ONGLETS
 * 
 */


/**
 * Gestion des onglets utilisateurs et roles
 */


const onglets = document.querySelectorAll(".onglets");
const contenu = document.querySelectorAll(".contenu");

let index = 0;

onglets.forEach((onglet) => {
  onglet.addEventListener("click", () => {
    if(onglet.classList.contains("active")){
      
      return;
    }
    else{
      onglet.classList.add("active");
      //appelle a nouveau le get

    }

    index = onglet.getAttribute("data-anim");
    console.log(index);

    for (var i = 0; i < onglets.length; i++) {
      if (onglets[i].getAttribute("data-anim") != index) {
        onglets[i].classList.remove("active");
      }
    }

    for(var j = 0; j < contenu.length; j++){
      if(contenu[j].getAttribute("data-anim") == index){
        contenu[j].style.display = "block";
        contenu[j].classList.add("actifContenu");
      }
      else{
        contenu[j].style.display = "none";
        contenu[j].classList.remove("actifContenu");

      }
    }
  });
});

