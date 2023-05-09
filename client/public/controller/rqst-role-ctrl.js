"use-strict";

/**
 * Module de gestion de l'affichage des roles
 */

const request = "http://archimed-gestion.com/";

class RequestGetRoles {

  async getRoles() {
    try {
      const req = new Request(`${request}get-roles`);
      const response = await fetch(req);
      const data = await response.json();

      console.log(data);

      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestUpdateRole {
  _rid;
  _rname;

  constructor(rid, rname) {
    this._rid = rid;
    this._rname = rname;
  }

  async updateRole() {
    try {
      const req = new Request(`${request}update-role`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `rid=${encodeURIComponent(
          this._rid
        )}&new_rname=${encodeURIComponent(this._rname)}`,
      });
      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}


export {
  RequestGetRoles, RequestUpdateRole
};
