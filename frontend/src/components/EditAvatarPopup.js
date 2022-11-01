import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarInputRef = useRef(null);

  /* const handleAvatarchange = (e) => {
    avatarInputRef.current.value = e.value;
  } */

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar(avatarInputRef.current.value);
  }

  return (
    <PopupWithForm
      popupName="change-image"
      isPopupOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      popupTitle="Change profile picture"
      submitButtonId="saveImageChange"
      submitButtonText="Save"
    >
      <input
        className="popup__input popup__input_type_image-url"
        type="url"
        name="imageUrl"
        id="imageUrl"
        placeholder="picture link"
        ref={avatarInputRef}
        required
      />
      <span className="popup__error-message popup__error-message_type_imageUrl"></span>
    </PopupWithForm>
  );
}
