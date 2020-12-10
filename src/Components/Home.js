import React, { useContext, useEffect, useState } from 'react'

import app, { firestore } from '../Firebase/firebase'

import Header from "./Parts/Header"

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
                <Header />
            </div>
                
            

            <div className="container-fluid mt-1 border border-danger" style={Style.preContent}>
                xxxx
            </div>

            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
                <div className="row text-center"> 
                {allEmployees.map((item, index) => {
                    return(
                        <a href={"/em/" + item.createed} key={index}>
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
