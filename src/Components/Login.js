// © 2020 Copyright: NongNuabNaab.com 
// By beyondsundae (Thanakrit)

// May the knowledge and Intention be with those who work hard ❤️ 

import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'

import app from "../Firebase/firebase"

import Header from "./Parts/Header"
import Footer from "./Parts/Footer"

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { AuthContext } from "./Auth"

const Login = () => {
    const { currentUser, message, width } = useContext(AuthContext)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ loading, setLoading ] = useState(true)

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
            paddingLeft: width < 800 ? ("none") : ("10%"), 
            paddingRight: width < 800 ? ("none") : ("10%"), 
        }
    }

{/* //////////////////////  Message */}
    const msgSuccess = (item) => {
        message.success({
            content: (<h5 className="mt-5">{item}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
            }})
            .then()
    }

    const msgError = (err) => {
        message.error({
            content: (<h5 className="mt-5">{err}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
            }})
    }

    const handleLogin = async () => {
        try{
            await app
            .auth()
            .signInWithEmailAndPassword( email, password)
            .then(() => {
                setLoading(true)
                msgSuccess("ยินดีต้อนรับ")
            })

            // setTimeout(() => {
                setLoading(false)
            // }, 2000)
        }
        catch(err){
            setPassword(" ")
               msgError(err.message) 
            
        }
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    useEffect(() => {
        // setTimeout(() => {
            setLoading(false)
        // }, 500);
    }, [])

    if( currentUser ){
        return <Redirect to="/" />
    }

    if ( loading ){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    <img 
                        src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/loading%2F78e826ca1b9351214dfdd5e47f7e2024.gif?alt=media&token=38b92308-51b2-4574-a027-227975ba44ac"
                        style={{width: width < 800? ("100%") : ("50%")}}
                        />
                </h1>
            </div>
        )
    }

    return (
        <div>
            <div className="container-fluid text-right" style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 pt-3 text-center " style={Style.Content}>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-6 order-last order-sm-first" style={{background: '#444B54'}}>
                    <img 
                        className=""
                        src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/logo%2Fmassage.svg?alt=media&token=91738933-8495-4723-94f2-5f6f3d98ffdc" 
                        style={{width: width < 500 ? ("60%") : ("90%"), paddingTop: "50px"}}
                        />
                    </div>

                    <div className="col-12 col-md-6 col-lg-6 order-first order-sm-last" style={{height: "90vh"}}>
                        <img 
                            className="mt-5"
                            src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/logo%2Flogo2.png?alt=media&token=7447933b-890f-4ddf-947f-ba7a455cb7cb" 
                            style={{width: width < 800 ? ("60%") : ("70%")}}   
                        />

                        <div className="mt-5">
                            <h1>เข้าสู่ระบบ</h1>
                        </div>

                        <div className="text-center mt-5">
                            <Form
                                style={{width: "50%"}}
                                name="basic"
                                onFinish={handleLogin}
                                onFinishFailed={onFinishFailed}
                                className="mx-auto"
                                >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'กรุณากรอกอีเมลให้ถูกต้อง',
                                          },
                                          {
                                            required: true,
                                            message: 'กรุณากรอกอีกเมล',
                                          },
                                    ]}
                                    onChange={(e)=>{setEmail(e.target.value)}}
                                >
                                    <Input 
                                        prefix={<UserOutlined className="site-form-item-icon" />} 
                                        placeholder="อีเมล"/>
                                        
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'กรุณากรอกรหัสผ่าน',
                                    },
                                    ]}
                                    onChange={(e)=>{setPassword(e.target.value)}}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input.Password  
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="รหัสผ่าน" 
                                        
                                     />
                                </Form.Item>

                                <Form.Item className="text-right">
                                    <a  href="#/forgot">
                                        ลืมรหัสผ่านใช่หรือไม่ ?
                                    </a>
                                </Form.Item>

                                <Form.Item > 
                                    <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                                        ลงชื่อเข้าใช้
                                    </Button><br/>
                                        หรือ ? <a href="#/register">สมัครตอนนี้เลย!</a>
                                </Form.Item>
                            </Form>
                        </div>
                        
                    </div>
                </div>

                <div className="mt-5">
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Login
