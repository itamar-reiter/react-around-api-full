import React from "react";
import { Link, Route } from "react-router-dom";

export default function Header({ email, onLogout }) {

  return (
    <header className="header">
      <div className="header__logo"></div>
      <div className="header__navbar">
        <Route exact path='/'>
          <p className="header__email">{email}</p>
          <Link to={'/signin'} onClick={onLogout} className='header__path header__path_type_dark'>Log out</Link>
        </Route>
        <Route path='/signup'>
          <Link to={'/signin'} className='header__path'>Log in</Link>
        </Route>
        <Route path='/signin'>
          <Link to={'/signup'} className='header__path'>Sign up</Link>
        </Route>
      </div>
    </header>
  );
}
