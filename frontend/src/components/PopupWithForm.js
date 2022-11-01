import React from "react";

export default function PopupWithForm({
  popupName,
  isPopupOpen,
  onClose,
  onSubmit,
  popupTitle,
  submitButtonId,
  submitButtonText,
  children,
}) {

  const closePopupOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  const handleEscClose = (evt) => {
    if (evt.key === "Escape") {
      onClose();
    }
  };
  return (
    <div
      className={`popup popup_type_${popupName} ${isPopupOpen ? "popup_active" : ""
        }`}
      onClick={closePopupOverlay}
      onKeyDown={handleEscClose}
      tabIndex="0"
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-icon popup__close-icon_type_form"
          onClick={onClose}
        ></button>
        <h2 className="popup__title">{popupTitle}</h2>
        <form className="popup__form" onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            id={submitButtonId}
            className="popup__submit-button"
          >
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
}