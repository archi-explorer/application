"use-strict";

import * as AUTH from "../controller/rqst-user-ctrl";
import { RequestResetPassword } from "../controller/rqst-user-send-email";

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

const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = document.querySelector("#login").value;
  const psw = document.querySelector("#psw").value;

  authenticate(login, psw);

  // callit();
});

/**
 * Récupération du mdp
 */

const retriveContainer = document.querySelector(".forgot-psw");
const emailValue = document.querySelector("#email");

document.querySelector("#forgot-psw").addEventListener("click", () => {
  // console.log("mdp oublié");
  retriveContainer.style.display = "flex";
});

window.addEventListener("click", (e) => {
  if (e.target == retriveContainer) {
    retriveContainer.style.display = "none";
    emailValue.value = "";
  }
});

document
  .querySelector(".form-retrive-psw")
  .addEventListener("submit", async (e) => {
    // console.log("sub");
    e.preventDefault();

    // Envoie du param du mail
    const email = emailValue.value;
    // console.log(email);
    const reqRetrivePsw = new RequestResetPassword(email);
    if (await reqRetrivePsw.sendEmailRetriveEmail()) {
      showPopUpError("", "Votre requête a bien été transmise");
    } else {
      showPopUpError(
        "Un problème est survenu",
        "Votre requête n'a aps été transmise"
      );
    }

    emailValue.value = "";
    retriveContainer.style.display = "none";
  });

//----------------------------------------------
// Fonction de mise vérification du mdp et du login
//----------------------------------------------

async function authenticate(login, psw) {
  const auth = new AUTH.RequestAuth(login, psw);
  const res = await auth.auth();

  if (res) {
    window.location.assign("https://archi-explorer.com/admin");
    // console.log("location change");
  } else {
    showPopUpError(
      "Une erreur est survenu",
      "Votre mot de passe ou nom d'uilisateur est érronné"
    );
  }
}
