import { apiData } from "./constants";

class Api {
  constructor(data) {
    this._baseUrl = data.baseUrl;
  }

  getInitialAppInfo(token) {
    return Promise.all([this.getUserInfo(token), this.getInitialCards(token)]);
  }

  _checkResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  };

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => this._checkResponse(res));
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => this._checkResponse(res));
  }

  saveProfileData(nameValue, aboutValue, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: nameValue,
        about: aboutValue,
      }),
    })
      .then((res) => this._checkResponse(res));
  }

  updateProfilePicture(avatarValue, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        avatar: avatarValue,
      }),
    })
      .then((res) => this._checkResponse(res));
  }

  createCard(data, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    })
      .then((res) => this._checkResponse(res));
  }

  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => this._checkResponse(res));
  }

  putLike(cardId, token) {
    return fetch(
      `${this._baseUrl}/cards/${cardId}/likes`,
      {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    )
      .then((res) => this._checkResponse(res));
  }

  deleteLike(cardId, token) {
    return fetch(
      `${this._baseUrl}/cards/${cardId}/likes`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    )
      .then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(cardId, likeStatus, token) {
    const callMethod = likeStatus
      ? this.putLike(cardId, token)
      : this.deleteLike(cardId, token);
    return callMethod;
  }
}

export default new Api(apiData);
