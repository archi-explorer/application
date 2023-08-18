"use-strict";

import * as MODEL_LIST from "../controller/rqst-model-list-ctrl";
import * as AUTH from "../controller/rqst-user-ctrl";
import * as ROLE from "../controller/rqst-role-ctrl";
import * as ACCESS from "../controller/rqst-access-ctrl";

// GetFilesFromDataTransfer => permet de récupérer les fichiers d'un dossier
// printFiles => permet d'afficher les fichiers d'un dossier
// utilisés dans le drag and drop
import {
  GetFilesFromDataTransfer,
  printFiles,
} from "./admin-extras/drag-and-drop.js";

// ongletSetup => permet de gérer les onglets utilisateurs et roles
import { ongletSetup } from "./admin-extras/onglets.js";

// updateOK et updateKO => permettent d'afficher un pop up de mise à jour
import { updateOK, updateKO } from "./admin-extras/popup.js";

// addAllEvents => permet d'ajouter les évènements aux editableText
import { addAllEvents } from "./admin-extras/addAllEvents.js";

/**
 * Function d'affichage d'une pop-up
 */

const subtitleError = document.querySelector("#modal-subtitle-error");
const messageError = document.querySelector("#modal-message-error");

const modalPopUp = document.querySelector("#modal-overlay");
const btnCloseModal = document.querySelector("#close-modal");

// console.log(subtitle, message);

const showPopUpError = (subtitle, message) => {
  modalPopUp.style.display = "flex";

  subtitleError.innerHTML = subtitle;
  messageError.innerHTML = message;
};

const hidePopUp = () => {
  modalPopUp.style.display = "none";
};

btnCloseModal.addEventListener("click", hidePopUp);

modalPopUp.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    hidePopUp();
  }
});

/**********************************
 *
 * SETUP ACCESS
 *
 **********************************/
const overlay = document.querySelector("#overlay");
overlay.style.display = "none";

const accessContainer = document.querySelector(".add-access-container");
const accessUnorderedList = document.querySelector(".ul-role-access");
const selectRole = document.querySelector("#select-role");
const addAccessBtn = document.querySelector(".btn-add-new-access");

// interface pour ajouter un nouvel access
window.addEventListener("click", (e) => {
  if (e.target == accessContainer) {
    accessContainer.style.display = "none";

    accessUnorderedList.innerHTML = "";
  }
});

//ajoute un event au bouton d'ajout d'un nouvel access
addAccessBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (selectRole.value != "") {
    console.log(addAccessBtn.id, selectRole.value);
    const res = await addAccess(addAccessBtn.id, selectRole.value);

    if (!res) {
      showPopUpError(
        "Une erreur est survenu",
        "Erreur lors de l'ajout de l'accès"
      );
    } else {
      // showPopUpError("", "Accès ajouté");
      window.location.reload();
    }
  } else {
    accessContainer.style.display = "none";
    showPopUpError("Une erreur est survenu", "Veuillez choisir un rôle");
  }
});

/**********************************
 *
 * PARTIE "GERER LES MODELES ET ACCESS"
 *
 **********************************/

/**
 * Génération de l'interface
 */

const model = new MODEL_LIST.RequestModelList(
  "82173" //rid admin
);

/**
 * Génération de la liste des modèles
 */
const listModels = document.querySelector(".model-list-container-2");
const listModel = await model.getModel(); // element => [[mid, mname, mcity, ext], [mid, mname, mcity, ext], ...]

if (listModel[0] == "1") {
  // "1" => error
  showPopUpError("Une erreur est survenu", "Aucun modèle trouvé");
} else {
  // console.log(JSON.stringify(listModel));
  fillModelTable(listModel);
}

/**
 * Génération de la liste des roles
 * @param {Array} listModel
 */

