import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../Auth";

const EmployeeRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser, userData} = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps => 
        !!currentUser ? ( 
          userData.role == "employee"? ( 
              <RouteComponent {...routeProps} /> 
            )
            : ( 
            <Redirect to={"/login"} /> 
          ))
        : ( 
        <Redirect to={"/login"} /> 
        )
      }
    />
  );
};


export default EmployeeRoute