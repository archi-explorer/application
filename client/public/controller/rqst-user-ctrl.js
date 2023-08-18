"use-strict";

/**
 * Module de gestion de l'authentification de l'utilisateur
 */

const request = "https://archimed-gestion.com/";

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
      // console.log(req);

      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(
          this._login
        )}&psw=${encodeURIComponent(this._psw)}`,
      });
      // console.log(response);

      const data = await response.json();
      // console.log(data); // returns status, user, email, roleName, rid

      if (data.status && data.user && data.role && data.rid) {
        await fetch("https://archi-explorer.com/session-write", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: `user=${encodeURIComponent(
            data.user
          )}&uname=${encodeURIComponent(data.uname)}&role=${encodeURIComponent(
            data.role
          )}&email=${encodeURIComponent(data.email)}&rid=${encodeURIComponent(
            data.rid
          )}`,
        });

        // console.log(data.status);
        // console.log(data.user);
        // console.log(data.uname);
        return true;
      }
      return data;
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
      // console.log("deconnexion:" + req.method);

      const req_client = new Request(
        "https://archi-explorer.com/session-killed"
      );
      await fetch(req_client);

      window.location.assign("https://archi-explorer.com/login");
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

      // console.log(data);

      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestCreateUser {
  _login;
  _uname;
  _psw;
  _role;
  _email;

  constructor(login, uname, psw, role, email) {
    this._login = login;
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
        body: `login=${encodeURIComponent(
          this._login
        )}&uname=${encodeURIComponent(this._uname)}&psw=${encodeURIComponent(
          this._psw
        )}&role=${encodeURIComponent(this._role)}&email=${encodeURIComponent(
          this._email
        )}`,
      });
      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestDeleteUser {
  _login;

  constructor(login) {
    this._login = login;
  }

  async deleteUser() {
    try {
      const req = new Request(`${request}delete-user`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(this._login)}`,
      });
      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestUpdateUser {
  _login;
  _newName;
  _newRole;
  _newEmail;

  constructor(login, newName, newRole, newEmail) {
    this._login = login;
    this._newName = newName;
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
        body: `login=${encodeURIComponent(
          this._login
        )}&newName=${encodeURIComponent(
          this._newName
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

class RequestUpdateRoleById {
  _login;
  _newRole;

  constructor(login, newRole) {
    this._login = login;
    this._newRole = newRole;
  }

  async updateRoleById() {
    try {
      const req = new Request(`${request}update-user-role`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(
          this._login
        )}&newRole=${encodeURIComponent(this._newRole)}`,
      });
      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestUpdateEmail {
  _login;
  _newEmail;

  constructor(login, newEmail) {
    this._login = login;
    this._newEmail = newEmail;
  }

  async updateEmail() {
    try {
      const req = new Request(`${request}update-user-email`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(
          this._login
        )}&newEmail=${encodeURIComponent(this._newEmail)}`,
      });
      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class checkIfRoleIsAssigned {
  _role;

  constructor(role) {
    this._role = role;
  }

  async checkRole() {
    try {
      const req = new Request(`${request}check-user-role`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `role=${encodeURIComponent(this._role)}`,
      });
      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestUpdateUsername {
  _login;
  _newName;

  constructor(login, newName) {
    this._login = login;
    this._newName = newName;
  }

  async updateUsername() {
    try {
      const req = new Request(`${request}update-user-username`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(
          this._login
        )}&newName=${encodeURIComponent(this._newName)}`,
      });
      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class RequestUpdatePsw {
  _login;
  _newPsw;

  constructor(login, nPsw) {
    this._login = login;
    this._newPsw = nPsw;
  }

  async updatePsw() {
    console.log("start update");
    try {
      const req = new Request(`${request}update-psw`);
      console.log(this._login, this._newPsw);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `login=${encodeURIComponent(
          this._login
        )}&newPsw=${encodeURIComponent(this._newPsw)}`,
      });
      const data = await response.json();

      // console.log(data);
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
  RequestUpdateRoleById,
  checkIfRoleIsAssigned,
  RequestUpdateUsername,
  RequestUpdateEmail,
};
