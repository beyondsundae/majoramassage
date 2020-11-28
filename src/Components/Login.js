import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'
import app from "../Firebase/firebase"
import { AuthContext } from "./Auth"

const Login = () => {
    const { currentUser } = useContext(AuthContext)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault();
        
        try{
            await app
            .auth()
            .signInWithEmailAndPassword( email, password)
            
        }
        catch(error){
            alert(error)
        }
        
    }

    if( currentUser ){
        return <Redirect to="/" />
    }

    return (
        <div style={{textAlign: "center", marginTop: "150px"}}>
            <h1>Login</h1>

            <form onSubmit= {handleLogin}>
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

                <button className="mt-3 btn btn-primary" type="submit">Login</button>
               
            </form>
            <button className="mt-3 btn btn-info" >
                <a href="/register" style={{textDecoration: "none"}}>
                Register
                </a>
            </button>
        </div>
    )
}

export default Login
