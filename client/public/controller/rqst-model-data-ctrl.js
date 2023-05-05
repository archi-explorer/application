"use-strict";

/**
 * Module de gestion des requêtes à l'API NodeJs
 */

const request = "http://archi-test.com/";

// const modelName = getModelName();

class RequestAPI {
  _data;
  _coord;
  _pano;
  _names;
  _mName;

  _continu;

  constructor() {
    this._continu = false;
  }

  /**
   * Initialisation du init
   */
  async init() {
    this._data = await this.dataSetting();
    console.log(this._data);

    this._coord = initCoord(this._data);
    this._pano = initPano(this._data);
    this._names = initNames(this._data);
    this._mName = initMname(this._data);

    this._continu = true;
  }

  /**
   * Récupération des données pour l'application
   * @returns
   */
  async dataSetting() {
    try {
      const req = new Request(request);
      const response = await fetch(req);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return error.message;
    }
  }

  /**
   * Tout les getter des données
   */
  getCoord() {
    return this._coord;
  }
  getPano() {
    return this._pano;
  }
  getModelNames() {
    return this._names;
  }
  getMname() {
    return this._mName;
  }

  getContinu() {
    return this._continu;
  }
}

/**
 * Initialisation des coordonnées des panoramas si les données existes
 * @returns
 */
function initCoord(_data) {
  let list = {
    listStations: [],
    listX: [],
    listY: [],
    listZ: [],
    listXPrecedent: [],
    listYPrecedent: [],
    listZPrecedent: [],
    listXSuivant: [],
    listYSuivant: [],
    listZSuivant: [],
  };

  if (!_data.coord) {
    return null;
  }

  for (let i = 0; i < _data.coord.length; i++) {
    // Coordonnées des stations => attention l'application d'export des géomètre utilise pas le même repère que ThreeJs, Y et Z inversé
    list.listStations.push(_data.coord[i].Nom);
    list.listX.push(parseFloat(_data.coord[i].X));
    list.listY.push(parseFloat(_data.coord[i].Z));
    list.listZ.push(parseFloat(_data.coord[i].Y));
    list.listXPrecedent.push(parseFloat(_data.coord[i].X) * -1 - 5);
    list.listYPrecedent.push(parseFloat(_data.coord[i].Z) * 0);
    list.listZPrecedent.push(parseFloat(_data.coord[i].Y) * 0);
    list.listXSuivant.push(parseFloat(_data.coord[i].X) * -1 + 5);
    list.listYSuivant.push(parseFloat(_data.coord[i].Z) * 0);
    list.listZSuivant.push(parseFloat(_data.coord[i].Y) * 0);
  }

  return list;
}

/**
 * Initialisation de la liste des données des panoramas
 */
function initPano(_data) {
  if (!_data.pano) {
    return null;
  } else {
    return _data.pano;
  }
}

/**
 * Initialisation du nombres de modèle à afficher
 */
function initNames(_data) {
  if (!_data.modelNames) {
    return null;
  }

  return _data.modelNames;
}

function initMname(_data) {
  if (!_data.mName) {
    return null;
  }

  return _data.mName;
}

/**
 * Export des différents fonction de requête à l'API
 */
export { RequestAPI };
