import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import { Card, Button, Radio  } from "antd";
import Header from "./Parts/Header"

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Booking() {

    const { currentUser, userData, Modal } = useContext(AuthContext)

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

    useEffect(() => {
        // console.log(QueueOrdered)
    }, [])

    // อาจจะ get firebase มาพร้อม ให้ where มาให้เเล้ว

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
                                    <Button className="mr-3" type="primary" shape="round" size="large" disabled={false} style={{background: "green"}}>
                                        ให้คะแนน
                                    </Button>
                                    <Button className="mr-3" type="primary" danger shape="round" size="large">
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
