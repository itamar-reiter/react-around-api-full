import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card({ card, onCardClick, onCardDelete, onCardLike }) {
  const currentUserValue = useContext(CurrentUserContext);
  const handleImageClick = () => {
    onCardClick(card);
  };

  // Checking if the current user is the owner of the current card
  const isOwn = card.owner === currentUserValue._id;

  // Creating a variable which you'll then set in `className` for the delete button
  const cardGarbageButtonClassName = `element__garbage-button ${
    isOwn ? "element__garbage-button_active" : ""
  }`;

  // Check if the card was liked by the current user
  const isLiked = card.likes.some((userId) => userId === currentUserValue._id);

  // Create a variable which you then set in `className` for the like button
  const elementLikeButtonClassName = `element__like-button ${
    isLiked ? "element__like-button_active" : ""
  }`;

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleGarbageClick() {
    onCardDelete(card);
  }

  return (
      <div className="element">
        <button
          type="button"
          className={cardGarbageButtonClassName}
          onClick={handleGarbageClick}
        ></button>
        <img
          className="element__image"
          src={card.link}
          alt={card.name}
          onClick={handleImageClick}
        />
        <h2 className="element__name">{card.name}</h2>
        <button
          type="button"
          className={elementLikeButtonClassName}
          onClick={handleLikeClick}
        ></button>
        <p className="element__like-counter">{card.likes.length}</p>
      </div>
  );
}
