// © 2020 Copyright: NongNuabNaab.com 
// By beyondsundae (Thanakrit)

// May the knowledge and Intention be with those who work hard ❤️ 

import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"
import Footer from "./Parts/Footer"

import { Card, Button, Tabs, Empty, Divider, Input } from "antd";
import { ExclamationCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import { AuthContext } from "./Auth"

var _ = require('lodash');
const Booking = () => {
    const {  width, currentUser, userData, Rating, FavoriteIcon, withStyles, Modal, message } = useContext(AuthContext)

    const [ page, setPage ] = useState("1")
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ info, setInfo ] = useState("")
    const [ finalStars, setFinalStars ] = useState()

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
    const { TextArea } = Input;

    const Reject = "Reject"
    const Done = "Done"

    const QueueOrdered = _.orderBy(userData.queue, ["Date", "Time"], ["asc", "asc"])
    const QueueOrderedDESC =  _.orderBy(userData.queue, ["Date", "Time"], ["desc", "desc"])

    const FilterByNotDone = _.filter(QueueOrdered, ['status', "NotDone"]);
    const FilterByReject = _.filter(QueueOrderedDESC, ['status', "Reject"]);
    const FilterByDone = _.filter(QueueOrderedDESC, ['status', "Done"]);


    const Style = {
        Header: {
            height: width < 500 ? "25vh" : "8vh",
            background: '#444B54'
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            height: width < 500 ? "99vh" : "91vh",
            margin: "0px",
        },
        Footer: {
            paddingLeft: "10%",
            paddingRight: "10%"
        },
        CardOverflow: {
            width: "100%", 
            height: "80vh", 
            margin:"0px", 
            overflow: "auto"
        }
    }

{/* //////////////////////  Message */}
    const msgSuccess = () => {
        message.success({
            content: (<h5 className="mt-5">ยืนยันรายการสำเร็จ</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
              },});
    }

    const msgError = (err) => {
        message.error({
            content: (<h5 className="mt-5">{err}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
              },});
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
                <h4>ต้องการ{<h2 style={{color: "red", display: "inline"}}>ยกเลิกเลย</h2>}รายการนี้ใช่หรือไม่</h4>
            ) : (
                <h4>ต้องการ{<h2 style={{color: "#00caac", display: "inline"}}>ยืนยันเลย</h2>}รายการนี้ใช่หรือไม่</h4>
                )),
            icon: (Decision=="Reject"?(
                <ExclamationCircleTwoTone twoToneColor="red"/>
            ):(
                <CheckCircleTwoTone twoToneColor="#00caac"/>
            ) ),
            // content: 'Some descriptions',
            okText: (Decision=="Reject"?('ยกเลิก'):('ยืนยัน')),
            okType: (Decision=="Reject"?('danger'):("#00caac")),
            width: width < 800 ? "100%" : "30%",
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
        //เอาไว้สับขาหลอกสำหรับ user ทั้ง member และ employee ให้การเขียนข้อมูลลงไปขึ้นอยู่กับ role ของ user ที่ล็อคอินอยู่
        const userRef = firestore.collection("users").doc(userData.role === "employee"? userData.uid: (Decision === "Reject"? userData.uid : null)) //ใช้ uid เพื่ออิงถึง doc
        const user2Ref = firestore.collection("users").doc(userData.role === "employee"? item.MemberKey: (Decision === "Reject"? (item.ChiropactorKey) : null)) //ใช้ uid เพื่ออิงถึง doc

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
            }

            // นำมา union กันกับ queue ที่เหลือ
            let finalQueue = [...DifferentQueue, RejectObj]

            // ยัด finalQueue ลงไปใน Queue เพื่อรวมกับข้อมูลเก่าทั้งหมด 
            const objUser = {...objDocUser,
                queue:[ ...finalQueue
                ]}

            // set ขื้นไป 
            await userRef.set(objUser)

