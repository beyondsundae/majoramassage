import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "./Auth"
import { firestore } from '../Firebase/firebase'

function Information( {allEmployees} ) {
    const { currentUser, userData } = useContext(AuthContext)
    return (
        <div>
            <h1>Data Firestore</h1>
            <h2>uid: { allEmployees? allEmployees.uid : null }</h2>
            <h2>displayName: { allEmployees? allEmployees.displayName : null}</h2>
            <h2>email: { allEmployees? allEmployees.email : null}</h2>
            <h2>role: { allEmployees? allEmployees.role : null}</h2>
            <br/>
        </div>
    )
}

export default Information
