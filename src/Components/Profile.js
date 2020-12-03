import React, { useContext, useEffect, useState } from 'react'
import app from "../Firebase/firebase"
import { storage } from "../Firebase/firebase"
import { AuthContext } from "./Auth"


function Profile() {
    const { currentUser, userData } = useContext(AuthContext)

    const [ pic, setPic ] = useState("")

    const [ loadingPic, setLoadingPic ] = useState("true")

    const  getPic  =  storage.child("employee/" + currentUser.uid + "/ProfilePic.jpg")
        .getDownloadURL()
        .then((url) => {
            setPic(url)
        // This can be inserted into an <img> tag
      }).catch((err) => {
        console.log(err)
      });

    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

    useEffect(() => {
      console.log(currentUser.email)
      console.log(pic)
      
      tempPic()
    }, [])
    
    return (
        <div style={{textAlign: "center", marginTop: "150px"}}>
            {pic ? (
                loadingPic ? null : ( <img src={pic} style={{width: "20%"}} />) 
            )  
            : (
                loadingPic ? null : ( <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" style={{width: "10%"}}/> ) 
            )}
            {/* still have unset picture delay */}
            
            <h1>Profile</h1>
            <h2>{currentUser.email}</h2><br/>
            <button className="mt-3 btn btn-info" >
                <a href="/admin" className="text-light" style={{textDecoration: "none"}}>
                Admin 
                </a>
            </button>
            <h1>Data Firestore</h1>
            <h2>uid: { userData? userData.uid : null }</h2>
            <h2>displayName: { userData? currentUser.email.substring(0, currentUser.email.lastIndexOf("@")) : null}</h2>
            <h2>email: { userData? userData.email : null}</h2>
            <h2>role: { userData? userData.role : null}</h2>
            <br/>
            <button className="btn btn-danger" onClick={() => {app.auth().signOut()}}>Log Out</button>
        </div>
    )
}

export default Profile