{/* //////////////////////  For Member */}    
            const getDocUser2 = await user2Ref.get()
            const objDocUser2 = await getDocUser2.data()

            let DifferentQueue2 = objDocUser2.queue.filter(QueueOld => {
                return ![item].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Different : Return QueueOld ที่ไม่มี SelectedItem 

            let IntersectionQueue2 = objDocUser2.queue.filter(QueueOld => {
                return [item].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Intersection : Return เฉพาะ QueueOld ที่มี SelectedItem ได้กลับมาเป็น Obj in Arr

            IntersectionQueue2.forEach(element => {
                let RejectObj2 = {}
                RejectObj2 = {
                    ...element,
                    status: Decision=="Reject"? "Reject" : "Done"
                }

                let finalQueue2 = [...DifferentQueue2, RejectObj2]

                const objUser2 = {...objDocUser2,
                    queue:[ ...finalQueue2
                    ]}
                
                user2Ref.set(objUser2)
                msgSuccess()

                // console.log(objUser)         
            });

            if(Decision!=="Reject"){
                setPage("2")
            }
            
        } catch (err) {
            console.log(err)
            msgError(err)
        }
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
                                <h3> ค่าบริการ: ฿{item.price}.00</h3>
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
                                ):(item.status !== "Reject"&&userData.role == "member"&&item.Review.totalStar===null?(
                                    <Button className="mr-3" type="primary" size="large"  disabled={false} onClick={ ()=>showModal(item) } style={{background: "#ff85c0", border: "1px solid transparent"}}>
                                        ให้คะแนน
                                    </Button>
                                ):(item.status !== "Reject"&&item.Review.totalStar===null?(
                                    <Button disabled className="mr-3" type="primary" size="large" >
                                        รอการรีวิว
                                    </Button>
                                        ):(item.status !== "Reject"?(<Button className="mr-3" type="primary" size="large"  disabled={false} onClick={ ()=>SeeMyReview(item)} style={{background: "#108ee9", border: "1px solid transparent"}}>
                                        ดูคะแนน
                                    </Button>):(null)
                                    )
                                )
                                )}
                            </div>
                        </Card>
                    )
                })
            )
        )
    }

    function SeeMyReview(item) {
        Modal.info({
          title: 'คะแนนที่รีวิว',
          content: (
            <div >
              <h5>หน้าตา: 
                    <StyledRating
                        size="large"
                        value={item.Review.Stars.Cuteness}
                        icon={<FavoriteIcon fontSize="inherit" />}
                        readOnly
                    /></h5> 
                <h5>รูปร่าง: 
                    <StyledRating
                        size="large"
                        value={item.Review.Stars.BodyShape}
                        icon={<FavoriteIcon fontSize="inherit" />}
                        readOnly
                    /></h5> 
                <h5>ผิวพรรณ: 
                    <StyledRating
                        size="large"
                        value={item.Review.Stars.BodySkin}
                        icon={<FavoriteIcon fontSize="inherit" />}
                        readOnly
                    /></h5> 
                <h5>งานนวด: 
                    <StyledRating
                        size="large"
                        value={item.Review.Stars.Massage}
                        icon={<FavoriteIcon fontSize="inherit" />}
                        readOnly
                    /></h5> 
                <h5>ความเป็นกันเอง: 
                    <StyledRating
                        size="large"
                        value={item.Review.Stars.Friendly}
                        icon={<FavoriteIcon fontSize="inherit" />}
                        readOnly
                    /></h5> 

                    <Divider orientation="center"><h5>คะแนนรวม: {item.Review.totalStar} <FavoriteIcon style={{color: "#ff6d75"}}/></h5> </Divider>

                <h5 className="mt-5">ความคิดเห็นเพิ่มเติม</h5>
                    <Card  style={{ width: 300 }}>
                        {item.Review.Comment}
                    </Card>

                <h5 className="mt-5">ผู้รีวิว: {item? (item.Review.Reviewer):(null)}</h5>
            </div>
          ),
          onOk() {},
        });
      }
      

