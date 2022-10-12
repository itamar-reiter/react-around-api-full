import { Link } from "react-router-dom";

export default function SignForm({
  signFormTitle,
  signType,
  onSubmit,
  children,
  submitButtonId,
  submitButtonText,
  relativeAddress,
  linkText
}) {
  return (
    <div className="sign-form">
      <div className="sign-form__container">
        <h2 className="sign-form__title">{signFormTitle}</h2>
        <form className={`sign-form__content sign-form__content_type_${signType}`} onSubmit={onSubmit}>
          {children}
          <button
            type="submit"
            id={submitButtonId}
            className="sign-form__submit-button"
          >
            {submitButtonText}
          </button>
        </form>
        <Link to={relativeAddress} className="sign-form__link">
          <p>{linkText}</p>
        </Link>
      </div>
    </div>
  )
}