// si on veut avoir les modèles toujours en ordre alphabétique, il faut attendre avec des promises
// je l'ai découvert trop tard, donc je laisse comme ça
async function fillModelTable(listModel) {
  await Promise.all(
    listModel.map(async (element) => {
      // console.log(element[0]);
      const roleListForOneModel = await fillRoleList(element[0]); // on recupere les roles pour chaque modele : [[rid, rname], [rid, rname], ...]
      // console.log(element[0], roleListForOneModel);

      // console.log(element[1]);
      var listElements = `<li id="container-${element[0]}" class="li-model-info">
      <p class="model-name" id=${element[0]}>${element[1]}</p>
      <p class="model-ext" id=${element[0]}>${element[3]}</p>
      <p contenteditable="true" class="model-city" id=${element[0]}>${element[2]}</p>`;

      var listButtons = `<div class="alter-bdd">
        <button class="modify-model-access" id="${element[0]}">Gérer les accès</button>
        <button class="delete-model" id="${element[0]}/${element[3]}">Supprimer</button>
      </div>
      </li>`;

      var listPermissions = `<div class="model-permissions" id=${element[0]}>`;

      // console.log(roleListForOneModel.length);
      if (roleListForOneModel.length > 1) {
        roleListForOneModel.forEach((access) => {
          if (access[0] != 82173)
            listPermissions += `<p id="${access[0]}">${access[1]}</p>`;
        });
      } else listPermissions += `<label>-</label>`;

      listPermissions += `</div>`;
      listModels.innerHTML += listElements + listPermissions + listButtons;
    })
  ).then(() => {
    const btnGererPermissions = document.querySelectorAll(
      ".modify-model-access"
    ); // .id => mid
    const btnDeleteModel = document.querySelectorAll(".delete-model"); // .id => mid

    btnGererPermissions.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let fillAccess = new Promise((resolve, reject) => {
          resolve(setupAddAccess(btn.id)); // on setup l'ajout, suppression et liste des access + reload page
        });
      });
    });

    btnDeleteModel.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        console.log("delete model");

        // DELETE ACCESS & FILES FOR THIS MODEL
        const delModel = new Promise((resolve, reject) => {
          resolve(deleteModelFiles(btn.id));
        }).catch((err) => {
          console.log(err);
        });
      });
    });
  });
}

/**
 * Génération de la liste des roles
 * @param {String} modelID/extension
 */
