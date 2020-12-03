import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'
import app from "../Firebase/firebase"
import { AuthContext } from "./Auth"

const Login = () => {
    const { currentUser } = useContext(AuthContext)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ loading, setLoading ] = useState(true)

    const handleLogin = async (event) => {
        event.preventDefault();
        
        try{
            await app
            .auth()
            .signInWithEmailAndPassword( email, password)
            .then()
            setLoading(true)

            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }
        catch(error){
            alert(error)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [])

    if( currentUser ){
        return <Redirect to="/" />
    }

    if ( loading ){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    <div className="spinner-border" role="status">
                    </div>

                    <div className="mt-5">Loading . . . . (Login)</div>
                </h1>
            </div>
        )
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
                <a href="/register" className="text-light" style={{textDecoration: "none"}}>
                Register 
                </a>
            </button>
        </div>
    )
}

export default Login
