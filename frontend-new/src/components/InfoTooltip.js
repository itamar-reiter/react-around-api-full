import React from "react";

export default function InfoTooltip({
  popupName,
  isPopupOpen,
  onClose,
  markType,
  popupSubtitles
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
        <div className={`popup__mark popup__mark_type_${markType}`}></div>
        <p className="popup__subtitles">{popupSubtitles}</p>
      </div>
    </div>
  );
}
