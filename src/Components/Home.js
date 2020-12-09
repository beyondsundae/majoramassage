import React, { useContext, useEffect, useState } from 'react'

import app, { firestore } from '../Firebase/firebase'

import { AuthContext } from "./Auth"

function Home() {
    const { currentUser, userData, allEmployees } = useContext(AuthContext)

    const Style = {
        Header: {
            height: "7vh"
        },
        preContent: {
            height: "30vh"
        },
        Content: {
            height: "62vh",
            
        }
    }

    useEffect(() => {
        // console.log("loggedInUser:", userData) 
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

            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
                <div className="row text-center"> 
                {allEmployees.map((item, index) => {
                    return(
                        <a href={item.createed} key={index}>
                             <div className="card mx-5 my-5 text-center" style={{width: "13rem"}} > 
                            {item.urlPhoto ? (
                                <img className="card-img-top" src={item.urlPhoto} />
                            ) : (
                                <img className="card-img-top" src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" />

                            )}
                            <div className="card-body">
                                <h5 className="card-title">น้อง{item.displayName}</h5>
                            </div>
                        </div>
                        </a>
                       
                    )

                })}
                 </div>   
            </div>
        </div>
    )
}

export default Home
