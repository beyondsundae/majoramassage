// © 2020 Copyright: NongNuabNaab.com 
// By beyondsundae (Thanakrit)

// May the knowledge and Intention be with those who work hard ❤️ 

import React,{ useState, useEffect} from 'react';
import './App.css';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { firestore } from './Firebase/firebase'

import { AuthProvider } from "./Components/Auth";

import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Forgotpassword from "./Components/Forgotpassword";
import Information from "./Components/Information";
import MassageList from './Components/MassageList'
import Booking from "./Components/Booking";
import LoggedinRoute from "./Components/Routes/LoggedinRoute";

import AdminRoute from "./Components/Routes/AdminRoute";
import AdminPage from "./Components/AdminPage";

import EmployeeRoute from './Components//Routes/EmployeeRoute';
const App = () => {
  const [ allEmployees, setAllEmployees ] = useState([])

  useEffect(() => {
    const getEmployees = firestore
    .collection("users")
    .where("role", "==", "employee")
    
    getEmployees
    .onSnapshot((snapshot) => {
        let tempArr = [] 
        snapshot.forEach((doc) => {
            // console.log(doc.data())
            tempArr = [ ...tempArr, doc.data() ]
            // get from collection must foreach before use them T__T remember remember
        })
        
        setAllEmployees(tempArr)
    })
  }, [])


  useEffect(() => {
    // console.log(allEmployees)
  }, [allEmployees])

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          
          <AdminRoute exact path="/admin" component={ AdminPage } />

          <LoggedinRoute exact path="/profile" component={ Profile } />
          <LoggedinRoute exact path="/booking" component={ Booking } />
          
          <EmployeeRoute exact path="/masssagelists" component={ MassageList } />
          <Route exact path="/" component={ Home } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/register" component={ Register } />
          <Route exact path="/forgot" component={ Forgotpassword } />


          {allEmployees.map((item, index) => {
            // console.log(item.createed)
           return <Route exact key={index} path={"/em/" + item.createed} render={() => <Information allEmployees={ item } />} />
          })}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
