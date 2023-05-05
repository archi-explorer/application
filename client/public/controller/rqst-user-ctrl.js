"use-strict";

/**
 * Module de gestion de l'authentification de l'utilisateur
 */

const request = "http://archimed-gestion.com/";

class RequestAuth {
  _login;
  _psw;

  constructor(login, psw) {
    this._login = login;
    this._psw = psw;
  }

  async auth() {
    try {
      const req = new Request(`${request}authenticate`);
      console.log(req);

      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(
          this._login
        )}&psw=${encodeURIComponent(this._psw)}`,
      });
      console.log(response);

      const data = await response.json();
      console.log("data is (rqst-user-ctrl) : "+data);
      if (data.status && data.user && data.role) {
        await fetch("http://archimed-sky.com/session-write", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: `user=${encodeURIComponent(
            data.user
          )}&role=${encodeURIComponent(data.role)}&email=${encodeURIComponent(
            data.email
          )}`,
        });

        console.log(data.status);
        console.log(data.user);
        return true;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

class RequestSignout {
  constructor() {}

  async signout() {
    try {
      const req = new Request(`${request}signout`);
      await fetch(req);

      const req_client = new Request("http://archimed-sky.com/session-killed");
      await fetch(req_client);

      window.location.assign("http://archimed-sky.com/login");
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestgetUsers {
  constructor() {}

  async getUsers() {
    try {
      const req = new Request(`${request}get-users`);
      const response = await fetch(req);
      const data = await response.json();


      

      console.log(data);

      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestCreateUser {
  _uname;
  _psw;
  _role;
  _email;

  constructor(uname, psw, role, email) {
    this._uname = uname;
    this._psw = psw;
    this._role = role;
    this._email = email;
  }

  async createUser() {
    try {
      const req = new Request(`${request}add-user`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `uname=${encodeURIComponent(
          this._uname
        )}&psw=${encodeURIComponent(this._psw)}&role=${encodeURIComponent(
          this._role
        )}&email=${encodeURIComponent(this._email)}`,
      });
      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestDeleteUser {
  _uname;

  constructor(uname) {
    this._uname = uname;
  }

  async deleteUser() {
    try {
      const req = new Request(`${request}delete-user`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `uname=${encodeURIComponent(this._uname)}`,
      });
      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestUpdateUser {
  _mname;
  _newMname;
  _newRole;
  _newEmail;

  constructor(mname, newMname, newRole, newEmail) {
    this._mname = mname;
    this._newMname = newMname;
    this._newRole = newRole;
    this._newEmail = newEmail;
  }

  async updateUser() {
    try {
      const req = new Request(`${request}update-user`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `uname=${encodeURIComponent(
          this._mname
        )}&newUname=${encodeURIComponent(
          this._newMname
        )}&newRole=${encodeURIComponent(
          this._newRole
        )}&newEmail=${encodeURIComponent(this._newEmail)}`,
      });
      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {}
  }
}

class RequestUpdatePsw {
  _mname;
  _newPsw;

  constructor(mname, nPsw) {
    this._mname = mname;
    this._newPsw = nPsw;
  }

  async updatePsw() {
    console.log("start update");
    try {
      const req = new Request(`${request}update-psw`);
      console.log(this._mname, this._newPsw);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `uname=${encodeURIComponent(
          this._mname
        )}&newPsw=${encodeURIComponent(this._newPsw)}`,
      });
      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export {
  RequestAuth,
  RequestSignout,
  RequestCreateUser,
  RequestgetUsers,
  RequestDeleteUser,
  RequestUpdateUser,
  RequestUpdatePsw,
};
