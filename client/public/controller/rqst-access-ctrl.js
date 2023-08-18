"use-strict";

const request = "https://archimed-gestion.com/";

class RequestAddAccess {
  _mid;
  _rid;

  constructor(mid, rid) {
    this._mid = mid;
    this._rid = rid;
  }

  async addAccess() {
    try {
      const req = new Request(`${request}add-access`);
      console.log(req);

      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `mid=${encodeURIComponent(this._mid)}&rid=${encodeURIComponent(
          this._rid
        )}`,
      });

      console.log("fetch passed");

      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

class GetAllAccess {
  _mid;

  constructor(mid) {
    this._mid = mid;
  }

  async getAllAccess() {
    // console.log("start access");
    try {
      // console.log("start req access");
      const req = `${request}get-access`;
      const res = await fetch(
        req +
          "?" +
          new URLSearchParams({
            mid: this._mid,
          })
      );

      // console.log("fin req");
      const data = await res.json();

      // console.log(
      //   "ALL ACCESS FOR MODEL " + this._mid + " ARE : " + JSON.stringify(data)
      // );
      return data;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

class DeleteAccess {
  _mid;
  _rid;

  constructor(mid, rid) {
    this._mid = mid;
    this._rid = rid;
  }

  async deleteAccess() {
    try {
      const req = new Request(`${request}delete-access`);
      // console.log(req);

      const response = await fetch(req, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `mid=${encodeURIComponent(this._mid)}&rid=${encodeURIComponent(
          this._rid
        )}`,
      });
      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

export { RequestAddAccess, GetAllAccess, DeleteAccess };
