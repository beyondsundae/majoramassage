import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import moment from "moment";
import { List, Avatar, DatePicker, Space, Select, Button, message, Card, Comment, Divider} from 'antd';

import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Information( {allEmployees} ) {
    const { Option, OptGroup } = Select;
    
    const [ status, setStatus ] = useState(true)

    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ statusButt, setstatusButt ] = useState({ disabled: false });
    const [ listItem, setListItem ] = useState("")

    const [ queue, setQueue ] = useState([])
    // const [ totalStar, settotalStar ] = useState("")
    
    const [ date, setDate ] = useState("")
    const [ time, setTime ] = useState("")
    const [ DateTime, setDateTime ] = useState({Date:"", Time: ""})

    const [ progress, setProgress ] = useState(false)

    const { currentUser, userData, Modal } = useContext(AuthContext)


    const QueueOrderedDESC =  _.orderBy(allEmployees.queue, ["Date", "Time"], ["desc", "desc"])// เรียงวันล่าสุดมาก่อน
    const FilterByDone = _.filter(QueueOrderedDESC, ['status', "Done"])// Filter หาที่มี status เป็น Done
    const FilterReviewed = FilterByDone.filter(item => {
        return ![{totalStar: null}].some(NullStar => NullStar.totalStar === item.Review.totalStar)
    })// Different หาคืวที่มีการให้คะแนนแล้ว เพื่อจะเอาไปแสดงในช่องรีวิว

    const sumStar = FilterReviewed.reduce((prev, item)=>{
        return(item.Review.totalStar + prev )
    }, 0)// 

    const finalStar = (sumStar/FilterReviewed.length).toFixed( 1 )

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

{/* ////////////////////// When Submit */}
    const submiBooking = async (e) => {
        e.preventDefault();

        const userRef = firestore.collection("users").doc(userData.uid)
        const chiropractorRef = firestore.collection("users").doc(allEmployees.uid)

        if(date && time !== ""){
            setProgress(true)
            setstatusButt({ disabled: true })

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
                        setProgress(false)
                        setstatusButt({ disabled: false })

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
        // Get มาแค่ Date กับ Time ใส่ไว้ใน object
        const final = allEmployees.queue.map((item, index) => {
            return {Date: item.Date, Time: item.Time}
        })
            setQueue(final)
    }

    useEffect(() => {
        copyQueue()
    }, [])

    useEffect(() => {
        // console.log()
    }, [])

    return (
        <div>
          <div className="container-fluid text-right border border-danger " style={Style.Header}>
            <Header />
          </div>

          <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
              <div className="row">
{/* ////////////////////// col left */}
                <div className="col border border-danger" style={{height: "80vh"}}> 
                    {
                        allEmployees.urlPhoto ? (
                            <img src={allEmployees.urlPhoto} style={{maxWidth: "60%"}} />
                        ) : (
                            <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" />
                        )
                    }
                </div>

{/* ////////////////////// col Right */}
                <div className="col border border-danger">
                    <h1>น้อง { allEmployees? allEmployees.displayName : null}</h1>
                    <h2>อายุ: { allEmployees? allEmployees.age : null }</h2>
                    <h2>จำนวดผู้เข้ารับการนวด: { allEmployees? allEmployees.count : null}</h2>
                    <h2>⭐️: { allEmployees? allEmployees.star : null}</h2>
                    <h2>role: { allEmployees? allEmployees.role : null}</h2>
    
                    <List
                        itemLayout="horizontal"
                        dataSource={allEmployees.listMassage}
                        renderItem={item => (
                            // ทำงานเหมือน map
                        <List.Item className="mx-5">
                            {/* actions={[<a key="list-loadmore-edit" className="mr-5">edit</a>]} */}
                            <List.Item.Meta
                                avatar={ <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> }
                                title={
                                    <h4>{item.name} ราคา: {item.price}</h4>
                                
                                    }
                                description={""}
                            />  
                            {userData? (
                                <Button onClick={()=>showModal(item)} style={{background: "#0e77ca", color: "white", border: "1px solid transparent"}}>จอง</Button>
                            ) : (
                                <div>กรุณาเข้าสู่ระบบ</div>
                            )}
                        </List.Item>
                        )}
                    />
                  </div>
              </div>

                <div className="col mt-5 border border-danger" style={{paddingLeft: "15%", paddingRight: "15%"}}>
                <Card
                    // key={index}
                    type="inner"
                    className="mb-3"
                    title={
                        <div className="text-left my-3">
                            <h3>การรีวิว <FavoriteIcon style={{color: "#ff6d75"}}/>{finalStar}</h3> 
                        </div>
                    }>
                        {FilterReviewed.map((item, index) => {
                            console.log(item)
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
                        })}
                    </Card>
                </div>
            </div>

{/* ////////////////////// Modal */}
                <Modal
                    title="เปลี่ยนชื่อ"
                    visible={isModalVisible}
                    onOk={(e)=>submiBooking(e)}
                    onCancel={()=>handleCancel()}
                    closable={false}
                    okButtonProps={ statusButt }
                    cancelButtonProps={ statusButt }
                    className="text-center"
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