{/* //////////////////////  Action Function*/}   
    const setRateStars = async () => {

        let sumStars = value.Review.Stars.BodyShape + value.Review.Stars.BodySkin + value.Review.Stars.Cuteness + value.Review.Stars.Friendly + value.Review.Stars.Massage
        let finalStars = sumStars/5

        console.log(finalStars)

        setValue(
            {Review: {
                ...value.Review, 
                totalStar: finalStars, 
                
        }})

        //เป็นการเอาข้อมูล Rating เขียนซ้อนไป ชายจะมีข้อมูลของหญิง หญิงจะมีข้อมูลของชาย ต้องสับขาเขียนทับ
        const userRef = firestore.collection("users").doc(userData.uid) //ใช้ uid เพื่ออิงถึง doc
        const user2Ref = firestore.collection("users").doc(info.ChiropactorKey) //ใช้ uid เพื่ออิงถึง doc

        try{
{/* //////////////////////  For Employee */}    
            const getDocUser = await userRef.get()
            const objDocUser = await getDocUser.data()

            // เข้าถึง Queue เพื่อ Different queue ที่กดเลืือกออกไป
            let DifferentQueue = objDocUser.queue.filter(QueueOld => {
                return ![info].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Different : Return QueueOld ที่ไม่มี SelectedItem 

            // สร้าง queueเดิมที่ถูกตัดออก ใหม่โดยเปลี่ยน status to Reject
            let ReviewedObj = {}
            ReviewedObj = {
                ...info,
                ...value
            }

            // นำมา union กันกับ queue ที่เหลือ
            let finalQueue = [...DifferentQueue, ReviewedObj]

            // ยัด finalQueue ลงไปใน Queue เพื่อรวมกับข้อมูลเก่าทั้งหมด 
            const objUser = {...objDocUser,
                queue:[ ...finalQueue
                ]}

            // set ขื้นไป 
            await userRef.set(objUser)

{/* //////////////////////  For Employee */}    
            const getDocUser2 = await user2Ref.get()
            const objDocUser2 = await getDocUser2.data()

            let DifferentQueue2 = objDocUser2.queue.filter(QueueOld => {
                return ![info].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Different : Return QueueOld ที่ไม่มี SelectedItem 

            let IntersectionQueue2 = objDocUser2.queue.filter(QueueOld => {
                return [info].some(SelectedItem => SelectedItem.createed === QueueOld.createed)
            }) //Intersection : Return เฉพาะ QueueOld ที่มี SelectedItem ได้กลับมาเป็น Obj in Arr

            IntersectionQueue2.forEach(element => {
                // สร้าง queueเดิมที่ถูกตัดออก ใหม่โดยเปลี่ยน status to Reject
                let ReviewedObj2 = {}
                ReviewedObj2 = {
                    ...element,
                    ...value
                }

                let finalQueue2 = [...DifferentQueue2, ReviewedObj2]

                const objUser2 = {...objDocUser2,
                    queue:[ ...finalQueue2
                    ]}
                
                user2Ref.set(objUser2)
                msgSuccess()

                // console.log(objUser)
                // console.log(objUser2)
            });
            
        } catch (err) {
            console.log(err)
            msgError(err)
        }

    }

{/* //////////////////////  Sum Stars */}
useEffect(() => {
    let sumStars = value.Review.Stars.BodyShape + value.Review.Stars.BodySkin + value.Review.Stars.Cuteness + value.Review.Stars.Friendly + value.Review.Stars.Massage
    let finalStars = sumStars/5
    // console.log(finalStars)
    setFinalStars(finalStars)
    
}, [value])

{/* //////////////////////  Update value after setFinalstars / ถ้าไม่อัพดกทมันจะเป็น prev finalstars */}
useEffect(() => {
    // console.log(value)
    setValue(
        {Review: {
            ...value.Review, 
            totalStar: finalStars, 
            
    }})
}, [finalStars]) 

{/* //////////////////////  Modal Controller */}
    const showModal = (item) => {
        setIsModalVisible(true);
        setInfo(item)
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
        setRateStars()
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    useEffect(() => {
        // console.log()
    }, [])

    return (
        <div>
            <div className="container-fluid text-right" style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid row justify-content-center text-center" style={Style.Content}>

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

            <div style={Style.Footer}>
                <Footer />
            </div>

{/* //////////////////////  Modal RatingStars */}    
            <Modal 
                title="การให้คะแนนของคุณ" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                closable={false}
                width="40%"
                footer={[
                    <Button key="back" onClick={handleCancel}>
                      ย้อนกลับ
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                      ตกลง
                    </Button>,
                  ]}
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
                            <h3> ค่าบริการ: ฿{info.price}.00</h3>
                            *กรุณาชำระค่าบริการที่เคาเตอร์
                    </div>

                    <Divider orientation="left"><h5>การรีวิวของคุณ</h5></Divider>

{/* //////////////////////  Rating Zone */} 
                        <h5>หน้าตา: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.Cuteness}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue(
                                    {Review: {
                                        ...value.Review, 
                                        totalStar: finalStars, 
                                        Reviewer:info.Review.Reviewer,
                                            Stars: {
                                                ...value.Review.Stars, 
                                                Cuteness: 0, },
                                }}) : setValue(
                                    {Review: {
                                        ...value.Review, 
                                        totalStar: finalStars, 
                                        Reviewer:info.Review.Reviewer, 
                                            Stars: {
                                                 ...value.Review.Stars, 
                                                 Cuteness: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>รูปร่าง: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.BodyShape}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer,
                                        Stars: {...value.Review.Stars, BodyShape: 0, },
                                }}) : setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer, Stars: { ...value.Review.Stars, BodyShape: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>ผิวพรรณ: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.BodySkin}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer,
                                        Stars: {...value.Review.Stars, BodySkin: 0, },
                                }}) : setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer, Stars: { ...value.Review.Stars, BodySkin: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>งานนวด: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.Massage}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer,
                                        Stars: {...value.Review.Stars, Massage: 0, },
                                }}) : setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer, Stars: { ...value.Review.Stars, Massage: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 
                        <h5>ความเป็นกันเอง: 
                            <StyledRating
                                size="large"
                                value={value.Review.Stars.Friendly}
                                precision={1}
                                onChange={(event, newValue) => {newValue == null ? setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer,
                                        Stars: {...value.Review.Stars, Friendly: 0, },
                                }}) : setValue({Review:{...value.Review, totalStar: finalStars, Reviewer:info.Review.Reviewer, Stars: { ...value.Review.Stars, Friendly: newValue}}})}}
                                icon={<FavoriteIcon fontSize="inherit" />}
                            /></h5> 

                            <Divider orientation="center"><h5>คะแนนรวม: {finalStars} <FavoriteIcon style={{color: "#ff6d75"}}/></h5> </Divider>

                    <h5 className="mt-5">ความคิดเห็นเพิ่มเติม</h5>
                    <TextArea rows={4} value={value.Review.Comment} showCount maxLength={100} onChange={(e)=>setValue({Review:{...value.Review, Comment: e.target.value}})} />

                    <h5 className="mt-5">ผู้รีวิว: {info? (info.Review.Reviewer):(null)}</h5>
                </div>
            </Modal>
        </div>
    )
}

export default Booking
