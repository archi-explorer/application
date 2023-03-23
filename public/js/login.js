"use-strict";

import * as AUTH from "../controller/rqst-user-ctrl";

const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const uname = document.querySelector("#uname").value;
  const psw = document.querySelector("#psw").value;

  authenticate(uname, psw);
});

//----------------------------------------------
// Fonction de mise vérification du mdp et du login
//----------------------------------------------

async function authenticate(uname, psw) {
  const auth = new AUTH.RequestAuth(uname, psw);
  const res = await auth.auth();
  console.log(res);
  if (res.exist && res.role === "admin") {
    console.log("admin");
    window.location.replace("http://archi-test.com/admin");
  } else if (res.exist && res.role != "admin") {
    console.log("diff admin");
    window.location.replace("http://archi-test.com/account");
  } else {
    alert("wrong password/login");
  }
}

//-----------------------------------------------
// Lien header
//-----------------------------------------------

const logo = document.querySelector(".logoContainer");

document.querySelector(".logoContainer").addEventListener("click", () => {
  console.log("clcki");
  window.location.replace("http://archi-test.com/welkome");
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
