import React, { useContext, useEffect, useState } from 'react'

import app, { firestore } from "../Firebase/firebase"

import Header from "./Parts/Header"

import { AuthContext } from "./Auth"

function Information( {allEmployees} ) {
    
    const { currentUser, userData } = useContext(AuthContext)

    const Style = {
        Header: {
            height: "7vh"
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            minHeight: "92vh"
        }
    }

    return (
        <div>
          <div className="container-fluid text-right border border-danger " style={Style.Header}>
            <Header />
          </div>

          <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
              <div className="row">
                  <div className="col border border-danger" style={{height: "80vh"}}> 
                    {
                        allEmployees.urlPhoto ? (
                            <img src={allEmployees.urlPhoto} style={{maxWidth: "60%"}} />
                        ) : (
                            <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" />
                        )
                    }
                  </div>

                  <div className="col border border-danger">
                    <h1>น้อง { allEmployees? allEmployees.displayName : null}</h1>
                    <h2>อายุ: { allEmployees? allEmployees.age : null }</h2>
                    <h2>จำนวดผู้เข้ารับการนวด: { allEmployees? allEmployees.count : null}</h2>
                    <h2>⭐️: { allEmployees? allEmployees.star : null}</h2>
                    <h2>role: { allEmployees? allEmployees.role : null}</h2>
                  </div>
              </div>
                
                
                <br/>
            </div>
        </div>
    )
}

export default Information
