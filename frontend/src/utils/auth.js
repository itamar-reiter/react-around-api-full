import { authData } from "./constants";

class Auth {
  constructor(data) {
    this._serverAdress = data.serverAdress;
  }

  _checkResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  };

  register(email, password) {
    return fetch(`${this._serverAdress}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
      .then((res) => this._checkResponse(res))
      .then((res) => {
        return res;
      });
  }

  login(email, password) {
    return fetch(`${this._serverAdress}/signin`, {
      method: "POST", /* whyyyy? */
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
      .then((res) => this._checkResponse(res))
      .then((res) => {
        return res;
      });
  }

  checkToken = (token) => {
    return fetch(`${this._serverAdress}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => this._checkResponse(res))
      .then((res) => {
        return res;
      });
  }
}

export default new Auth(authData);