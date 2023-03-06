"use-strict";

/**
 * Module d'initialisation du modèle à afficher
 */

const request = "http://archi-test.com/";

class RequestModelSet {
  _model;

  constructor(model) {
    this._model = model;
  }

  async setModel() {
    try {
      const req = new Request(`${request}set-model`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `model=${encodeURIComponent(this._model)}`,
      });

      window.location.replace(
        "https://archi-explorer.com/poc/client/src/model_view.php"
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export { RequestModelSet };
