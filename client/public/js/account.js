"use-strict";

import * as AUTH from "../request-controller/rqst-user-ctrl";

const signout = document.querySelector(".signout");
const model = document.querySelector(".modelLink");

signout.addEventListener("click", () => {
  console.log("signout");
  const auth = new AUTH.RequestSignout();
  auth.signout();
});

model.addEventListener("click", () => {
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
