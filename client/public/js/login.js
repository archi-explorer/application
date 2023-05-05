"use-strict";

import * as AUTH from "../controller/rqst-user-ctrl";

const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = document.querySelector("#login").value;
  const psw = document.querySelector("#psw").value;

  authenticate(login, psw);

  // callit();
});


//----------------------------------------------
// Fonction de mise vérification du mdp et du login
//----------------------------------------------

async function authenticate(login, psw) {
  const auth = new AUTH.RequestAuth(login, psw);
  const res = await auth.auth();

  if (res) {
    window.location.assign("http://archimed-sky.com/admin");
    console.log("location change");
  } else {
    alert("wrong password/login");
  }
}
