import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import { AuthContext } from "./Auth"


function Profile() {
    const { currentUser, userData } = useContext(AuthContext)

    const [ pic, setPic ] = useState("")

    const [ loadingPic, setLoadingPic ] = useState("true")

    const [ changeDName, setchangeDName ] = useState("")

    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

    const handleChangeDName =  (e) => {
        setchangeDName(e.target.value)
    }

    const submitNewName = async (e) => {
        e.preventDefault();
        
        // console.log(changeDName)

        try{

            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()
            // console.log(objDoc)

           const obj = {
               ...objDoc,
               displayName: changeDName
           }
            userRef.set(obj)

        } catch(err) {
            console.log(err)

        }
        setchangeDName('')
    }

    useEffect(() => {
    //   console.log(currentUser.email)
    //   console.log(pic)

      if(userData.role){
        storage.child(userData.role + "/" + currentUser.uid + "/ProfilePic.jpg")
        .getDownloadURL()
        .then((url) => {
            setPic(url)
        // This can be inserted into an <img> tag
      }).catch((err) => {
        console.log(err)
      });
    } 
      
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
            <h2>displayName: { userData? userData.displayName : null}</h2>
            <h2>email: { userData? userData.email : null}</h2>
            <h2>role: { userData? userData.role : null}</h2>
            <br/>

            <form onSubmit={(e) => submitNewName(e)}>
                <input type="text" value={changeDName} onChange={(e) => handleChangeDName(e)} placeholder="New Name" />
                <button className=" btn btn-success" type='submit'> Submit</button>

            </form>
            <button className="btn btn-danger" onClick={() => {app.auth().signOut()}}>Log Out</button>
        </div>
    )
}

export default Profile
