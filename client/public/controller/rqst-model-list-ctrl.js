"use-strict";

const request = "http://archimed-gestion.com/";

class RequestModelList {
  // _modelUploader;
  // _panoUploader;
  // _csvUploader;

  constructor(modelBtn, modelList, panoBtn, panoList, csvBtn, csvList) {
    console.log(modelList, panoList, csvList);

    // this._modelUploader = this.initUploader(modelBtn, modelList);
    // this._panoUploader = this.initUploader(panoBtn, panoList);
    // this._csvUploader = this.initUploader(csvBtn, csvList);
  }

  async getModel() {
    try {
      console.log("on rentre dans le get model (rqst-model-list-ctrl.js)");
      const req = new Request(`${request}get-model`);
      const response = await fetch(req);
      const data = await response.json();
      console.log("resultat : (rqst-model-list-ctrl.js)" + data);
      return data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  // async addModel(city, role) {
  //   try {
  //     console.log("start upload");

  //     if (!this.verifFolderName()) {
  //       return false;
  //     }

  //     console.log("passed");

  //     console.log(this._modelUploader.files[0].name);

  //     try {
  //       await this.setFolder("model");
  //       this._modelUploader.start();

  //       await this.setFolder("panoramas");
  //       this._panoUploader.start();

  //       await this.setFolder("coord");
  //       this._csvUploader.start();
  //     } catch (error) {
  //       console.log(error.message);
  //       return false;
  //     }

  //     // Ajout au CSV de la liste
  //     const name = this._modelUploader.files[0].name.replace(/\.[^/.]+$/, "");

  //     const req = new Request(`${request}add-model`);
  //     const response = await fetch(req, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  //       },
  //       body: `city=${encodeURIComponent(city)}&mname=${encodeURIComponent(
  //         name
  //       )}&role=${encodeURIComponent(role)}`,
  //     });

  //     return true;
  //     // location.reload();
  //   } catch (error) {
  //     console.log(error.message);
  //     return false;
  //   }
  // }

  // initUploader(btn, list) {
  //   const uploader = new plupload.Uploader({
  //     runtimes: "html5",
  //     browse_button: btn,
  //     url: "https://archi-explorer.com/poc/serv/model_list/upload.php",
  //     chunk_size: "1mb",
  //     filters: {
  //       max_file_size: "1gb",
  //       mime_types: [{ title: "File", extensions: "zip" }],
  //     },
  //     init: {
  //       PostInit: () => {},
  //       FilesAdded: (up, files) => {
  //         plupload.each(files, (file) => {
  //           let row = document.createElement("div");
  //           row.id = file.id;
  //           row.innerHTML = `${file.name} (${plupload.formatSize(
  //             file.size
  //           )}) <strong></strong>`;
  //           list.appendChild(row);
  //         });
  //       },
  //       UploadProgress: (up, file) => {
  //         document.querySelector(
  //           `#${file.id} strong`
  //         ).innerHTML = `${file.percent}%`;
  //       },
  //       Error: (up, err) => {
  //         console.error(err);
  //       },
  //     },
  //   });

  //   uploader.init();

  //   return uploader;
  // }

  // verifFolderName() {
  //   const modelName = this._modelUploader.files[0].name.replace(
  //     /\.[^/.]+$/,
  //     ""
  //   );
  //   const panoName = this._panoUploader.files[0].name.replace(/\.[^/.]+$/, "");
  //   const csvName = this._csvUploader.files[0].name.replace(/\.[^/.]+$/, "");

  //   if (modelName == panoName && modelName == csvName) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // async setFolder(folder) {
  //   const req = new Request(`${request}set-folder`);
  //   const response = await fetch(req, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  //     },
  //     body: `folder=${folder}`,
  //   });
  // }
}

export { RequestModelList };
