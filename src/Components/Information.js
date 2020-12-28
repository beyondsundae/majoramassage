import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"
import Footer from "./Parts/Footer"

import moment from "moment";
import { List, Avatar, DatePicker, Space, Select, Button, Card, Comment, Divider, Empty, Image} from 'antd';
import { BookOutlined } from '@ant-design/icons';

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Information( {allEmployees} ) {
    const { width, currentUser, userData, Rating, FavoriteIcon, withStyles, Modal, message } = useContext(AuthContext)

    const { Option, OptGroup } = Select;
    
    const [ myFavorite, setMyFavorite ] = useState([])
    const [ status, setStatus ] = useState(true)

    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ statusButt, setstatusButt ] = useState(false);
    const [ listItem, setListItem ] = useState("")

    const [ queue, setQueue ] = useState([])
    
    const [ date, setDate ] = useState("")
    const [ time, setTime ] = useState("")
    const [ DateTime, setDateTime ] = useState({Date:"", Time: ""})

    const QueueOrderedDESC =  _.orderBy(allEmployees.queue, ["Date", "Time"], ["desc", "desc"])// เรียงวันล่าสุดมาก่อน
        const FilterByDone = _.filter(QueueOrderedDESC, ['status', "Done"])// Filter หาที่มี status เป็น Done
            const FilterReviewed = FilterByDone.filter(item => {
            return ![{totalStar: null}].some(NullStar => NullStar.totalStar === item.Review.totalStar)
            })// Different หาคืวที่มีการให้คะแนนแล้ว เพื่อจะเอาไปแสดงในช่องรีวิว
                const sumStar = FilterReviewed.reduce((prev, item)=>{
                    return(item.Review.totalStar + prev )
                    }, 0)// sum star ที่งหมด
                    const finalStar = (sumStar/FilterReviewed.length).toFixed( 1 ) // หารให้เต็ม 5 

    const OrderedListMassage = _.orderBy(allEmployees.listMassage, ["id"], ["asc"])// เรียง list จาก id น้อยไปหามาก

    const Style = {
        Header: {
            height: width < 500 ? "25vh" : "8vh",
            background: '#444B54'
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            height: width < 500 ? "74vh" : "91vh",
            paddingLeft: width < 800 ? "0%" : "10%", 
            paddingRight: width < 800 ?"0%" : "10%"
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

{/* ////////////////////// Date & Time Zone */}
    const onChangeDate = (date, dateString) => {
        // console.log(dateString);
        setDate(dateString)
    }
      
    const onChangeTime = (value) => {
        // console.log(value);
        setTime(value)
    }
      
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf("day");
    }

    useEffect(() => {
        // Disable Time if date is empty
        if(date !== ""){
            setStatus(false)
        }
    }, [date])

    useEffect(() => {
        setDateTime({Date: date, Time: time})
    }, [date, time])

{/* ////////////////////// Action Favorite */}
    const unFavAction  = async (item, newValue, index) => {

        try{
            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()

            const Filtered = myFavorite.filter(itemMyFav => {
                return ![{createed: item.createed}].some(subCreated => subCreated.createed === itemMyFav.createed)
                })// Different เอา item ที่กดมาออกจาก Favorite ของเรา
            
            const obj = {
               ...objDoc,
                Favorite: Filtered
            }

            await userRef.set(obj)

        } catch(err) {
            msgError(err)
        }
    }

    const FavAction = async (item, newValue, index) => {

        try{
            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()

            let tempArr = [...myFavorite]
        
            tempArr = [ ...tempArr,  {createed: item.createed}]
            
            const obj = {
               ...objDoc,
                Favorite: tempArr
            }

            await userRef.set(obj)

        } catch(err) {
            msgError(err)
        }
    }

{/* ////////////////////// When Submit */}
    const submiBooking = async (e) => {
        e.preventDefault();

        const userRef = firestore.collection("users").doc(userData.uid)
        const chiropractorRef = firestore.collection("users").doc(allEmployees.uid)

        if(date && time !== ""){
            setstatusButt(true)

            try{
                // For Member
                const getDocUser = await userRef.get()
                const objDocUser = await getDocUser.data()
                const created = new Date().valueOf()
    
                const objUser = {...objDocUser,
                    queue:[ ...objDocUser.queue,
                    {
                        ChiropactorName: allEmployees.displayName,
                        ChiropactorPic: allEmployees.urlPhoto,
                        ChiropactorKey: allEmployees.uid,
                        createed: created,
                        id: listItem.id,
                        name: listItem.name,
                        price: listItem.price,
                        status: "NotDone",
                        Date: date,
                        Time: time,
                        Review: {
                            Stars: {
                                Cuteness: null,
                                BodyShape: null,
                                BodySkin: null,
                                Massage: null,
                                Friendly: null
                            },
                            totalStar: null,
                            Comment: "",
                            Reviewer: userData.displayName
                        }
                    }
                    ]}
    
              await userRef.set(objUser)
    
                // For Chiropactor
                const getDocChiropactor = await chiropractorRef.get()
                const objDocChiropactor = await getDocChiropactor.data()
    
                /* ใช้ Spread เพื่อ union ข้อมูลเก่าและอันใหม่นะครับ  use spread to combine old and new data together */
                const objChiropactor = {...objDocChiropactor,
                    queue:[...objDocChiropactor.queue,
                    {
                        MemberName: userData.displayName,
                        MemberPic: userData.urlPhoto,
                        MemberKey: userData.uid,
                        createed: created,
                        id: listItem.id,
                        name: listItem.name,
                        price: listItem.price,
                        status: "NotDone",
                        Date: date,
                        Time: time,
                        Review: {
                            Stars: {
                                Cuteness: null,
                                BodyShape: null,
                                BodySkin: null,
                                Massage: null,
                                Friendly: null
                            },
                            totalStar: null,
                            Comment: "",
                            Reviewer: userData.displayName
                        }
                    }
                    ]}
    
                 await chiropractorRef.set(objChiropactor)
    
                        setIsModalVisible(false);
                        setstatusButt(false)

                        msgSuccess()
    
            } catch (err) {
                console.log(err)
                msgError(err)
            }

        } else {
            message.warning({
                content: (<h5 className="mt-5">กรุณาเลือก วันที่/เวลา ให้ถูกต้อง</h5>), 
                duration: 3,
                style: {
                    marginTop: '8vh',
                  },});
        }
    }

{/* //////////////////////  Message */}
    const msgSuccess = () => {
        message.success({
            content: (<h5 className="mt-5">ยืนยันรายการสำเร็จ</h5>), 
            duration: 1.5,
            style: {
                marginTop: '8vh',
            },})
            .then(() => window.location.reload())
    }

    const msgError = (err) => {
        message.error({
            content: (<h5 className="mt-5">{err}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
            },});
    }

{/* ////////////////////// Modal Control */}
    const showModal = (item) => {
        // e.preventDefault();
        console.log(item)
        setIsModalVisible(true);
        setListItem(item)
        };
    const handleCancel = () => {
        setIsModalVisible(false);

        };

{/* //////////////////////  Get queue */}

    const copyQueue =  () => {
        // filter เอา status NotDone
        // เอามาแค่ Date กับ Time ใส่ไว้ใน object

        const FilterByDone = _.filter(allEmployees.queue, ['status', "NotDone"])
        const final = FilterByDone.map((item, index) => {
            return {Date: item.Date, Time: item.Time}
        })
            setQueue(final)
    }

{/* //////////////////////  Get myFav */}
    useEffect(() => {
        setMyFavorite(userData? (userData.Favorite) : [] )
    }, [userData])

    useEffect(() => {
        copyQueue()
    }, [])

    useEffect(() => {
        // console.log()
    }, [])

    return (
        <div>
          <div className="container-fluid text-right" style={Style.Header}>
            <Header />
          </div>

          <div className="container-fluid mt-1 pt-3 text-center" style={Style.Content}>
              <div className="row" style={{margin: "0px"}}>
{/* ////////////////////// col left */}
                <div className="col-12 col-sm-12 col-md-6 col-lg-6" style={{height: "80vh"}}> 
                    {
                        allEmployees.urlPhoto ? (
                            <Image style={{maxWidth: width < 800 ? (width < 500 ? ("99%") : ("99%")) : "89%"}} src={allEmployees.urlPhoto}/>
                        ) : (
                            <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png"/>
                        )
                    }
                </div>

{/* ////////////////////// col Right */}
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 ">
                    <div className="row">
                        <div className='col-12 pt-3 text-left'>
                            <h1 style={{display: "inline"}}>น้อง { allEmployees? allEmployees.displayName : null}</h1>

{/* ////////////////////// Favorite zone */}
                            <div className="text-right mr-3">
                                {userData? ( userData.role === "member"? (
                                    <StyledRating
                                        // key={index}
                                        size="large"
                                        value={
                                            userData.role === "member"? (
                                                myFavorite.some((itemx)=>{
                                                    if(itemx.createed === allEmployees.createed){ return true } //Return True if there are in myFav
                                                })
                                            ) : false
                                        }
                                        max="1"
                                        precision={1}
                                        onChange={(event, newValue) =>{
                                            if(newValue === null){
                                                unFavAction(allEmployees, newValue )
                                            } else {
                                                FavAction(allEmployees, newValue)
                                            }
                                        }} //Initial is null After click is 1
                                        icon={<FavoriteIcon fontSize="inherit" />}
                                    /> 
                                ) : null) : null}
                            </div>
                        </div>
                        <div className='col pt-3 text-left'>
                            <h5>อายุ: { allEmployees? allEmployees.age : null } </h5>
                            <h5>จำนวนผู้เข้าใช้บริการ: { allEmployees? FilterReviewed.length : null} </h5>

                            {FilterReviewed.length !== 0?(
                            <h2 style={{color: "#ff6d75"}}>{finalStar}: { allEmployees? (<StyledRating
                                className="mt-1"
                                size="large"
                                precision={0.1}
                                value={finalStar}
                                icon={<FavoriteIcon fontSize="inherit" />}
                                readOnly
                            />) : null}</h2>):(<h3>ยังไม่มีการรีวิว</h3>)}

                        </div>
                    </div>
                    
                    <Divider orientation="center"><h5>รายการนวด</h5> </Divider>
    
{/* ////////////////////// List นวด */}
                    <List
                        className="mt-3"
                        itemLayout="horizontal"
                        dataSource={OrderedListMassage}
                        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="ไม่มีข้อมูล" />}}
                        renderItem={item => (
                            // ทำงานเหมือน map
                        <List.Item className="mx-5 ">
                            {/* actions={[<a key="list-loadmore-edit" className="mr-5">edit</a>]} */}
                            <List.Item.Meta
                                // avatar={ <CaretRightFilled />}
                                title={
                                    <h4 style={{display: "inline"}}>{item.name} ราคา: <h4 style={{display: "inline", color: "#ff4d4f"}}>{item.price}</h4></h4>
                                
                                    }
                                description={""}
                            />  
                            {userData? (
                                <Button onClick={()=>showModal(item)} style={{background: "#0e77ca", color: "white", border: "1px solid transparent"}} size="large"><BookOutlined /> จอง</Button>
                            ) : (
                                <div>กรุณาเข้าสู่ระบบ</div>
                            )}
                        </List.Item>
                        )}
                    />
                  </div>
              </div>

