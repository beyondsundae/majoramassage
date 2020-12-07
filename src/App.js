import React,{ useState, useEffect, useContext} from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { firestore } from './Firebase/firebase'

import { AuthProvider } from "./Components/Auth";

import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Information from "./Components/Information";
import LoggedinRoute from "./Components/LoggedinRoute";

import AdminRoute from "./Components/AdminRoute";
import AdminPage from "./Components/AdminPage";

const App = () => {
  const [ allEmployees, setallEmployees ] = useState([])

  useEffect(() => {
    const getEmployees = firestore
    .collection("users")
    .where("role", "==", "employee")
    
    getEmployees.onSnapshot((snapshot) => {
        let tempArr = [] 
        snapshot.forEach((doc) => {
            // console.log(doc.data())
            tempArr = [ ...tempArr, doc.data() ]
            // get from collection must foreach before use them T__T remember remember
        })
        
        setallEmployees(tempArr)
    })

   
  }, [])

  useEffect(() => {
    console.log(allEmployees)
  }, [allEmployees])

  return (
    <AuthProvider>
      <Router>
        <div>
          
          <AdminRoute exact path="/admin" component={ AdminPage } />

          <LoggedinRoute exact path="/profile" component={ Profile } />
          <Route exact path="/" component={ Home } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/register" component={ Register } />

          {allEmployees.map((item, index) => {
            // console.log(item.createed)
            
           return <Route exact key={index} path={"/" + item.createed} render={() => <Information allEmployees={ item } />} />
          })}
          

          {/* <Route path="*" component={ Home } /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
