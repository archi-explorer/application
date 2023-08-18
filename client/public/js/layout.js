//-----------------------------------------------
// Lien header
//-----------------------------------------------

document.querySelector(".logoContainer").addEventListener("click", () => {
  // console.log("header logo");
  location.assign("https://archi-explorer.com/welkome");
});

document.querySelector(".user").addEventListener("click", () => {
  // console.log("header login");
  location.assign("https://archi-explorer.com/account");
});

// Lien qui sera utilisé dès qu'on se login
if (document.querySelector(".modelLink") != null) {
  document.querySelector(".modelLink").addEventListener("click", () => {
    // console.log("header model");
    location.assign("https://archi-explorer.com/model-chooser");
  });
}

document.querySelector(".contact").addEventListener("click", () => {
  // console.log("header contact");
  location.assign("https://archi-explorer.com/contact");
});

//-----------------------------------------------
// Lien du footer
//-----------------------------------------------

/**
 * Lien vers FaceBook
 */
document.querySelector("#faceBook").addEventListener("click", () => {
  // console.log("fb");
  location.assign("https://www.facebook.com/ArchimedGe");
});

/**
 * Lien vers Insta
 */
document.querySelector("#instagram").addEventListener("click", () => {
  // console.log("insta");
  window.open("https://www.instagram.com/archimedge");
});

/**
 * Lien vers LinkedIn
 */
document.querySelector("#linkedIn").addEventListener("click", () => {
  // console.log("linkedIn");
  window.open("https://fr.linkedin.com/company/archimed-ge");
});

/**
 * Lien site groupe
 */
document.querySelector(".footerLeft").addEventListener("click", () => {
  // console.log("archimed");
  window.open("https://www.archimed-ge.com/");
});