{/* ////////////////////// Review zone */}
                <div className="col mt-1" style={{paddingLeft: width < 800 ? (width < 500 ? ("0%") : ("10%")) : "0%", paddingRight: width < 800 ? (width < 500 ? ("0%") : ("10%")) : "0%"}}>
                {/* {FilterReviewed.length !== 0? ( */}
                    <Card
                    // key={index}
                    type="inner"
                    className="mb-3"
                    title={
                        <div className="text-left my-3">
                            <h3>การรีวิว   </h3>
                            {FilterReviewed.length !== 0?(
                            <>
                                <h2 style={{display: "inline", color: "#ff6d75"}}> {finalStar}</h2><h4 style={{display: "inline", color: "#ff6d75"}}> /5</h4><br/>
                                    <StyledRating
                                        className="mt-1"
                                        size="large"
                                        precision={0.1}
                                        value={finalStar}
                                        icon={<FavoriteIcon fontSize="inherit" />}
                                        readOnly
                                    />
                            </>):(<h3>ยังไม่มีการรีวิว</h3>)}
                        </div>
                    }>
                        <div style={{height: "70vh", overflow: "auto"}}>
                        {FilterReviewed.length !== 0?(
                            FilterReviewed.map((item) => {
                                // console.log(item)
                            return(
                                <div>
                                    <Comment
                                        author={<h4>คุณ {item.Review.Reviewer}</h4>}
                                        avatar={<Avatar src={item.MemberPic} />}
                                        content={
                                            <div className="text-left">

                                           <p className="ml-5 my-3">{item.Review.Comment}</p>

                                            <h5 className="ml-5">หน้าตา: 
                                            <StyledRating
                                                size="small"
                                                value={item.Review.Stars.Cuteness}
                                                icon={<FavoriteIcon fontSize="inherit" />}
                                                readOnly
                                            /></h5> 
                                        <h5 className="ml-5">รูปร่าง: 
                                            <StyledRating
                                                size="small"
                                                value={item.Review.Stars.BodyShape}
                                                icon={<FavoriteIcon fontSize="inherit" />}
                                                readOnly
                                            /></h5> 
                                        <h5 className="ml-5">ผิวพรรณ: 
                                            <StyledRating
                                                size="small"
                                                value={item.Review.Stars.BodySkin}
                                                icon={<FavoriteIcon fontSize="inherit" />}
                                                readOnly
                                            /></h5> 
                                        <h5 className="ml-5">งานนวด: 
                                            <StyledRating
                                                size="small"
                                                value={item.Review.Stars.Massage}
                                                icon={<FavoriteIcon fontSize="inherit" />}
                                                readOnly
                                            /></h5> 
                                        <h5 className="ml-5">ความเป็นกันเอง: 
                                            <StyledRating
                                                size="small"
                                                value={item.Review.Stars.Friendly}
                                                icon={<FavoriteIcon fontSize="inherit" />}
                                                readOnly
                                            /></h5> 
                        
                                            <Divider orientation="center"><h5>คะแนนรวม: {item.Review.totalStar} <FavoriteIcon style={{color: "#ff6d75"}}/></h5> </Divider>
                        
                                            <p>{item.Date} {item.Time}</p>
                                        </div>
                                        }
                                        />
                                   <Divider />
                                </div>

                            )
                        })):(<Empty description="ไม่มีข้อมูล" className="my-5" />)}
                        </div>
                    </Card>
                </div>
                <Footer />
            </div>

