"use-strict";

const request = "http://archimed-gestion.com/";

class RequestEmailSent { // le email sera rempli cote serveur
    _civilite
    _nom
    _tel
    _sujet
    _message

    constructor(civilite, nom, tel, sujet, message) { 
        this._civilite = civilite;
        this._nom = nom;
        this._tel = tel;
        this._sujet = sujet;
        this._message = message;
    }

    async sendEmail() {
        try{
            const req = new Request(`${request}send-email`); //server url
            const response = await fetch(req, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                body: `civilite=${encodeURIComponent(this._civilite)}&nom=${encodeURIComponent(this._nom)}&tel=${encodeURIComponent(this._tel)}&sujet=${encodeURIComponent(this._sujet)}&message=${encodeURIComponent(this._message)}}`, 
            });

            // window.location.assign NON
            // ceci est fait dans contact.js
            
            const data = await response.json();
            console.log(data);
            return data;

        } catch(error) {
            console.log(error);
            return error.message;
        }
    }
}

export { RequestEmailSent };