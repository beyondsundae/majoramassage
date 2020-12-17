import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../Auth";

const LoggedinRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser} = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? ( 
            <RouteComponent {...routeProps} /> 
          ) 
          : ( 
          <Redirect to={"/login"} /> 
          )
      }
    />
  );
};


export default LoggedinRoute