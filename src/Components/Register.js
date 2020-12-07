import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'
import app  from "../Firebase/firebase"

import { AuthContext } from "./Auth"
import { firestore } from '../Firebase/firebase'

const Register = ( {history} ) => {
    const { currentUser } = useContext(AuthContext)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ loading, setLoading ] = useState(true)

    const [ role, setRole ] = useState(null)

    const handleRegister = async (event) => {
        event.preventDefault();

        if(role == null){
            alert(" plz select role")
        } else {
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
                            if( role == "member"){
                                await userRef.set({
                                    uid: result.user.uid,
                                    displayName: result.user.email
                                        .substring(0, email.lastIndexOf("@")),
                                    email: result.user.email,
                                    createed: new Date().valueOf(),
                                    role: role
                                })
                            setLoading(true)

                            } else if ( role == "employee"){
                                    await userRef.set({
                                        uid: result.user.uid,
                                        displayName: result.user.email
                                            .substring(0, email.lastIndexOf("@")),
                                        email: result.user.email,
                                        createed: new Date().valueOf(),
                                        role: role,
                                        age: 0,
                                        star: 0,
                                        listMassage:[],
                                        queue:[]
                                    })
                                setLoading(true)
                            }
                        }
                    }
                })
            } 
            catch(error) {
                console.log(error)
    
                if(error.code == "auth/email-already-in-use"){
                    setLoading(true)
    
                    setTimeout(() => {
                        setLoading(false)
                        alert(error.message) 
                        history.push("/")
                    }, 2000);
                    
                } else {
                    alert(error.message)
                }
            }
        } 
        
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [])

    useEffect(() => {
        console.log(role)

    }, [role])

    if( currentUser ){
        return <Redirect to="/" />
    }

    if(loading){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    <div className="spinner-border" role="status">
                    </div>

                    <div className="mt-5">Loading . . . . (Register)</div>
                </h1>
            </div>
        )
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

                <div className="form-check">
                <input className="form-check-input" type="radio" name="exampleRadios" id="member" value="member"  onClick={(e)=> setRole(e.target.value)}/>
                <label className="form-check-label" >
                   Register as member
                </label>
                </div>

                <div className="form-check">
                <input className="form-check-input" type="radio" name="exampleRadios" id="employee" value="employee" onClick={(e)=> setRole(e.target.value)}/>
                <label className="form-check-label" >
                   Register as employee
                </label>
                </div>

                <button className="mt-3 btn btn-primary" type="submit">Register</button>
                
            </form>

            <button className="mt-3 btn btn-info" >
                <a href="/login" className="text-light" style={{textDecoration: "none"}}>
                Login
                </a>
            </button>
            
        </div>
    )
}

export default Register
