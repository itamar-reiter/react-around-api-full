import { React, useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { useForm } from "../utils/useForm";

export default function AddPlacePopup({ isPopupOpen, onClose, onAddPlaceSubmit }) {

  /* const {values, handleChange, setValues} = useForm({}); */

  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlaceSubmit({ name: name, link: link });
    setName('');
    setLink('');
  }

  return (
    <PopupWithForm
      popupName="add-photo"
      isPopupOpen={isPopupOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      popupTitle="New place"
      submitButtonId="create-button"
      submitButtonText="Create"
    >
      <input
        className="popup__input popup__input_type_title"
        type="text"
        name="name"
        value={name || ""}
        onChange={handleNameChange}
        id="title"
        placeholder="Title"
        minLength="1"
        maxLength="30"
        required
      />
      <span className="popup__error-message popup__error-message_type_title"></span>
      <input
        className="popup__input popup__input_type_image-link"
        type="url"
        name="link"
        value={link || ""}
        onChange={handleLinkChange}
        id="link"
        placeholder="Image link"
        required
      />
      <span className="popup__error-message popup__error-message_type_link"></span>
    </PopupWithForm>
  );
}