{/* ////////////////////// Modal */}
                <Modal
                    // title="เปลี่ยนชื่อ"
                    visible={isModalVisible}
                    onOk={(e)=>submiBooking(e)}
                    onCancel={()=>handleCancel()}
                    closable={false}
                    className="text-center"
                    footer={[
                        <Button key="back" loading={statusButt} onClick={()=>handleCancel()}>
                          ย้อนกลับ
                        </Button>,
                        <Button key="submit" type="primary" loading={statusButt} onClick={(e)=>submiBooking(e)}>
                          ตกลง
                        </Button>,
                      ]}
                >   

                <div className="my-5">
                    <h4>
                        {listItem.name} ราคา: {listItem.price}
                    </h4>
                </div>
                
                
                <Space direction="vertical" size={12}>
                    <DatePicker
                        onChange={onChangeDate}
                        // value={date !== "" ? date : ""}
                        format="YYYY-MM-DD"
                        disabledDate={disabledDate}
                        placeholder="วันที่"
                    />
                </Space>

                <Select
                    disabled={status}
                    defaultValue="เวลา"
                    style={{ width: 120 }}
                    onChange={onChangeTime}
                >
                    <OptGroup label="ช่วงบ่าย">
                        <Option key="15:00" disabled={ queue.find(item => item.Date === date && item.Time === "15:00"? (true) : (false)) }>15:00</Option>
                        <Option key="16:00" disabled={ queue.find(item => item.Date === date && item.Time === "16:00"? (true) : (false)) }>16:00</Option>
                        <Option key="17:00" disabled={ queue.find(item => item.Date === date && item.Time === "17:00"? (true) : (false)) }>17:00</Option>
                    </OptGroup>
                    
                    <OptGroup label="ช่วงค่ำ">
                        <Option key="19:00" disabled={ 
                            //เอา Arr คิวของหมอนวดมาคุ้ยหา ว่ามีวันที่และเวลาตรงกับที่เลือกใน Pickdate มั้ย ถ้ามีก็ให้ Disable ถ้าไม่ก็ ให้เลือกได้ (ยังหาวิํธีแบบ Dynamic ไม่่ได้ T______T ) 
                            queue.find(item => { 
                                //แบบ Short
                                return item.Date === date && item.Time === "19:00"? (true) : (false)

                                // แบบ Full (เพื่อความเข้าใจ)
                                // if(item.Date === date && item.Time === "19:00" )return true
                                // else return false    
                            }) }>19:00</Option>
                        <Option key="20:00" disabled={ queue.find(item => item.Date === date && item.Time === "20:00"? (true) : (false)) }>20:00</Option>
                        <Option key="21:00" disabled={ queue.find(item => item.Date === date && item.Time === "21:00"? (true) : (false)) }>21:00</Option>
                        <Option key="22:00" disabled={ queue.find(item => item.Date === date && item.Time === "22:00"? (true) : (false)) }>22:00</Option>
                        <Option key="23:00" disabled={ queue.find(item => item.Date === date && item.Time === "23:00"? (true) : (false)) }>23:00</Option>
                    </OptGroup>
                </Select>
                </Modal>
        </div>
    )
}

export default Information
