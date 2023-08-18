"use-strict";

/**
 * Module d'initialisation du modèle à afficher
 */

const request = "https://archi-explorer.com/";

class RequestModelSet {
  _modelURL;
  _extension;

  constructor(extension, modelURL) {
    this._modelURL = modelURL;
    this._extension = extension;
  }

  async setModel() {
    try {
      const req = new Request(`${request}controller/set-model-viewer.php`);
      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `modelURL=${encodeURIComponent(this._modelURL)}`,
      });
      const data = await response.json();
      // console.log(data);

      if (this._extension == "fbx" || this._extension == "obj-mtl") {
        window.location.assign(`${request}model-viewer`);
      } else {
        console.log("ERROR : extension not found (in rqst-model-set-ctrl.js)");
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export { RequestModelSet };
