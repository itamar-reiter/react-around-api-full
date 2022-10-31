import React from "react";
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ children, loggedIn, redirectedPath, ...props }) {
  return (
    <Route {...props}>
      {loggedIn ? children : <Redirect to={redirectedPath} />}
    </Route>
  )
}

export default ProtectedRoute;