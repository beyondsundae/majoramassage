import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom"

import { AuthProvider } from "./Components/Auth"
import Home from "./Components/Home"
import Profile from "./Components/Profile"
import Login from "./Components/Login"
import Register from "./Components/Register"
import LoggedinRoute from "./Components/LoggedinRoute"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <LoggedinRoute exact path="/" component={ Home } />
          <LoggedinRoute exact path="/profile" component={ Profile } />

          <Route exact path="/login" component={ Login } />
          <Route exact path="/register" component={ Register } />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
