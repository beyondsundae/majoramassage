import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom"

import { AuthProvider } from "./Components/Auth"
import Home from "./Components/Home"
import Profile from "./Components/Profile"
import Login from "./Components/Login"
import Register from "./Components/Register"
import LoggedinRoute from "./Components/LoggedinRoute"

import AdminRoute from "./Components/AdminRoute"
import AdminPage from "./Components/AdminPage"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          
          <AdminRoute exact path="/admin" component={ AdminPage } />

          <LoggedinRoute exact path="/profile" component={ Profile } />
          <Route exact path="/" component={ Home } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/register" component={ Register } />

          {/* <Route path="*" component={ Home } /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
