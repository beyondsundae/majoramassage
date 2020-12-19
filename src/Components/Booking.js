import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import { Card, Button, Radio  } from "antd";
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import Header from "./Parts/Header"

import { AuthContext } from "./Auth"
import { Fragment } from 'react';

var _ = require('lodash');
function Booking() {
    const { currentUser, userData, Modal } = useContext(AuthContext)

    const { confirm } = Modal;

    const QueueOrdered = _.orderBy(userData.queue, ["Date", "Time"], ["asc", "asc"])

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
{/* ////////////////////// Modal Reject */}
    const onReject = (item) => {
        confirm({
            title: (<h4>ต้องการ{<h2 style={{color: "red", display: "inline"}}>ยกเลิก</h2>}รายการนี้ใช่หรือไม่</h4>),
            icon: (<ExclamationCircleTwoTone twoToneColor="red"/>),
            // content: 'Some descriptions',
            okText: 'ยกเลิก',
            okType: 'danger',
            width:'30%',
            cancelText: 'กลับไปก่อนหน้า',
           
            onOk() {
                setReject(item)
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

{/* ////////////////////// Reject Function */}
    const setReject = async (item) => {

        const userRef = firestore.collection("users").doc(userData.uid) //ใช้ uid เพื่ออิงถึง doc
        const chiropractorRef = firestore.collection("users").doc(item.ChiropactorKey) //ใช้ uid เพื่ออิงถึง doc

        try{
{/* //////////////////////  For Member */}    
            const getDocUser = await userRef.get()
            const objDocUser = await getDocUser.data()

            // เข้าถึง Queue เพื่อ Different queue ที่กดเลืือกออกไป
            let DifferentQueue = objDocUser.queue.filter(QueueOld => {
                return ![item].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Different : Return QueueOld ที่ไม่มี SelectedItem 

            // สร้าง queueเดิมที่ถูกตัดออก ใหม่โดยเปลี่ยน status to Reject
            let RejectObj = {}
            RejectObj = {
                ...item,
                // status: "Reject"
                status: "NotDone"
            }

            // นำมา union กันกับ queue ที่เหลือ
            let finalQueue = [...DifferentQueue, RejectObj]

            // ยัด finalQueue ลงไปใน Queue เพื่อรวมกับข้อมูลเก่าทั้งหมด 
            const objUser = {...objDocUser,
                queue:[ ...finalQueue
                ]}

            // set ขื้นไป 
            await userRef.set(objUser)

{/* //////////////////////  For Chiropactor */}    
            const getDocChiropactor = await chiropractorRef.get()
            const objDocChiropactor = await getDocChiropactor.data()

            let DifferentQueue2 = objDocChiropactor.queue.filter(QueueOld => {
                return ![item].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Different : Return QueueOld ที่ไม่มี SelectedItem 

            let RejectObj2 = {}
            RejectObj2 = {
                ...item,
                // status: "Reject"
                status: "NotDone"
            }
            
            let finalQueue2 = [...DifferentQueue2, RejectObj2]

            const objUser2 = {...objDocChiropactor,
                queue:[ ...finalQueue2
                ]}

           await chiropractorRef.set(objUser2)
            
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        // console.log(QueueOrdered)
    }, [])

    return (
        <div>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 row justify-content-center text-center border border-danger" style={Style.Content}>
                <div className="mt-5" style={{ width: "70%", height: "80vh", margin:"0px", overflow: "auto"}}>
                    {QueueOrdered.map((item, index) => {
                    return(
                        <Card
                            key={index}
                            type="inner"
                            className="mb-3"
                            title={
                            <div className="text-left mx-5">
                                <div className="row">
                                    <div className="col">
                                        <img src={item.ChiropactorPic} className="mx-5" style={{height: "150px"}} />
                                    </div>
                                    <div className="col pt-3">
                                        <div className="col-12  ">
                                            <h3>{item.name}</h3>
                                        </div>
                                        <div className="col-12 ">
                                            <h5>น้อง {item.ChiropactorName}</h5>
                                        </div>
                                    </div>
                                    <div className="col pt-3 text-right ">
                                        <div className="col-12  ">
                                            <h5>วันที่ {item.Date}</h5>
                                        </div>
                                        <div className="col-12">
                                            <h5>เวลา {item.Time}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            // extra={<a href="#">More</a>}
                        >
                            <div className="text-right">
                                <h3> ราคารวม: ฿{item.price}.00</h3>
                            </div>
                            <div className="text-right mt-5">
                                {item.status}
                                    <Button className="mr-3" type="primary" size="large" disabled={false} style={{background: "green"}}>
                                        ให้คะแนน
                                    </Button>
                                    <Button className="mr-3" type="primary" danger size="large" onClick={()=>onReject(item)} >
                                        ยกเลิก
                                    </Button>
                            </div>
                        
                        </Card>
                    )

                })}
                </div>
                
                
            </div>
        </div>
    )
}

export default Booking
