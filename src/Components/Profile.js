import React, { useContext, useEffect, useState, useRef } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"
import Footer from "./Parts/Footer"

import { Menu, Button, Divider, Descriptions, Select, message } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    OrderedListOutlined,
    EditOutlined,
    FontColorsOutlined,
    PictureOutlined
  } from "@ant-design/icons";
import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

import ImageCropper from './ImageCropper'


import { AuthContext } from "./Auth"

var _ = require('lodash');
function Profile() {
    const { width, currentUser, userData, Modal, message } = useContext(AuthContext)

    const inputFile = useRef(null) 

    const { Option } = Select;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [ file, setFile ] = useState("")

    const [blob, setBlob] = useState(null)
    const [inputImg64, setinputImg64] = useState('')

    const [statusButt, setstatusButt] = useState(false);
    const [ progress, setProgress ] = useState(false)

    const [ pic, setPic ] = useState("")
    const [ loadingPic, setLoadingPic ] = useState("true")
    const [ changeName, setchangeName ] = useState("")
    const [ changeAge, setChangeAge ] = useState("")
    const [ type, setType ] = useState("")

    const [ collapse, setCollapse ] = useState(false)

    const QueueOrderedDESC =  _.orderBy(userData.queue, ["Date", "Time"], ["desc", "desc"])// เรียงวันล่าสุดมาก่อน
        const FilterByDone = _.filter(QueueOrderedDESC, ['status', "Done"])// Filter หาที่มี status เป็น Done
            const FilterReviewed = FilterByDone.filter(item => {
            return ![{totalStar: null}].some(NullStar => NullStar.totalStar === item.Review.totalStar)
            })// Different หาคืวที่มีการให้คะแนนแล้ว เพื่อจะเอาไปแสดงในช่องรีวิว
                const sumStar = FilterReviewed.reduce((prev, item)=>{
                    return(item.Review.totalStar + prev )
                    }, 0)// sum star ที่งหมด
                    const finalStar = (sumStar/FilterReviewed.length).toFixed( 1 ) // หารให้เต็ม 5 

    const getBlob = (blob) => {
        // blob คือ ตัวไฟล์รูป ข้อมูลไฟล์รูปที่ได้มาจาก children 
        setBlob(blob)
    }

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
            // paddingLeft: "15%", 
            // paddingRight: "15%"
        },
        Footer: {
            paddingLeft: "10%",
            paddingRight: "10%"
        },
    }

    const StyledRating = withStyles({
        iconFilled: {
          color: "#ff6d75"
        },
        iconHover: {
          color: "#ff3d47"
        }
      })(Rating);


    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

{/* ////////////////////// Loop create Arr age */}
    let Age = []
    for(let i = 20; i<=35; i++){
        Age.push(<Option value={i}>{i}</Option>)
    }

{/* ////////////////////// onChange Name or Age */}
    const handlechangeName =  (e) => {
        setchangeName(e.target.value)
    }
    const handlechangeAge = (value) => {
        setChangeAge(value)
    }

{/* ////////////////////// Submit Name or Age */}
    const submitAction = async () => {
        setProgress(true)
        setstatusButt(true)

        try{
            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()
            
            const obj = type === "name" ? {
               ...objDoc,
                displayName: changeName
           } : {
                ...objDoc,
                age: changeAge
           }

            await userRef.set(obj)

                setchangeName('')

                setIsModalVisible(false);
                setProgress(false)
                setstatusButt(false)

        } catch(err) {
            msgError(err)
        }
    }

{/* ////////////////////// Modal Controller */}
    const showModal = (item) => {
        setIsModalVisible(true);
        setType(item)
        };
    const handleCancel = () => {
        setIsModalVisible(false);
        setIsModalVisible2(false);
        };
    
    const toggleCollapsed = () => {
        setCollapse(!collapse)
    }

    const onButtonClick = () => {
        // `current` points to the mounted file input element
       inputFile.current.click();
      };

{/* ////////////////////// onChange File */}
    const onInputChange = (e) => {
        // convert image file to base64 string // beyondsundae

        const file = e.target.files[0]
        
        if(file){
            const isLt2M = file.size / 1024 / 1024 > 5 // limit ขนาดของไฟล์ 
            if (!isLt2M) {
                setFile(file)

                const reader = new FileReader()
        
                reader.onload = () => {
                    setinputImg64(reader.result)
                    // รูปที่ encode เป็น base64 แล้ว
                }
        
                if (file) {
                    reader.readAsDataURL(file)
                    setIsModalVisible2(true);
                } 
            } else{ alert('Image must smaller than 5MB!')}
        } else{ return null}
    }

