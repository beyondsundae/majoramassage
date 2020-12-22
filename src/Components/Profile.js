import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import { Menu, Button, Divider, Descriptions } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
  } from "@ant-design/icons";
import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Profile() {
    const { currentUser, userData, Modal } = useContext(AuthContext)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [statusButt, setstatusButt] = useState(false);
    const [ progress, setProgress ] = useState(false)

    const [ pic, setPic ] = useState("")
    const [ loadingPic, setLoadingPic ] = useState("true")
    const [ changeName, setchangeName ] = useState("")

    const [ collapse, setCollapse ] = useState(true)


    const QueueOrderedDESC =  _.orderBy(userData.queue, ["Date", "Time"], ["desc", "desc"])// เรียงวันล่าสุดมาก่อน
    const FilterByDone = _.filter(QueueOrderedDESC, ['status', "Done"])// Filter หาที่มี status เป็น Done
        const FilterReviewed = FilterByDone.filter(item => {
        return ![{totalStar: null}].some(NullStar => NullStar.totalStar === item.Review.totalStar)
    })// Different หาคืวที่มีการให้คะแนนแล้ว เพื่อจะเอาไปแสดงในช่องรีวิว
            const sumStar = FilterReviewed.reduce((prev, item)=>{
                return(item.Review.totalStar + prev )
            }, 0)// sum star ที่งหมด
                const finalStar = (sumStar/FilterReviewed.length).toFixed( 1 ) // หารให้เต็ม 5 

    const Style = {
        Header: {
            height: "8vh",
            background: '#595959'
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            minHeight: "91vh"
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

    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

    const handlechangeName =  (e) => {
        setchangeName(e.target.value)
    }

    const submitNewName = async (e) => {
        e.preventDefault();

        setProgress(true)
        setstatusButt(true)

        try{

            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()
            // console.log(objDoc)

           const obj = {
               ...objDoc,
               displayName: changeName
           }
            await userRef.set(obj)

            setTimeout(() => {
                setchangeName('')

                setIsModalVisible(false);
                setProgress(false)
                setstatusButt(false)
            }, 1000);
            

        } catch(err) {
            console.log(err)
        }
        
    }

    const showModal = (e) => {
        setIsModalVisible(true);
        };
    const handleCancel = () => {
        setIsModalVisible(false);
        };
    
    const toggleCollapsed = () => {
        setCollapse(!collapse)
    }

    useEffect(() => {
    //   console.log()

      if(userData.role){
        storage.child(userData.role + "/" + currentUser.uid + "/ProfilePic.jpg")
        .getDownloadURL()
        .then((url) => {
            setPic(url)
        // This can be inserted into an <img> tag
      }).catch((err) => {
        console.log(err)
      });
    } 
      
      tempPic()
    }, [])
    
    return (
        <div style={{textAlign: "center"}}>
            <div className="container-fluid text-right " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
                <div  className="row">
                    <div className="col-2 ">
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
                            defaultSelectedKeys={["1"]}
                            defaultOpenKeys={["sub1"]}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed={collapse}
                            >
                                <Menu.Item key="1" icon={<PieChartOutlined />}>
                                    <a href="/admin" className="text-light" style={{textDecoration: "none"}}>
                                        เปลี่ยนรูป 
                                    </a>
                                </Menu.Item>

                                <Menu.Item key="2" onClick={showModal} icon={<DesktopOutlined />}>
                                        เปลี่ยนชื่อ
                                </Menu.Item>

                                {userData.role === "employee"? (
                                    <Menu.Item key="3" icon={<ContainerOutlined />}>
                                        <a href="/masssagelists" className="text-light" style={{textDecoration: "none"}}>
                                            จัดการรายการนวด 
                                        </a>
                                    </Menu.Item>
                                ) : (null)}
                            </Menu>
                        </div>
                    </div>

                    <div className="col-10 border border-danger">
                        <div className="row">
                            <div className="col-12 my-5 text-left">
                              <h3>ข้อมูลของฉัน</h3>  
                              <Divider />
                            </div>

                            <div className="col-5">
                                {pic ? (
                                    loadingPic ? null : ( <img src={pic} style={{width: "70%"}} />) 
                                )  
                                : (
                                    loadingPic ? null : ( <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" style={{width: "10%"}}/> ) 
                                )}
                                
                            </div>
                            <Divider type="vertical" style={{border: "1px solid rgb(240, 240, 240)", height: "40vh"}}/>

                            <div className="col-6 pl-5 ">
                                <Descriptions title="" className="" style={{marginLeft: "10vh"}}>
                                    <Descriptions.Item label="ชื่อผู้ใช้">{ userData? userData.displayName : null}</Descriptions.Item><br/><br/>
                                    <Descriptions.Item label="อายุ">{userData.age? userData.age : "NaN"}</Descriptions.Item><br/><br/>
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

                                <Descriptions title="" className="mt-4" style={{marginLeft: "10vh"}}>
                                    <Descriptions.Item label="Email">{currentUser.email.slice(0,1)+"***"+currentUser.email.slice(4)}</Descriptions.Item><br/><br/>
                                    <Descriptions.Item label="UID">{ userData? userData.uid.slice(0,6)+"***"+userData.uid.slice(9) : null }</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>
                        
                    {/* still have unset picture delay */}

                        <Modal
                            title="เปลี่ยนชื่อ"
                            visible={isModalVisible}
                            onOk={(e)=>submitNewName(e)}
                            onCancel={()=>handleCancel()}
                            closable={false}
                            okButtonProps={ statusButt }
                            cancelButtonProps={ statusButt }
                            footer={[
                                <Button key="back" loading={statusButt} onClick={()=>handleCancel()}>
                                  ย้อนกลับ
                                </Button>,
                                <Button key="submit" type="primary" loading={statusButt} onClick={(e)=>submitNewName(e)}>
                                  ตกลง
                                </Button>,
                              ]}
                        >
                            <div className="text-center">
                                <input type="text" value={changeName} onChange={(e) => handlechangeName(e)} placeholder="ชื่อที่ต้องการเปลี่ยน" />

                                {progress ? (
                                    <div className="text-center">
                                        <div className="spinner-border mt-5 my-3" role="status"/><br/>
                                        <span className="">Uploading...</span>
                                    </div>
                                    
                                ) : null}
                            </div>
                        </Modal>
                    </div>

                </div>

                
            </div>
        </div>
    )
}

export default Profile
