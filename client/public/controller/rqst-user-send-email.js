"use-strict";

const request = "https://archimed-gestion.com/";

class RequestEmailSent {
  _civilite;
  _nom;
  _email;
  _tel;
  _sujet;
  _message;

  constructor(civilite, nom, email, tel, sujet, message) {
    this._civilite = civilite;
    this._nom = nom;
    this._email = email;
    this._tel = tel;
    this._sujet = sujet;
    this._message = message;
  }

  async sendEmail() {
    try {
      const req = new Request(`${request}send-email`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `civilite=${encodeURIComponent(
          this._civilite
        )}&nom=${encodeURIComponent(this._nom)}&email=${encodeURIComponent(
          this._email
        )}&tel=${encodeURIComponent(this._tel)}&sujet=${encodeURIComponent(
          this._sujet
        )}&message=${encodeURIComponent(this._message)}`,
      });

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}

class RequestResetPassword {
  _userMail;

  constructor(email) {
    this._userMail = email;
  }

  async sendEmailRetriveEmail() {
    try {
      const req = new Request(`${request}retrive-password`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `email=${encodeURIComponent(this._userMail)}`,
      });

      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}

export { RequestEmailSent, RequestResetPassword };
