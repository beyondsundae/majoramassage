import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import { AuthContext } from "./Auth"

function MassageList() {
    const { currentUser, userData, allEmployees } = useContext(AuthContext)

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


  useEffect(() => {
    const getAllMassageLists = firestore
    .collection("massageLists")
    .doc("allMassageLitsts")

    getAllMassageLists
    .onSnapshot((snapshot)=>{
        const rawData = snapshot.data()
        const finalData = rawData.listMassage

      // console.log(finalData)
     let tempArr = []
     finalData.forEach((doc)=>{
        tempArr = [ ...tempArr, doc]
      })
      console.log( tempArr ) 
    })
  }, [])


    return (
        <div>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>

            </div>
            
        </div>
    )
}

export default MassageList
