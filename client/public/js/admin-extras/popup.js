"use-strict";

/**
 * Pop up d'état de la mise à jour
 */

export function updateOK() {
  const popUp = document.querySelector(".update-ok");
  // console.log(popUp);
  popUp.style.display = "flex";
  setTimeout(() => {
    popUp.style.display = "none";
  }, 5000);
}

export function updateKO() {
  const popUp = document.querySelector(".update-ko");
  // console.log(popUp);
  popUp.style.display = "flex";
  setTimeout(() => {
    popUp.style.display = "none";
  }, 5000);
}
