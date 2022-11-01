import React, { useContext } from "react";
import Card from "./Card";
import penAnimation from "../images/profile-image-pen-cover.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Main({
  onUserImageClick,
  onEditProfileClick,
  onAddCardClick,
  cards,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUserValue = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div
          className="user-image"
          onClick={onUserImageClick}
          style={{ backgroundImage: `url(${currentUserValue.avatar})` }}
        >
          <div className="user-image__hover-mode">
            <img
              className="user-image__pen-animation"
              src={penAnimation}
              alt="pen animation"
            />
          </div>
        </div>
        <h1 className="profile__name">{currentUserValue.name}</h1>
        <button
          type="button"
          id="editButton"
          className="profile__edit-button"
          onClick={onEditProfileClick}
        ></button>
        <p className="profile__about-me">{currentUserValue.about}</p>
        <button
          type="button"
          id="addButton"
          className="profile__add-button"
          onClick={onAddCardClick}
        ></button>
      </section>
      <section className="grid-elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}
