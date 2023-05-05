"use-strict";

import * as AUTH from "../controller/rqst-user-ctrl";
// import * as SESS from "../controller/rqst-session";

const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = document.querySelector("#login").value;
  const psw = document.querySelector("#psw").value;

  authenticate(login, psw);

  // callit();
});

// async function callit(){
//   const sessget = new SESS.RequestSESS();
//   const sessgetres = await sessget.sess();
//   console.log("\nsessget:"+sessgetres);
// }

//----------------------------------------------
// Fonction de mise vérification du mdp et du login
//----------------------------------------------

async function authenticate(login, psw) {
  const auth = new AUTH.RequestAuth(login, psw);
  const res = await auth.auth();

  if (res) {
    window.location.assign("http://archi-test.com/admin");
    console.log("location change");
  } else {
    alert("wrong password/login");
  }
}
