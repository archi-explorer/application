"use-strict";

const request = "https://archimed-gestion.com/";

class RequestModelList {
  _rid; // on cherche les modeles attribués à ce role id

  constructor(rid) {
    this._rid = rid;
  }

  async getModel() {
    try {
      // console.log("on rentre dans le get model (rqst-model-list-ctrl.js)");
      const allModels = await fetch(
        `${request}get-model?` +
          new URLSearchParams({
            rid: this._rid,
          })
      )
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          return error;
        });

      // console.log(
      //   "resultat : (rqst-model-list-ctrl.js)" + JSON.stringify(allModels)
      // );
      return allModels;
    } catch (error) {
      return [];
    }
  }

  async addModel(modelName, city, extension) {
    try {
      console.log("start upload");

      const req = new Request(`${request}add-model`);

      console.log("nom du model : " + modelName);

      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `city=${encodeURIComponent(city)}&mname=${encodeURIComponent(
          modelName
        )}&extension=${encodeURIComponent(extension)}`,
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

class RequestModelName {
  _mid;

  constructor(mid) {
    this._mid = mid;
  }

  async getModelName() {
    try {
      console.log("on rentre dans le get model name (rqst-model-list-ctrl.js)");
      const modelName = await fetch(
        `${request}get-model-name?` +
          new URLSearchParams({
            mid: this._mid,
          })
      )
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          return error;
        });

      return modelName;
    } catch (error) {
      return [];
    }
  }
}

class RequestDeleteModel {
  _mid;

  constructor(mid) {
    this._mid = mid;
  }

  async deleteModel() {
    try {
      console.log("on rentre dans le delete model (rqst-model-list-ctrl.js)");
      const req = new Request(`${request}delete-model`);
      //post request
      const deleteModel = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `mid=${encodeURIComponent(this._mid)}`,
      })
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          return error;
        });

      return deleteModel;
    } catch (error) {
      return [];
    }
  }
}

export { RequestModelList, RequestModelName, RequestDeleteModel };
