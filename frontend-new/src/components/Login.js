import { useState } from "react";

import SignForm from "./SignForm";

export default function Login({
  onLogin
}) {
  const onSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
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
      signFormTitle={"Log in"}
      signType={"log-in"}
      onSubmit={onSubmit}
      submitButtonId={"login"}
      submitButtonText={"Log in"}
      relativeAddress={"/signup"}
      linkText={"Not a member yet? Sign up here!"}>
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