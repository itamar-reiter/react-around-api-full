import React, { useEffect, useState, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup({
  isPopupOpen,
  onClose,
  onUpdateUser,
}) {
  const currentUserValue = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAboutChange(e) {
    setAbout(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser(name, about);
  }

  useEffect(() => {
    setName(currentUserValue.name);
    setAbout(currentUserValue.about);
  }, [currentUserValue, isPopupOpen]);

  return (
    <PopupWithForm
      popupName="edit-profile"
      isPopupOpen={isPopupOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      popupTitle="Edit profile"
      submitButtonId="save-button"
      submitButtonText="Save"
    >
      <input
        className="popup__input popup__input_type_name"
        type="text"
        name="name"
        id="name"
        value={name || ''}
        onChange={handleNameChange}
        placeholder="Name"
        minLength="2"
        maxLength="40"
        required
      />
      <span className="popup__error-message popup__error-message_type_name"></span>
      <input
        className="popup__input popup__input_type_about-me"
        type="text"
        name="aboutMe"
        id="aboutMe"
        value={about || ''}
        onChange={handleAboutChange}
        placeholder="About me"
        minLength="2"
        maxLength="200"
        required
      />
      <span className="popup__error-message popup__error-message_type_aboutMe"></span>
    </PopupWithForm>
  );
}
