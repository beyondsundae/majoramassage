import React, { useContext, useEffect } from 'react'
import app from "../Firebase/firebase"
import { AuthContext } from "./Auth"

function Profile() {
    const { currentUser, userData } = useContext(AuthContext)

    useEffect(() => {
      console.log(currentUser.email)
    }, [])
    
    return (
        <div style={{textAlign: "center", marginTop: "150px"}}>
            <h1>Profile</h1>
            <h2>{currentUser.email}</h2><br/>

            <h1>Data Firestore</h1>
            <h2>uid: { userData.uid }</h2>
            <h2>email: { userData.email }</h2>
            <br/>
            <button className="btn btn-danger" onClick={() => {app.auth().signOut()}}>Sign out</button>
        </div>
    )
}

export default Profile
