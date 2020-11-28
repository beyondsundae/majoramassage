import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom"

import { AuthProvider } from "./Components/Auth"
import Home from "./Components/Home"
import Login from "./Components/Login"
import Register from "./Components/Register"
import LoggedinRoute from "./Components/LoggedinRoute"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <LoggedinRoute exact path="/" component={ Home } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/register" component={ Register } />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
