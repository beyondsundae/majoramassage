import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import { Card, Button, Tabs, Empty, Divider } from "antd";
import { ExclamationCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";

import Header from "./Parts/Header"

import { AuthContext } from "./Auth"
import { Stars } from '@material-ui/icons';

var _ = require('lodash');
function Booking() {
    const { currentUser, userData, Modal } = useContext(AuthContext)

    const [ page, setPage ] = useState("1")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ info, setInfo ] = useState("")

    const [value, setValue] = React.useState({
        Review:{
            Comment: "",
            Reviewer: "",
                Stars: {
                    BodyShape: 0,
                    BodySkin: 0,
                    Cuteness: 0,
                    Friendly: 0,
                    Massage: 0,
                },
            totalStar: null
        }
    });

    const { confirm } = Modal;
    const { TabPane } = Tabs;

    const Reject = "Reject"
    const Done = "Done"

    const QueueOrdered = _.orderBy(userData.queue, ["Date", "Time"], ["asc", "asc"])

    const FilterByNotDone = _.filter(QueueOrdered, ['status', "NotDone"]);
    const FilterByReject = _.filter(QueueOrdered, ['status', "Reject"]);
    const FilterByDone = _.filter(QueueOrdered, ['status', "Done"]);


    const Style = {
        Header: {
            height: "7vh"
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            minHeight: "92vh"
        },
        CardOverflow: {
            width: "100%", 
            height: "80vh", 
            margin:"0px", 
            overflow: "auto"
        }
    }
    const StyledRating = withStyles({
        iconFilled: {
          color: "#ff6d75"
        },
        iconHover: {
          color: "#ff3d47"
        }
      })(Rating);

{/* ////////////////////// Modal Action */}
    const onAction = (item, Decision) => {
        confirm({
            title: (Decision=="Reject"?(
                <h4>ต้องการ{<h2 style={{color: "red", display: "inline"}}>ยกเลิก</h2>}รายการนี้ใช่หรือไม่</h4>
            ) : (
                <h4>ต้องการ{<h2 style={{color: "#00caac", display: "inline"}}>ยืนยัน</h2>}รายการนี้ใช่หรือไม่</h4>
                )),
            icon: (Decision=="Reject"?(
                <ExclamationCircleTwoTone twoToneColor="red"/>
            ):(
                <CheckCircleTwoTone twoToneColor="#00caac"/>
            ) ),
            // content: 'Some descriptions',
            okText: (Decision=="Reject"?('ยกเลิก'):('ยืนยัน')),
            okType: (Decision=="Reject"?('danger'):("#00caac")),
            width:'30%',
            cancelText: 'กลับไปก่อนหน้า',
           
            onOk() {
                (Decision=="Reject"? (setAction(item, Decision)):(setAction(item, Decision)))
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

{/* ////////////////////// Action Function */}
    const setAction = async (item, Decision) => {

        //เอาไว้สับขาหลอกสำหรับ user ทั้ง member และ employee เพื่อจะได้ไม่ต้องเขียนเยอะ
        const userRef = firestore.collection("users").doc(userData !== "member"? userData.uid : (Decision === "Reject"? (userData !== "member"? (item.MemberKey) : (item.ChiropactorKey)) : (item.MemberKey))) //ใช้ uid เพื่ออิงถึง doc
        const memberRef = firestore.collection("users").doc(userData !== "member"? userData.uid : (Decision === "Reject"? (userData !== "member"? (item.MemberKey) : (item.ChiropactorKey)) : (item.MemberKey))) //ใช้ uid เพื่ออิงถึง doc

        try{
{/* //////////////////////  For Employee */}    
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
                status: Decision=="Reject"? "Reject" : "Done"
                // status: "NotDone"
            }

            // นำมา union กันกับ queue ที่เหลือ
            let finalQueue = [...DifferentQueue, RejectObj]

            // ยัด finalQueue ลงไปใน Queue เพื่อรวมกับข้อมูลเก่าทั้งหมด 
            const objUser = {...objDocUser,
                queue:[ ...finalQueue
                ]}

            // set ขื้นไป 
            // await userRef.set(objUser)
            console.log(objUser)

{/* //////////////////////  For Member */}    
            const getDocMember = await memberRef.get()
            const objDocMember = await getDocMember.data()

            let DifferentQueue2 = objDocMember.queue.filter(QueueOld => {
                return ![item].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Different : Return QueueOld ที่ไม่มี SelectedItem 

            let IntersectionQueue2 = objDocMember.queue.filter(QueueOld => {
                return [item].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Intersection : Return เฉพาะ QueueOld ที่มี SelectedItem ได้กลับมาเป็น Obj in Arr

            IntersectionQueue2.forEach(element => {
                let RejectObj2 = {}
                RejectObj2 = {
                    ...element,
                    status: Decision=="Reject"? "Reject" : "Done"
                    // status: "NotDone"
                }

                let finalQueue2 = [...DifferentQueue2, RejectObj2]

                const objUser2 = {...objDocMember,
                    queue:[ ...finalQueue2
                    ]}
                
                //  memberRef.set(objUser2)

                console.log(objUser2)
            });

            if(Decision!=="Reject"){
                setPage("2")
            }
            
        } catch (err) {
            console.log(err)
        }
    }

{/* //////////////////////  For RateStars */}   
    const RateStars = () => {

    }

{/* ////////////////////// return Card */}   
    const CardOrder = (Filtered) => {
        return(
            Filtered.length == 0? (
                <Empty
                    description="ไม่มีการจอง"
                    imageStyle={{height: "300px"}}
                /> 
            ) : (
                Filtered.map((item, index) => {
                    return(
                        <Card
                            key={index}
                            type="inner"
                            className="mb-3"
                            title={
                            <div className="text-left mx-5">
                                <div className="row">
                                    <div className="col">
                                        <img src={item.ChiropactorPic || item.MemberPic} className="mx-5" style={{height: "150px"}} />
                                    </div>
                                    <div className="col pt-3">
                                        <div className="col-12  ">
                                            <h3>{item.name}</h3>
                                        </div>
                                        <div className="col-12 ">
                                            {userData.role !== "member"? (
                                                <h5>คุณ {item.MemberName}</h5>
                                            ):(
                                                <h5>น้อง {item.ChiropactorName}</h5>
                                            )}
                                            
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
                                {item.status == "NotDone"?(
                                    //Logic แสดงปุ่มครับ เขียนโดยใช้ความรู้สึกความตั้งใจที่เต็มเปี่ยม
                                    <>
                                        {userData.role == "employee"?(
                                            <Button className="mr-3" type="primary" size="large"  disabled={false} onClick={ ()=>onAction(item, Done)} style={{background: "#00caac", border: "1px solid transparent"}}>
                                                ยืนยัน
                                            </Button>
                                        ):(null)
                                        }
                                        <Button className="mr-3" type="primary" danger size="large" onClick={()=>onAction(item, Reject)} style={{background: "#eb655b"}}>
                                            ยกเลิก
                                        </Button>
                                    </>
                                ):(item.status !== "Reject"&&userData.role == "member"?(
                                    <Button className="mr-3" type="primary" size="large"  disabled={false} onClick={ ()=>showModal(item) } style={{background: "#00caac", border: "1px solid transparent"}}>
                                        ให้คะแนน
                                    </Button>
                                ):(null)
                                )}
                            </div>
                        </Card>
                    )
                })
            )
        )
    }

    {/* //////////////////////  Modal Controller */}
    const showModal = (item) => {
        setIsModalVisible(true);
        setInfo(item)
        // console.log()
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    useEffect(() => {
        console.log(value.Review.Stars)
    }, [value])

    return (
        <div>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid row justify-content-center text-center border border-danger" style={Style.Content}>

{/* //////////////////////  Reuse Card map */}    
                <Tabs activeKey={page} onChange={(activeKey) => setPage(activeKey)} size="large" className="my-4" style={{ width: "100vh" }}>
                    <TabPane tab="รอการยืนยัน" key="1">
                        <div className="" style={Style.CardOverflow}>
                            {CardOrder (FilterByNotDone)}
                        </div>
                    </TabPane>
                    <TabPane tab="สำเร็จ" key="2">
                        <div className="" style={Style.CardOverflow}>
                            {CardOrder (FilterByDone)}
                        </div>
                    </TabPane>
                    <TabPane tab="ยกเลิก" key="3">
                        <div className="" style={Style.CardOverflow}>
                            {CardOrder (FilterByReject)}
                        </div>
                    </TabPane>
                </Tabs>
            </div>

{/* //////////////////////  Modal RatingStars */}    
            <Modal 
                title="การให้คะแนนของคุณ" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                closable={false}
                width="40%"
            >
                <div className="text-left ">
                    <div className="row">
                        <div className="col-4">
                            <img src={info.ChiropactorPic || info.MemberPic} className="mx-5" style={{width: "150px"}} />
                        </div>
                        <div className="col-8 pt-3">
                            <div className="col-12  ">
                                <h3>{info.name}</h3>
                            </div>
                            <div className="col-12 ">
                                {userData.role !== "member"? (
                                    <h5>คุณ {info.MemberName}</h5>
                                ):(
                                    <h5>น้อง {info.ChiropactorName}</h5>
                                )}
                            </div>
                        </div>
                        <div className=" col-12 pt-3 text-right ">
                            <div className="col-12  ">
                                <h5>วันที่ {info.Date}</h5>
                            </div>
                            <div className="col-12">
                                <h5>เวลา {info.Time}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                                <h3> ราคารวม: ฿{info.price}.00</h3>
                    </div>
                    <Divider orientation="left">คะแนน</Divider>

{/* //////////////////////  Rating Zone */} 
                        <h5>หน้าตา: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.Cuteness}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review,
                                        Stars: {...value.Review.Stars, Cuteness: 0, },
                                }}) : setValue({Review:{...value.Review, Stars: { ...value.Review.Stars, Cuteness: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>รูปร่าง: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.BodyShape}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review,
                                        Stars: {...value.Review.Stars, BodyShape: 0, },
                                }}) : setValue({Review:{...value.Review, Stars: { ...value.Review.Stars, BodyShape: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>ผิวพรรณ: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.BodySkin}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review,
                                        Stars: {...value.Review.Stars, BodySkin: 0, },
                                }}) : setValue({Review:{...value.Review, Stars: { ...value.Review.Stars, BodySkin: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>งานนวด: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.Massage}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review,
                                        Stars: {...value.Review.Stars, Massage: 0, },
                                }}) : setValue({Review:{...value.Review, Stars: { ...value.Review.Stars, Massage: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>ความเป็นกันเอง: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.Friendly}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review,
                                        Stars: {...value.Review.Stars, Friendly: 0, },
                                }}) : setValue({Review:{...value.Review, Stars: { ...value.Review.Stars, Friendly: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                </div>
            </Modal>
        </div>
    )
}

export default Booking
