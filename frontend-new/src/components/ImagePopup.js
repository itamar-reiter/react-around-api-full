export default function ImagePopup({ card, isPopupOpen, onClose }) {
  const cardLink = isPopupOpen ? card.link : "";
  const cardName = isPopupOpen ? card.name : "";
  const closePopupOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  const handleEscClose = (evt) => {
    console.log("escEvt pressed");
    if (evt.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      tabIndex="0"
      onKeyDown={handleEscClose}
      className={`popup popup_type_image ${isPopupOpen ? "popup_active" : ""}`}
      onClick={closePopupOverlay}
    >
      <div
        className="popup__background"
        style={{ backgroundImage: `url(${cardLink})` }}
      >
        <button
          type="button"
          id="closeImage"
          className="popup__close-icon popup__close-icon_type_image"
          onClick={onClose}
        ></button>
        <p className="popup__place-name">{cardName}</p>
      </div>
    </div>
  );
}
