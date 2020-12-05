import React, { useContext, useEffect, useState } from 'react'

import app from "../Firebase/firebase"
import { firestore } from '../Firebase/firebase'

import { AuthContext } from "./Auth"

function Home() {
    const { currentUser, userData } = useContext(AuthContext)

    const [ snapshot, setSnapshot ] = useState([])

    const Style = {
        Header: {
            height: "7vh"
        },
        preContent: {
            height: "30vh"
        },
        Content: {
            height: "62vh"
        }
    }

    useEffect(() => {
        // console.log(userData) 
        // console.log(currentUser)
        // console.log(snapshot)
    }, [snapshot])

    useEffect(() => {
        const getEmployees = firestore
        .collection("users")
        .where("role", "==", "employee")
        
        getEmployees.onSnapshot((snapshot) => {
           
            let tempArr = [] 
            snapshot.forEach((doc) => {
                // console.log(doc.data())
                tempArr = [
                    ...tempArr,
                    {
                        displayName: doc.data().displayName
                    }
                ]
            })
            setSnapshot(tempArr)
        })

        // return () => {
        //     getEmployees()
        // }
    }, [])
    
    return (
        <div>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <div className="row">


                    <div className="col align-self-end">
                        <h2 className="d-inline border border-danger ">
                            {currentUser? currentUser.email.substring(0, currentUser.email.lastIndexOf("@")): "ยังไม่ได้เข้าสู่ระบบ"}
                        </h2>
                    </div>

                    <div className="align-self-end">
                        <button className="mt-3 mr-3 btn btn-warning " >
                            <a href="#" className="text-dark" style={{textDecoration: "none"}}>
                                การจองของคุณ
                            </a>
                        </button>

                        <button className="mt-3 mr-3 btn btn-primary " >
                            <a href="/profile" className="text-dark" style={{textDecoration: "none"}}>
                                Profile
                            </a>
                        </button>
                    </div>
                    
                    <div className="align-self-end">
                        {currentUser? (
                            <button className="mt-3 btn btn-danger" onClick={() => {app.auth().signOut()}}>
                                Log Out
                            </button>
                        ) : (
                            <button className="mt-3 btn btn-info " >
                                <a href="/login" className="text-light" style={{textDecoration: "none"}}>
                                    Log In
                                </a>
                            </button>
                        )}
                    </div>
                    
                </div>
                    
            </div>
                
            

            <div className="container-fluid mt-1 border border-danger" style={Style.preContent}>
                xxxx
            </div>

            <div className="container-fluid mt-1 border border-danger" style={Style.Content}>
                xxxx

                {snapshot.map((item, index) => {
                    return(
                        <div className="card" key={index}> 
                            {item.displayName}
                        </div>
                    )

                })}
            </div>

        </div>

        // <div style={{textAlign: "center", marginTop: "150px"}}>
        //     <h1>Hi</h1>
        //     <h2>{currentUser? currentUser.email: "ยังไม่ได้เข้าสู่ระบบ"}</h2>
        //     <br/>

        //     {currentUser? (
        //         <button className="btn btn-danger" onClick={() => {app.auth().signOut()}}>Sign out</button>
        //     ) : (
        //         <button className="mt-3 btn btn-info " >
        //             <a href="/login" className="text-light" style={{textDecoration: "none"}}>
        //                 Login
        //             </a>
        //         </button>
        //     )}
            
        // </div>
    )
}

export default Home
