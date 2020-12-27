import React, { useState, useEffect, createContext } from 'react'
import app from "../Firebase/firebase"
import { firestore } from '../Firebase/firebase'

import { Modal, Button, message } from 'antd';

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
    const {width} = useWidth()

    const [ currentUser, setCurrentUser ] = useState(null)

    const [ loading, setLoading ] = useState(true)
    
    const [ userData, setUserData ] = useState()
    const [ allEmployees, setallEmployees ] = useState([])

    const userRef = firestore.collection("users")

    useEffect(async () => {
       await app
        .auth()
        .onAuthStateChanged( (user)=>{
            setCurrentUser(user)
            
            if(user){
               userRef.doc(user.uid)
                .onSnapshot((doc)=>{
                    if(doc.data()){
                        const objDoc = doc.data()
                        setUserData(objDoc)
                    }
                })
            }
            
            setTimeout(() => {
               setLoading(false)
            }, 900);
            
        })
    }, [loading])

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
        // console.group("fromResponse", currentUser)
        // console.log(allEmployees)
    }, [allEmployees])

    useEffect(() => {
        console.time(currentUser)
        console.timeEnd(currentUser)
    }, [currentUser])

    if(loading){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    <img 
                        src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/loading%2F78e826ca1b9351214dfdd5e47f7e2024.gif?alt=media&token=38b92308-51b2-4574-a027-227975ba44ac"
                        style={{width: width < 800? ("100%") : ("50%")}}
                        />
                </h1>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ width, currentUser, userData, allEmployees, Modal, message }}>
            {children}
        </AuthContext.Provider>
        
    )
}


const useWidth = () => {
    const [ width, setWidth ] = useState(window.innerWidth)

    const widthHandler =()=>{
        setWidth(window.innerWidth)
    }

    useEffect(()=>{
        window.addEventListener("resize", widthHandler)

        return()=>{
            window.removeEventListener("resize", widthHandler)
        }
    }, [])

    return { width };
}