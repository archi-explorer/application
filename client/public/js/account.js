"use-strict";

import * as AUTH from "../controller/rqst-user-ctrl";

const signout = document.querySelector(".signout");

signout.addEventListener("click", () => {
  console.log("signout");
  const auth = new AUTH.RequestSignout();
  auth.signout();
});
