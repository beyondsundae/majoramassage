import React, { useState, useEffect, createContext } from 'react'
import app from "../Firebase/firebase"
import { firestore } from '../Firebase/firebase'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    
    const [ userData, setUserData ] = useState()

    const userRef = firestore.collection("users")

    useEffect(() => {
        app
        .auth()
        .onAuthStateChanged((user)=>{
            if(user){
                userRef.doc(user.uid)
                .onSnapshot((doc)=>{
                    if(doc.data()){
                        const userData = {
                            uid: doc.data().uid,
                            email: doc.data().email,
                            role: doc.data().role
                        }
                        setUserData(userData)
                    }
                })
            }
            setCurrentUser(user)
            setTimeout(() => {
                setLoading(false)
            }, 1000);
            
        })
    }, [loading])

    if(loading){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    Loading . . . (Auth)
                </h1>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ currentUser, userData }}>
            {children}
        </AuthContext.Provider>
        
    )
}


