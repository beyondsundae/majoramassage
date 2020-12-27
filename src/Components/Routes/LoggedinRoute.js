import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../Auth";

const LoggedinRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser, userData} = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        currentUser ? ( 
            <RouteComponent {...routeProps} /> 
          ) 
          : ( 
          <Redirect to={"/login"} /> 
          // null
          )
      }
    />
  );
};
// I set delay 1 s to wait session If I no delay it always got null

export default LoggedinRoute