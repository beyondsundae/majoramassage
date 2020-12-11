import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import { AuthContext } from "./Auth"

function MassageList() {
    const { currentUser, userData } = useContext(AuthContext)

    const [ allMassageLitsts, setAllmassageLists ] = useState([])
    const [ individiList, setindividiList ] = useState([])

    const [ finalAllMassageLitsts, setfinalAllMassageLitsts ] = useState([])
    const [ finalIndividiList, setfinalIndividiList ] = useState([])

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

    //Get allMassageLists and Set currntUser List :อันดับแรก
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
        //   console.log( tempArr ) 

        setAllmassageLists(tempArr)
        
        })

        setindividiList(userData.listMassage)
    }, [])

    //แจกข้อมูลไป 2 ส่วน :อันดับสอง
    useEffect(() => {
        // console.log(allMassageLitsts)
        // console.log(individiList)

        let tempArr = []
        let tempArr2 = []

        //When employee have empty list
        setfinalAllMassageLitsts(allMassageLitsts) //When employee no list return all lists

        //When employee have list
        allMassageLitsts.forEach((e1)=>{individiList.forEach((e2)=>{
            if(e1.id === e2.id){
                // console.log("individual",e1) 
                tempArr2 = [ ...tempArr2, e1 ] //Return what employee list's have
                setfinalIndividiList(tempArr2)
            } 
            else if (e1.id !== e2.id) {
                tempArr = [ ...tempArr, e1 ] //Return what all list left 
                setfinalAllMassageLitsts(tempArr)
            }
        })})

    }, [allMassageLitsts])


    useEffect(() => {
        console.log(finalAllMassageLitsts)
        console.log(finalIndividiList)
    }, [finalAllMassageLitsts, finalIndividiList])




    return (
        <div>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>

                <div>
                    <h1>storeLists</h1>
                    {finalAllMassageLitsts.map((item)=>{
                        return(
                            <div key={item.id}>

                            <p>{item.id} {item.name} {item.price}</p>
                          
                            </div>
                        )                            
                    })
                    }

                    <br/>

                    <h1>individiList</h1>
                    {finalIndividiList.map((item)=>{
                        return(
                            <div key={item.id}>

                            <p>{item.id} {item.name} {item.price}</p>

                            </div>
                        )                            
                    })
                    }
                </div>
                

            </div>
            
        </div>
    )
}

export default MassageList