async function deleteModelFiles(midExt) {
  // param de la forme mid/ext
  const mid = midExt.split("/")[0];
  const ext = midExt.split("/")[1];

  // on a l'id du modele : on doit obtenir le nom, puis supprimer les fichiers
  const model = new MODEL_LIST.RequestModelName(mid);
  const mname = await model.getModelName();

  // on supprime le modele de la bdd
  const deleteModel = new MODEL_LIST.RequestDeleteModel(mid);
  const res = await deleteModel.deleteModel();

  // QUENTIN : ici voir discord

  if (!res) {
    showPopUpError(
      "Une erreur est survenu",
      "Le modèle n'a pas pu être retiré"
    );
    return "Erreur lors de la suppression du modèle (BDD)";
  }

  // on enleve les guillemets du nom du modele
  console.log("mname = " + mname["mname"]);
  const modelName = JSON.stringify(mname["mname"]).replace(/['"]+/g, "");

  // on divise le path en fbx et obj-mt
  let documentPath = "../models/" + ext + "/" + modelName; // declaration non vide

  // formData créé pour faire une requete sans headers
  const formData = new FormData();
  formData.append("path", documentPath);

  // on supprime les fichiers
  if (documentPath != "empty") {
    new Promise(async (resolve, reject) => {
      resolve(
        await fetch("../controller/delete-files.php", {
          method: "POST",
          body: formData,
        })
      );
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .then(() => {
        window.location.reload();
      });

    // ici on devrait faire une verification du retour
    // cependant, le return est etrange
    // donne JSON SyntaxError: Unexpected non-whitespace character at line 1 column 1 of the JSON data
  }
}

async function fillRoleList(mid) {
  // console.log(mid);

  const allAccessForThisMID = new ACCESS.GetAllAccess(mid);
  // console.log("crea role");
  const allAccess = await allAccessForThisMID.getAllAccess();
  // console.log("fin role");

  return allAccess;
}

async function deleteAccess(mid, rid) {
  const deleteAccess = new ACCESS.DeleteAccess(mid, rid);
  const res = await deleteAccess.deleteAccess();

  return res;
}

function setupAddAccess(mid) {
  selectRole.innerHTML = `<option disabled selected value=""> - choisir un rôle - </option>`; // setup du select
  addAccessBtn.setAttribute("id", mid); // on ajoute l'id du modele au bouton

  fillRoleList(mid)
    .then((value) => {
      // value = [[rid, rname], [rid, rname], ...]
      if (value != "82173") {
        value.forEach((access) => {
          if (access[0] != 82173)
            accessUnorderedList.innerHTML += `<li class="li-delete-access" id="${access[0]}">${access[1]}</li>`;
        });

        // comparaison de deux arrays d'arrays (rolesList et value)
        let missingRoles = rolesList.filter((role) => {
          return !value.some((access) => {
            return access[0] == role[0];
          });
        });

        // on ajoute les roles qui ne sont pas déjà attribués
        missingRoles.forEach((role) => {
          if (role[0] != "82173") {
            selectRole.innerHTML += `<option value="${role[0]}">${role[1]}</option>`;
          }
        });
      } else {
        rolesList.forEach((role) => {
          if (role[0] != "82173") {
            selectRole.innerHTML += `<option value="${role[0]}">${role[1]}</option>`;
          }
        });
      }
    })
    .then((value) => {
      const individualAccesses = document.querySelectorAll(".li-delete-access"); // .id => rid

      individualAccesses.forEach((access) => {
        // on selectionne tous les <li> des access individuels (déjà attribués) pour les supprimer
        access.addEventListener("click", (e) => {
          if (
            confirm(
              "Voulez-vous vraiment supprimer l'accès du rôle " +
                access.textContent +
                "?"
            )
          ) {
            deleteAccess(mid, access.id) // function async
              .then((value) => {
                if (!value)
                  showPopUpError(
                    "Une erreur est survenu",
                    "L'accès n'a pas pu être supprimé"
                  );
                else {
                  // showPopUpError("", "L'accès a été supprimé");
                  window.location.reload();
                }
              });
          }
        });
      });
    })
    .then((value) => {
      accessContainer.style.display = "flex"; // on affiche le container
    });
}

/*********************
 *
 * DRAG AND DROP & CHOOSE MODEL
 *
 *********************/

const addModel = document.querySelector(".add-model-container");
const dropArea = document.querySelector(".drag-area");
const input_browse = dropArea.querySelector("#file-browse"); // le bouton "parcourir"
const modelName = document.querySelector("#mname"); // message qui affiche le nom du doc déposé
let droppedFile; //fichier ou dossier qui sera déposé

// Fonction qui permet de rechercher un document depuis le button "browse"
input_browse.addEventListener("change", (e) => {
  droppedFile = e.target.files[0]; //obtient le document déposé
  dropArea.classList.add("active");
});

/**
 * Setup du drag and drop
 */
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log("drag over");
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
  console.log("drag leave");
  dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (e) => {
  dropArea.classList.remove("active");
  e.preventDefault();

  if (e.dataTransfer.files.length > 1) {
    showPopUpError(
      "Une erreur est survenu",
      "Vous ne pouvez ajouter qu'un seul modèle à la fois"
    );
    return;
  }

  droppedFile = e.dataTransfer.files[0]; //obtient le document déposé

  // la seule façon de savoir si c'est un dossier
  // c'est de regarder si le type est vide
  // et si le nom du fichier est égal à son extension === pas d'extension
  if (
    droppedFile.type == "" &&
    droppedFile.name.split(".").pop() == droppedFile.name
  ) {
    // fonction qui parcourt le dossier et qui récupère tous les fichiers
    GetFilesFromDataTransfer(e.dataTransfer, true, (files) => {
      if (files.length > 0) {
        printFiles(files);

        let dossiers = [];
        //Etape 1 : on récupère tous les dossiers
        Promise.all(
          files.map(
            async (file) => {
              let dossier = file.webkitRelativePath.substring(
                0,
                file.webkitRelativePath.lastIndexOf("/")
              ); // chemin relatif à la racine du dossier
              if (!dossiers.includes(dossier)) dossiers.push(dossier);
            }
            // Etape 2 : print
          )
        )
          .then((value) => {
            dossiers.forEach((dossier) => {
              console.log("dossier = " + dossier);
            });
          })
          // Etape 3 : on envoie la liste de fichiers et de dossiers à la fonction qui va les ajouter au serveur
          .then((value) => {
            modelName.textContent =
              "Votre modèle sera nommé : " + droppedFile.name;
            addModel.style.display = "flex";
            addOneOrManyFiles(files, dossiers);
          });
      } else {
        showPopUpError("Une erreur est survenu", "Le dossier est vide");
      }
    });
  } else {
    showPopUpError(
      "Une erreur est survenu",
      "S'il vous plaît, déposez un dossier contenant votre modèle"
    );
  }
});

/**
 * Formulaire d'ajout d'un modèle
 */

window.addEventListener("click", (e) => {
  if (e.target == addModel) {
    addModel.style.display = "none";
  }
});

function addOneOrManyFiles(files, dossiers) {
  const formAddModel = document.querySelector(".form-add-model");
  formAddModel.addEventListener("submit", (e) => {
    e.preventDefault();

    //const modelName établi avant
    const city = document.querySelector("#city");
    const extension = document.querySelector("#extension");

    if (extension.value != "" && city.value != "") {
      const modelID = formUpload(
        droppedFile.name,
        city.value,
        files,
        dossiers,
        extension.value
      );

      modelName.textContent = "";
      city.value = "";
      addModel.style.display = "none";
    } else if (extension.value == "" && city.value != "") {
      showPopUpError(
        "Une erreur est survenu",
        "S'il vous plaît, choisissez une extension"
      );
    } else if (extension.value != "" && city.value == "") {
      showPopUpError(
        "Une erreur est survenu",
        "S'il vous plaît, choisissez une ville"
      );
    } else {
      showPopUpError(
        "Une erreur est survenu",
        "S'il vous plaît, remplissez tous les champs"
      );
    }
  });
}

/**
 * Fonction qui permet de faire toutes les requêtes nécessaires pour ajouter un modèle
 * Déclenchée après avoir cliqué sur le bouton "Ajouter" du formulaire d'ajout d'un modèle
 * @param {*} modelName
 * @param {*} city
 * @param {*} files
 * @returns
 */
async function formUpload(modelName, city, files, dossiers, extension) {
  overlay.style.display = "block";
  //console.log("fileName after sending is : "+modelName);
  let isSmallEnough = true;

  //map through all files and check their size
  files.map((file) => {
    if (file.size > 60000000)
      // 60Mo
      isSmallEnough = false;
  });

  if (!isSmallEnough) {
    showPopUpError(
      "Une erreur est survenu",
      "Un/plusieurs fichiers dépassent les 60Mo. Veillez à les ajouter manuellement au serveur"
    );
    overlay.style.display = "none";
    window.location.reload(); //pour ne pas bugger
  } else {
    const uploadStatus = await model.addModel(modelName, city, extension); //ajoute le nom du modele, ville et type dans la bdd
    const accessStatus = await addAccess(uploadStatus, "1"); // ajoute l'access au modele pour l'admin (OBLIGATOIRE TOUJOURS)

    // si un ajout à la BDD n'a pas marché
    if (!uploadStatus || !accessStatus) {
      updateKO();
      window.location.reload(); //pour ne pas bugger
    } else {
      if (files != null) {
        // si l'array 'files' compte avec plusieurs files
        files.map((file) => {
          console.log(
            "file, we print its relative path : " + file.webkitRelativePath
          );
        });

        // 1e étape = creation de tous les dossiers
        Promise.all(
          dossiers.map(async (dossier) => {
            const sentDossier = await sendOneDossier(dossier, extension);
          })
        )
          // 2e etape : print
          .then((value) => {
            console.log("we finished adding the folders, value is empty ");
          })
          //3e etape = ajout de tous les fichiers au serveur
          .then((value) =>
            Promise.all(
              files.map((file) => {
                return new Promise(async (resolve, reject) => {
                  resolve(
                    await sendOneFile(file, file.webkitRelativePath, extension)
                  );

                  // quelque part ici il faut faire une verification
                  // si un fichier retourne [], ceci veut dire qu'il n'a pas été ajouté
                  // et alors on doit annuler l'ajout (break)
                  // puis passer par un delete des fichiers deja ajoutés (serveur) et des infos dans la bdd (ionos)

                  // point num 3 du TO DO LIST

                  // on peut changer ce que le fichier retourne dans "../controller/save-file.js"
                });
              })
            )
          )
          // 4e etape = message de fin
          .then(() =>
            console.log("we finished adding every single one of these files")
          )
          // 5e etape = reload de la page
          .then(() => {
            window.location.reload(); // on reload la page que si les fichiers ont bien été ajoutés
          });
      } else {
        showPopUpError(
          "Une erreur est survenu",
          "Le dossier est vide, veuillez ajouter des fichiers"
        );
        window.location.reload();
      }

      return uploadStatus;
    }
  }
}

async function sendOneDossier(dossierRelativePath, extension) {
  // reçoit un dossier de la forme "dossier", "dossier/sous-dossier", etc.
  const dossierFormData = new FormData();
  dossierFormData.append("dossier", dossierRelativePath);
  dossierFormData.append("many", "1"); // 1 = dossier
  dossierFormData.append("extension", extension);

  const saveDossier = await fetch("../controller/save-file.php", {
    method: "POST",
    body: dossierFormData,
  });

  const data = await saveDossier;
  return data;
}

/**
 * Fonction qui permet de récupérer les fichiers d'un dossier
 * @param {*} file
 * @param {*} url
 */
async function sendOneFile(file, relativePath, extension) {
  const fileFormData = new FormData();
  fileFormData.append("file", file);
  fileFormData.append("many", "2"); // 2 = fichier(s) dans un dossier
  fileFormData.append("relativePath", relativePath);
  fileFormData.append("extension", extension);

  const savefile = await fetch("../controller/save-file.php", {
    method: "POST",
    body: fileFormData,
  }).then((ans) => ans.json());

  console.log("url is : " + JSON.stringify(savefile));
}

async function addAccess(mid, rid) {
  const addedAccess = new ACCESS.RequestAddAccess(mid, rid);
  const accessStatus = await addedAccess.addAccess();

  return accessStatus;
}

/*********************************
 *
 * PARTIE UTLISATEURS (ET ROLES)
 *
 *********************************/

/**
 * Vue des utilisateurs && roles (MIXED BECAUSE OF DROPDOWN)
 */

// USERS
const users = new AUTH.RequestgetUsers();
const usersList = await users.getUsers();

//ROLES
const roles = new ROLE.RequestGetRoles();
const rolesList = await roles.getRoles();

//select dans form d'ajout d'un utilisateur, qui doit être rempli avec la meme requete que la table des roles
const roleForm = document.querySelector("#role-user");

if (usersList && rolesList) {
  const listUser = document.querySelector(".user-list-container");

  //0 => login, 1 => name, 2 => role, 3 => email
  usersList.forEach((user) => {
    //gotta check if [3]
    listUser.innerHTML += `<li id="container-${user[0]}" class="">
    <p>${user[0]}</p>
    <p contenteditable="true" class="user-username" id="${user[0]}">${
      user[1]
    }</p>
    
    <select class="user-role-select" id="${user[0]}">
    ${rolesList.map((role) => {
      if (role[1] == user[2])
        return `<option value="${role[0]}" selected="selected">${role[1]}</option>`;
      else return `<option value="${role[0]}">${role[1]}</option>`;
    })}
    </select>

    <p contenteditable="true" class="user-email" id="${user[0]}">${user[3]}</p>

    <div class="alter-bdd">
      <button class="modify-user" id="${user[0]}">Modifier le mdp</button>
      <button class="delete-user" id="${user[0]}">Supprimer</button>
    </div>
    </li>`;
  });

  const listRole = document.querySelector(".role-list-container");

  rolesList.forEach((role) => {
    //ne pas afficher admin, on ne veut pas l'éliminer
    if (role[0] != 1) {
      //ADMIN !!
      listRole.innerHTML += `<li id="container-${role[0]}" class="">
      <p contenteditable="true" class="role-rname" id="${role[0]}">${role[1]}</p>
      <div class="alter-bdd">
        <button class="delete-role" id="${role[0]}">Supprimer</button>
      </div>
    </li>`;
    }
  });

  rolesList.forEach((role) => {
    roleForm.innerHTML += `<option value="${role[0]}">${role[1]}</option>`;
  });
}

//select est rempli, maintenant on ajoute la requete qui changera dans la bdd la valeur du role
const roleSelectList = document.querySelectorAll(".user-role-select");

roleSelectList.forEach((element) => {
  const OGuserRole = element.value;
  element.addEventListener("change", (e) => {
    if (confirm("Voulez-vous vraiment changer le role de l'utilisateur ?")) {
      updateUserRoleById(element.id, element.value).then(() => {
        window.location.reload();
      });
    } else element.value = OGuserRole;
  });
});

async function updateUserRoleById(username, roleid) {
  const userRoleUpdate = new AUTH.RequestUpdateRoleById(username, roleid);
  const userRoleStatus = await userRoleUpdate.updateRoleById();

  if (!userRoleStatus) {
    // updateKO();
    showPopUpError(
      "Une erreur est survenu",
      "Le role de l'utilisateur n'a pas été modifié"
    );
  }
}

/**
 * Modification du nom d'un utilisateur
 */

const editUsernameList = document.querySelectorAll(".user-username");
var OGname;

editUsernameList.forEach((element) => {
  addAllEvents(element, "username");
});

export async function updateUsername(username, name) {
  const usernameUpdate = new AUTH.RequestUpdateUsername(username, name);
  const usernameStatus = await usernameUpdate.updateUsername();

  if (!usernameStatus) {
    // updateKO();
    showPopUpError(
      "Une erreur est survenu",
      "Le mot de nom de l'utilisateur n'a pas été modifié"
    );
  } else {
    window.location.reload();
    updateOK();
  }
}

/**
 * Modification d'un email d'un user
 */

const editEmailList = document.querySelectorAll(".user-email");
var OGemail;

editEmailList.forEach((element) => {
  addAllEvents(element, "email");
});

export async function updateEmailFromId(username, email) {
  const emailUpdate = new AUTH.RequestUpdateEmail(username, email);
  const emailStatus = await emailUpdate.updateEmail();

  if (!emailStatus) {
    // updateKO();
    showPopUpError("Une erreur est survenu", "Le mail n'a pas été changé");
  } else {
    window.location.reload();
    updateOK();
  }
}

/**
 * Changement du mot de passse
 */

const btnChangePsw = document.querySelectorAll(".modify-user");
const pswChangeContainer = document.querySelector(".change-psw-container");
const nPsw = document.querySelector("#update-psw");
const nPswConf = document.querySelector("#update-psw-conf");

const hideChangePsw = () => {
  pswChangeContainer.style.display = "none";
};

window.addEventListener("click", (e) => {
  if (e.target == pswChangeContainer) {
    hideChangePsw();

    nPsw.value = "";
    nPswConf.value = "";
  }
});

let currentUname;

btnChangePsw.forEach((element) => {
  element.addEventListener("click", () => {
    currentUname = element.id; //on récupère le login de l'utilisateur
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

  hideChangePsw();

  if (nPsw.value === nPswConf.value && nPsw.value != "") {
    formModifPsw(currentUname, nPsw.value);
  } else {
    showPopUpError(
      "Une erreur est survenu",
      "Aucun mot de passe n'a été renseigné"
    );
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
    // updateKO();
    showPopUpError(
      "Une erreur est survenu",
      "Le mot de passe n'a pas pu être modifier"
    );
  }
}

/**
 * Suppression d'un utilisateur
 */

const confDelUser = false;

const deleteUser = document.querySelectorAll(".delete-user");

deleteUser.forEach((element) => {
  element.addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment supprimer l'utilisateur ?"))
      formDeleteUser(element.id);
  });
});

async function formDeleteUser(id) {
  const del = new AUTH.RequestDeleteUser(id);
  const statDel = await del.deleteUser();

  // console.log(statDel);

  if (statDel) {
    location.reload();
    updateOK();
  } else {
    // updateKO();
    showPopUpError(
      "Une erreur est survenu",
      "L'utilisateur n'a pas été supprimé"
    );
  }
}

/**
 * Comportement formulaire ajout utilisateur
 */

const btnAddUser = document.querySelector(".add-user");
const addUser = document.querySelector(".add-user-container");

btnAddUser.addEventListener("click", () => {
  // console.log("ajout utilisateur");
  addUser.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target == addUser) {
    hideAddUser();
  }
});

const hideAddUser = () => {
  addUser.style.display = "none";
};

/**
 * Formulaire d'ajout d'un nouvel utilisateur
 */

const formAddUser = document.querySelector(".form-add-user");
formAddUser.addEventListener("submit", (e) => {
  e.preventDefault();

  formAddUserSubmit();
});

async function formAddUserSubmit() {
  const login = document.querySelector("#login");
  const uname = document.querySelector("#uname");
  const psw = document.querySelector("#psw");
  const pswConfirmation = document.querySelector("#psw-confirmation");
  const email = document.querySelector("#email");

  //verifie que les champs ne sont pas vides
  if (
    login.value != "" &&
    uname.value != "" &&
    psw.value != "" &&
    pswConfirmation.value != "" &&
    email.value != ""
  ) {
    if (psw.value === pswConfirmation.value) {
      hideAddUser();

      const newUser = new AUTH.RequestCreateUser(
        login.value,
        uname.value,
        psw.value,
        roleForm.value,
        email.value
      );
      const state = await newUser.createUser();

      login.value = "";
      uname.value = "";
      psw.value = "";
      pswConfirmation.value = "";
      roleForm.value = "";
      email.value = "";

      if (state) {
        location.reload();
      } else {
        // updateKO();
        hideAddUser();

        showPopUpError(
          "Une erreur est survenu",
          "Aucun utilisateur n'a été ajouté"
        );
      }
    } else {
      hideAddUser();

      showPopUpError(
        "Une erreur est survenu",
        "Veuillez renseigner le même mot de passe"
      );
    }
  } else {
    hideAddUser();

    showPopUpError(
      "Une erreur est survenu",
      "Veuillez renseigner tous les champs"
    );
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
  // console.log("ajout role");
  addRole.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target == addRole) {
    hideRole();
  }
});

const hideRole = () => {
  addRole.style.display = "none";
};

/**
 * Formulaire d'ajout d'un nouveau role
 */

const formAddRole = document.querySelector(".form-add-role");
formAddRole.addEventListener("submit", (e) => {
  e.preventDefault();

  hideRole();

  formAddRoleSubmit().then(() => {
    window.location.reload();
  });
});

async function formAddRoleSubmit() {
  const rname = document.querySelector("#role-name");

  if (rname !== "") {
    const newRole = new ROLE.RequestCreateRole(rname.value);
    const state = await newRole.createRole();
  }

  rname.value = "";

  if (state) {
    updateOK();
  } else {
    // updateKO();
    showPopUpError("Une erreur est survenu", "Le rôle n'a pas été ajouté");
  }
}

/**
 * Modifications d'un role (role name dans la table role)
 */

const editRNameList = document.querySelectorAll(".role-rname");
var OGcontent;

editRNameList.forEach((element) => {
  addAllEvents(element, "role-rname");
});

export async function updateRoleName(roleid, rname) {
  const roleUpdate = new ROLE.RequestUpdateRole(roleid, rname);
  const roleStatus = await roleUpdate.updateRole();

  if (!roleStatus) {
    // updateKO();
    showPopUpError(
      "Une erreur est survenu",
      "Le nom du role n'a pas été modifier"
    );
  } else {
    window.location.reload();
    updateOK();
  }
}

/**
 * Suppression d'un role
 */

const btnDelRole = document.querySelectorAll(".delete-role");

btnDelRole.forEach((element) => {
  element.addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment supprimer le role ?")) {
      formDeleteRole(element.id).then(() => {
        window.location.reload();
      });
    }
  });
});

async function formDeleteRole(rid) {
  const check = new AUTH.checkIfRoleIsAssigned(rid);
  const statCheck = await check.checkRole();

  //if role is not assigned
  if (!statCheck) {
    const del = new ROLE.RequestDeleteRole(rid);
    const statDel = await del.deleteRole();

    if (statDel) {
      updateOK();
    } else {
      // updateKO();
      showPopUpError("Une erreur est survenu", "Le rôle n'a pas été supprimé");
    }
  } else {
    showPopUpError(
      "Une erreur est survenu",
      "Ce role est encore assigné à un utilisateur"
    );
  }
}

/*
 * Signout
 */

const signout = document.querySelector(".signout");
// console.log(signout);
signout.addEventListener("click", () => {
  // console.log("signout");
  const auth = new AUTH.RequestSignout();
  auth.signout();
});

/*
 * ONGLETS
 */

const onglets = document.querySelectorAll(".onglets");
const contenu = document.querySelectorAll(".contenu");

ongletSetup(onglets, contenu);
