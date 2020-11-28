import React, { useState, useEffect, createContext } from 'react'
import app from "../Firebase/firebase"

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        app
        .auth()
        .onAuthStateChanged((user)=>{
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
                    Loading . . .
                </h1>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
        
    )
}