{/* ////////////////////// Submit Photo */}
    const handleSubmitImage = async (e) => {
        e.preventDefault()

        const upPicRef = storage.child(userData.role + "/" + currentUser.uid )

        if( file ) {
            const fileName = "ProfilePic.jpg";
            const targetRef = upPicRef.child(fileName)
            const uploadTask = targetRef.put(blob, { contentType: blob.type })

            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()

            setProgress(true)
            setstatusButt(true)

            uploadTask.on(
                "state_changed", 

                ()=>{},

                (error) => {
                    console.log(error)
                },

                () => {
                    setFile("")

                    uploadTask
                    .snapshot
                    .ref
                    .getDownloadURL()
                    .then(( photoURL ) => {
                        const obj = {
                            ...objDoc,
                            urlPhoto: photoURL
                        }
    
                        userRef.set(obj)
                            
                            setinputImg64("")

                            setIsModalVisible2(false); 
                            setProgress(false)
                            setstatusButt(false)
                    })
                }
            )
        } else {
            console.log("no upload")
            msgError("No Upload")
        }
    }

{/* ////////////////////// message */}
    const msgError = (err) => {
        message.error({
            content: (<h5 className="mt-5">{err}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
            }})
    }

{/* ////////////////////// Get Photo when every update */}
    useEffect(async() => {
    //   if(userData.role){
    //     storage.child(userData.role + "/" + currentUser.uid + "/ProfilePic.jpg")
    //     .getDownloadURL()
    //     .then((url) => {
    //         setPic(url)
    //   }).catch((err) => {
    //     console.log(err)
    //     setPic(null)
    //     msgError(err)
    //   })
    // } 

    const userRef = firestore.collection("users").doc(userData.uid)

    const getDoc = await userRef.get()
    const objDoc = await getDoc.data()

    setPic(objDoc.urlPhoto)
      
      tempPic()
    }, [userData.urlPhoto])

    useEffect(() => {
        // console.log()
    }, [])
    
    return (
        <div style={{textAlign: "center"}}>
            <div className="container-fluid text-right " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center" style={Style.Content}>
                <div  className="row">

{/* ////////////////////// Side Menu */}
                    <div className="col-12 col-sm-12 col-md-12 col-lg-2 col-xl- ">
                        <div className="text-left" style={{ width: 256 }}>
                            <Button
                            type="primary"
                            onClick={toggleCollapsed}
                            style={{ marginBottom: 16 }}
                            >

                            {React.createElement(
                                collapse ? MenuUnfoldOutlined : MenuFoldOutlined
                            )}

                            </Button>

                            <Menu
                            // defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed={collapse}
                            >
                                <Menu.Item key="1" onClick={onButtonClick} icon={<PictureOutlined />}>
                                    <input hidden type='file' id='file' accept="image/*" ref={inputFile} style={{display: 'none'}} onChange={onInputChange}/>
                                    เปลี่ยนรูป
                                </Menu.Item>

                                <Menu.Item key="2" onClick={() => showModal("name")} icon={<FontColorsOutlined />}>
                                    แก้ไขชื่อ
                                </Menu.Item>

                                {userData.role === "employee"? (
                                <>
                                    <Menu.Item key="3" onClick={() => showModal("age")} icon={<EditOutlined />}>
                                        แก้ไข อายุ
                                    </Menu.Item>

                                    <Menu.Item key="4" icon={<OrderedListOutlined />}>
                                        <a href="/masssagelists" >
                                            จัดการรายการนวด 
                                        </a>
                                    </Menu.Item>
                                </>
                                ) : (null)}
                            </Menu>
                        </div>
                    </div>

{/* ////////////////////// Information */}
                    <div className="col-12 col-sm-12 col-md-12 col-lg-10 col-xl- ">
                        <div className="row">
                            <div className="col-12 my-5 text-left">
                              <h3>ข้อมูลของฉัน</h3>  
                              <Divider />
                            </div>

{/* ////////////////////// Picture */}
                            <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl- mb-5">
                                {pic ? (
                                    loadingPic ? null : ( <img src={pic} style={{maxWidth: width < 800 ? (width < 500 ? ("60%") : ("99%")) : "80%"}} />) 
                                )  
                                : (
                                    loadingPic ? null : ( <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" style={{width: "10%"}}/> ) 
                                )}
                                
                            </div>

{/* ////////////////////// Description */}
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-  pl-5 ">
                                <Descriptions title="" className="" style={{marginLeft: "5vh"}}>
                                    <Descriptions.Item label="ชื่อผู้ใช้">{ userData? userData.displayName : null}</Descriptions.Item><br/><br/>
                                    {userData.role === "member"? (null) : ( 
                                    <><Descriptions.Item label="อายุ">{userData.age}</Descriptions.Item><br/><br/></>)}
                                   
                                    <Descriptions.Item label={userData.role === "member"? "จำนวนที่เข้าใช้บริการ" : "จำนวนผู้เข้าใช้บริการ"}>{ userData? FilterReviewed.length : null}</Descriptions.Item><br/><br/>
                                    
                                    {userData.role !== "member"? (
                                    <>
                                        <Descriptions.Item label="คะแนน: ">{FilterReviewed.length !== 0?(
                                            <p style={{color: "#ff6d75"}}>{finalStar} : { userData? (<StyledRating
                                                className=""
                                                size="small"
                                                precision={0.1}
                                                value={finalStar}
                                                icon={<FavoriteIcon fontSize="inherit" />}
                                                readOnly
                                            />) : null}</p>):(<p>ยังไม่มีการรีวิว</p>)}
                                        </Descriptions.Item><br/><br/>
                                        </>) : null}
                                    
                                </Descriptions>

                                <Descriptions title="" className="mt-4" style={{marginLeft: "5vh"}}>
                                    <Descriptions.Item label="Email">{currentUser.email.slice(0,1)+"***"+currentUser.email.slice(4)}</Descriptions.Item><br/><br/>
                                    <Descriptions.Item label="UID">{ userData? userData.uid.slice(0,6)+"***"+userData.uid.slice(9) : null }</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>
                        
                    {/* still have unset picture delay */}

{/* ////////////////////// Modal Chhange Name */}
                        <Modal
                            title={type === "name"? "เปลี่ยนชื่อ" : "แก้ไข อายุ"}
                            visible={isModalVisible}
                            onOk={(e)=>submitAction(e)}
                            onCancel={()=>handleCancel()}
                            closable={false}
                            okButtonProps={ statusButt }
                            cancelButtonProps={ statusButt }
                            footer={[
                                <Button key="back" loading={statusButt} onClick={()=>handleCancel()}>
                                  ย้อนกลับ
                                </Button>,
                                <Button key="submit" type="primary" loading={statusButt} onClick={(e)=>submitAction(e)}>
                                  ตกลง
                                </Button>,
                              ]}
                        >
                            <div className="text-center">
                                {type === "name"? (
                                    <input type="text" value={changeName} onChange={(e) => handlechangeName(e)} placeholder="ชื่อใหม่" />
                                ) : (
                                    <Select defaultValue={userData.age} style={{ width: 120 }} onChange={handlechangeAge}>
                                        {Age}
                                    </Select>
                                )}
                                

                                {progress ? (
                                    <div className="text-center">
                                        <div className="spinner-border mt-5 my-3" role="status"/><br/>
                                        <span className="">Uploading...</span>
                                    </div>
                                    
                                ) : null}
                            </div>
                        </Modal>

{/* ////////////////////// Modal Cropper */}
                        <Modal
                            title="Crop Image"
                            visible={isModalVisible2}
                            onOk={(e)=>handleSubmitImage(e)}
                            onCancel={handleCancel}
                            closable={false}
                            okButtonProps={ statusButt }
                            cancelButtonProps={ statusButt }
                            footer={[
                                <Button key="back" loading={statusButt} onClick={handleCancel}>
                                  ย้อนกลับ
                                </Button>,
                                <Button key="submit" type="primary" loading={statusButt} onClick={(e)=>handleSubmitImage(e)}>
                                  ตกลง
                                </Button>,
                              ]}
                        >
                            {inputImg64 ? (
                                <ImageCropper getBlob={getBlob} inputImg64={inputImg64}/> 
                                ) : null }
                            
                            {progress ? (
                                <div className="text-center">
                                    <div className="spinner-border mt-5 my-3" role="status"/><br/>
                                    <span className="">Uploading...</span>
                                </div>
                                
                            ) : null}
                        </Modal>
                    </div>
                </div>

                <div style={Style.Footer}>
                    <Footer />
                </div>
               
            </div>
            
           
        </div>
    )
}

export default Profile
