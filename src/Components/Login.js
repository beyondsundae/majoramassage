import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'

import app from "../Firebase/firebase"

import Header from "./Parts/Header"

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { AuthContext } from "./Auth"

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ loading, setLoading ] = useState(true)

    const { currentUser } = useContext(AuthContext)

    const Style = {
        Header: {
            height: "7vh",
            background: '#444B54'

        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            minHeight: "92vh",
            paddingLeft: "15%", 
            paddingRight: "15%"
        }
    }

    const handleLogin = async () => {
        // event.preventDefault();
        
        try{
            await app
            .auth()
            .signInWithEmailAndPassword( email, password)
            .then()
            setLoading(true)

            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }
        catch(error){
            setPassword(" ")
            alert(error)
        }
    }
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [])

    if( currentUser ){
        return <Redirect to="/" />
    }

    if ( loading ){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    <div className="spinner-border" role="status">
                    </div>

                    <div className="mt-5">Loading . . . . (Login)</div>
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
                    <div className="col" style={{background: '#444B54'}}>
                    <img 
                            className=""
                            src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/logo%2Fmassage.svg?alt=media&token=91738933-8495-4723-94f2-5f6f3d98ffdc" 
                            // style={{width: width < 800 ? ("60%") : ("15%")}}    
                            style={{width: "90%", paddingTop: "50px"}}
                        />
                    </div>

                    <div className="col" style={{height: "90vh"}}>
                        <img 
                            className="mt-5"
                            src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/logo%2Flogo2.png?alt=media&token=7447933b-890f-4ddf-947f-ba7a455cb7cb" 
                            // style={{width: width < 800 ? ("60%") : ("15%")}}    
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
                                    <a  href="">
                                        ลืมรหัสผ่านใช่หรือไม่ ?
                                    </a>
                                </Form.Item>

                                <Form.Item > 
                                    <Button type="primary" htmlType="submit" style={{width: "300px"}}>
                                        ลงชื่อเข้าใช้
                                    </Button><br/>
                                        หรือ ? <a href="/register">สมัครตอนนี้เลย!</a>
                                </Form.Item>
                            </Form>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Login
