import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../../Firebase/firebase"

import { AuthContext } from "../Auth"

function Header() {
    const { currentUser, userData, allEmployees } = useContext(AuthContext)

    return (
        <div className="row">
                    <div className="col align-self-end">
                            <h2 className="d-inline border border-danger ">
                                {userData? ("น้อง " + userData.displayName): "ยังไม่ได้เข้าสู่ระบบ"}
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
    )
}

export default Header
