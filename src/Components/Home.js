import React, { useContext, useEffect } from 'react'
import app from "../Firebase/firebase"
import { AuthContext } from "./Auth"

function Home() {
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
      console.log(currentUser.email)
    }, [])
    
    return (
        <div style={{textAlign: "center", marginTop: "150px"}}>
            <h1>Hi</h1>
            <h2>{currentUser.email}</h2>
            <br/>
            <button className="btn btn-danger" onClick={() => {app.auth().signOut()}}>Sign out</button>
        </div>
    )
}

export default Home
