import SignForm from "./SignForm";
import { React, useState } from "react";
export default function Register({ onRegister }) {

  const onSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <SignForm
      signFormTitle={"Sign up"}
      signType={"sign-up"}
      onSubmit={onSubmit}
      submitButtonId={"register"}
      submitButtonText={"Sign up"}
      relativeAddress={"/signin"}
      linkText={"Already a member? Log in here!"}>
      <input
        className="sign-form__input sign-form__input_type_email"
        type="email"
        name="email"
        value={email}
        onChange={handleEmailChange}
        id="email"
        placeholder="Email"
        minLength="1"
        maxLength="30"
        required
      />
      <span className="sign-form__error-message sign-form__error-message_type_email"></span>
      <input
        className="sign-form__input sign-form__input_type_password"
        type="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        id="password"
        placeholder="Password"
        required
      />
      <span className="sign-form__error-message sign-form__error-message_type_password"></span>
    </SignForm>
  )
}