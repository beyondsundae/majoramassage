import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import { Table, Space, Divider } from "antd";

import Header from "./Parts/Header"

import { AuthContext } from "./Auth"

function MassageList() {
    const { currentUser, userData } = useContext(AuthContext)
    const { Column, ColumnGroup } = Table;

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
            
        })})

    }, [allMassageLitsts])

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
            
            if (e1.id !== e2.id) {
                tempArr = [ ...tempArr, e1 ] //Return what all list left 
                setfinalAllMassageLitsts(tempArr)
                console.log("AllLeft", tempArr)
            }
        })})

    }, [allMassageLitsts])

    useEffect(() => {
        console.log(finalAllMassageLitsts)
        console.log(finalIndividiList)
    }, [finalAllMassageLitsts, finalIndividiList])

    const AddData = async ( text ) => {
        try{

            const userRef = firestore.collection("users").doc(userData.uid)
            
            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()
           

            let tempArr = []

            tempArr = [ ...finalIndividiList, text ]
            console.log(tempArr)

            const obj = {
                ...objDoc,
                listMassage: tempArr
            }
            userRef.set(obj)

        } catch (err) {
            console.log(err)
        }
    }

   

    return (
        <div>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center  border border-danger" style={Style.Content}>

                <div className="" >
                    <div className="row justify-content-center ">
                        <div style={{width: "50%"}}>

                        <h1>storeLists</h1>

                        <Table dataSource={finalAllMassageLitsts}  pagination={false} rowKey="id" >
                            <Column title="id" dataIndex="id" key="id" />
                            <Column title="name" dataIndex="name" />
                            <Column title="price" dataIndex="price"  />
                            <Column
                            title="Action"
                            key="action"
                            render={(text, record, index) => (
                                <Space size="middle">
                                    <a style={{color: "green"}} onClick={() => { AddData(text) }}>เพิ่ม</a>
                                </Space>
                            )}
                            />
                        </Table>
                        </div>
                        
                    </div>
                    

                    <Divider />

                    <div className="row justify-content-center ">
                        <div style={{width: "50%"}}>

                        <h1>individiList</h1>

                            <Table dataSource={finalIndividiList} pagination={false} rowKey="id" >
                                <Column title="id" dataIndex="id" key="id" />
                                <Column title="name" dataIndex="name" />
                                <Column title="price" dataIndex="price"  />
                                <Column
                                title="Action"
                                key="action"
                                render={(text, record) => (
                                    <Space size="middle">
                                        <a style={{color: "red"}} onClick={() => { console.log()}}>ลบ</a>
                                    </Space>
                                )}
                                />
                            </Table>
                        </div>
                    </div>

                </div>
                

            </div>
            
        </div>
    )
}

export default MassageList
