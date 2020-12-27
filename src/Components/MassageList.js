import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"
import Footer from "./Parts/Footer"

import { Table, Space, Divider } from "antd";
// import { difference, intersection } from 'lodash';



import { AuthContext } from "./Auth"

function MassageList() {
    const { width, currentUser, userData, message } = useContext(AuthContext)

    const { Column, ColumnGroup } = Table;

    const [ allMassageLitsts, setAllmassageLists ] = useState([])
    const [ individiList, setindividiList ] = useState([])

    const [ finalAllMassageLitsts, setfinalAllMassageLitsts ] = useState([])
    const [ finalIndividiList, setfinalIndividiList ] = useState([])

    const Style = {
        Header: {
            height: width < 500 ? "25vh" : "8vh",
            background: '#444B54'
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            height: width < 500 ? "62vh" : "61vh",
            padding: "0px"
        }
    }

    const msgError = (err) => {
        message.error({
            content: (<h5 className="mt-5">{err}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
            }})
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
            msgError(err)
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
            msgError(err)
        }
    }

    return (
        <div>
            <div className="container-fluid text-right" style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center" style={Style.Content}>
                <div className="row justify-content-center ">
                    <div style={{width: width < 500 ? "80%" : "50%"}}>

                    <h2>ลิสต์การนวดในคลัง</h2>

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
                    <div style={{width: width < 500 ? "80%" : "50%"}}>

                    <h2>ลิสต์การนวดของคุณ</h2>

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
            
            <Footer/>
        </div>
    )
}

export default MassageList
