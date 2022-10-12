import { apiData } from "./constants";

class Api {
  constructor(data) {
    this._baseUrl = data.baseUrl;
    this._headers = data.headers;
  }

  getInitialAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  _checkResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  };

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    })
      .then((res) => this._checkResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    })
      .then((res) => this._checkResponse(res));
  }

  saveProfileData(nameValue, aboutValue) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: nameValue,
        about: aboutValue,
      }),
    })
      .then((res) => this._checkResponse(res));
  }

  updateProfilePicture(avatarValue) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatarValue,
      }),
    })
      .then((res) => this._checkResponse(res));
  }

  saveNewCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    })
      .then((res) => this._checkResponse(res));
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then((res) => this._checkResponse(res));
  }

  putLike(cardId) {
    return fetch(
      `${this._baseUrl}/cards/likes/${cardId}`,
      {
        method: "PUT",
        headers: this._headers,
      }
    )
      .then((res) => this._checkResponse(res));
  }

  deleteLike(cardId) {
    return fetch(
      `${this._baseUrl}/cards/likes/${cardId}`,
      {
        method: "DELETE",
        headers: this._headers,
      }
    )
      .then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(cardId, likeStatus) {
    const callMethod = likeStatus
      ? this.putLike(cardId)
      : this.deleteLike(cardId);
    return callMethod;
  }
}

export default new Api(apiData);
