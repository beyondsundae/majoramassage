import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import { Table, Space, Divider } from "antd";
// import { difference, intersection } from 'lodash';

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

        //ติดตาม userData เพราะเวลาอัพเดทค่าจะได้มา trig useEffect นี้ทำงาน
    }, [userData])

    //แจกข้อมูลไป 2 ส่วน :อันดับสอง
    useEffect(() => {

        //Show AllList which not occur in IndividualList (เอาเฉพาะ AllList ที่ไม่มีใน IndividualList) (Different)
        let finalAll = allMassageLitsts.filter(All => {
            return !individiList.some(Indivi => Indivi.id === All.id)})
        // console.log("AllLeft", finalAll)

            setfinalAllMassageLitsts(finalAll)

        //Show IndividualList which not occur in AllList (เอาเฉพาะ IndividualList ที่มีใน AllList) (จริงๆไม่ได้มีก็ได้เพราะ แค่เอา List ของ พนักงานมาแสดง =____=) (Intersection)
        let finalIndivi = allMassageLitsts.filter(All => {
            return individiList.some(Indivi => Indivi.id === All.id)})
        // console.log("IndiviLeft", finalIndivi)

            setfinalIndividiList(finalIndivi)

    }, [allMassageLitsts])


    useEffect(() => {
        // console.log(finalAllMassageLitsts)
        // console.log(finalIndividiList)
    }, [finalAllMassageLitsts, finalIndividiList])

    const AddData = async ( Selected ) => {
        try{

            const userRef = firestore.collection("users").doc(userData.uid)
            
            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()
           

            let tempArr = []

            tempArr = [ ...finalIndividiList, Selected ] //ตบข้อมูลเก่ามา พร้อมยัดข้อมูลใหม่เข้าไปด้วย Put prevData and newData together 
            // console.log(tempArr)

            const obj = {
                ...objDoc,
                listMassage: tempArr
            }
            userRef.set(obj) 

        } catch (err) {
            console.log(err)
        }
    }

    const DeleteData = async ( Selected ) => {
        try{

            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()

           
            let finalDelete = finalIndividiList.filter(Indivi => {
                return ![Selected].some(SelectedList => SelectedList.id === Indivi.id)
            }) //Different : Return finalIndividiList ที่ไม่มี Selected 

            // let Diff = _.difference(finalIndividiList, [Selected]) // Lodash version

            const obj = {
                ...objDoc,
                listMassage: finalDelete
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
                                        <a style={{color: "red"}} onClick={() => { DeleteData(text)}}>ลบ</a>
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
