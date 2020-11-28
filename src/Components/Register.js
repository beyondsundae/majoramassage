import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'
import app  from "../Firebase/firebase"

import { AuthContext } from "./Auth"
import { firestore } from '../Firebase/firebase'

const Register = () => {
    const { currentUser } = useContext(AuthContext)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const handleRegister = async (event) => {
        event.preventDefault();
        
        try{
            await app
            .auth()
            .createUserWithEmailAndPassword( email, password)
            .then( async (result) => {
                if( result ){
                    const userRef = firestore.collection("users")
                    .doc(result.user.uid)

                    const doc = await userRef.get()
                    if(!doc.data()) {
                        await userRef.set({
                            uid: result.user.uid,
                            displayName: result.user.email.substring(0, email.lastIndexOf("@")),
                            email: result.user.email,
                            createed: new Date().valueOf(),
                            role: "user"
                        })
                    }   
                }
            })
            
        }
        catch(error){
            alert(error.message)
        }
        
    }

    if( currentUser ){
        return <Redirect to="/" />
    }

    return (
        <div style={{textAlign: "center", marginTop: "150px"}}>
            <h1>Register</h1>

            <form onSubmit= { handleRegister }>
                <label className="mt-5">
                    Email <br/>
                    <input 
                        required
                        type="email" 
                        placeholder="Email" 
                        onChange={(e)=>{setEmail(e.target.value)}} />
                </label><br/>

                <label className="mt-2">
                    Password <br/>
                    <input 
                        required
                        type="password" 
                        placeholder="Password" 
                        onChange={(e)=>{setPassword(e.target.value)}} />
                </label><br/>

                <button className="mt-3 btn btn-primary" type="submit">Register</button>
                
            </form>

            <button className="mt-3 btn btn-info" >
                <a href="/login" style={{textDecoration: "none"}}>
                Login
                </a>
            </button>
            
        </div>
    )
}

export default Register
