import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Redirect } from 'react-router'

import app, { firestore }  from "../Firebase/firebase"

import Header from "./Parts/Header"

import { Form, Input, Button, Radio  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { AuthContext } from "./Auth"

const Register = ( {history} ) => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ role, setRole ] = useState(null)

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

    const handleRegister = async () => {

        if(role == null){
            alert(" plz select role")
        } else {
            try{
                await app
                .auth()
                .createUserWithEmailAndPassword( email, password)
                .then( async (result) => {
                    if( result ){
                        const userRef = firestore.collection("users")
                        .doc(result.user.uid)
    
                        const doc = await userRef.get()
                        if(!doc.data()) {
                            if( role == "member"){
                                await userRef.set({
                                    uid: result.user.uid,
                                    displayName: result.user.email
                                        .substring(0, email.lastIndexOf("@")),
                                    email: result.user.email,
                                    createed: new Date().valueOf(),
                                    role: role,
                                    urlPhoto: "https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png",
                                    Favorite: [],
                                    queue: []
                                })
                            setLoading(true)

                            } else if ( role == "employee"){
                                    await userRef.set({
                                        uid: result.user.uid,
                                        displayName: result.user.email
                                            .substring(0, email.lastIndexOf("@")),
                                        email: result.user.email,
                                        createed: new Date().valueOf(),
                                        role: role,
                                        urlPhoto: "https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png",
                                        age: 0,
                                        star: 0,
                                        listMassage:[],
                                        queue:[]
                                    })
                                setLoading(true)
                            }
                        }
                    }
                })
            } 
            catch(error) {
                console.log(error)
    
                if(error.code == "auth/email-already-in-use"){
                    setLoading(true)
                    alert(error.message) 
                    
                    setTimeout(() => {
                        setLoading(false)
                        history.push("/login")
                    }, 2000);
                    
                } else {
                    alert(error.message)
                }
            }
        } 
    }

    const onRadioChange = e => {
        setRole(e.target.value);
      };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [])

    useEffect(() => {
        console.log(role)

    }, [role])

    if( currentUser ){
        return <Redirect to="/" />
    }

    if(loading){
        return(
            <div style={{textAlign: "center", marginTop: "150px"}}>
                <h1>
                    <div className="spinner-border" role="status">
                    </div>

                    <div className="mt-5">Loading . . . . (Register)</div>
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

                        <h1>สมัครบัญชี</h1>

                        <div className="text-center mt-5">
                            <Form
                                style={{width: "50%"}}
                                name="basic"
                                onFinish={handleRegister}
                                onFinishFailed={onFinishFailed}
                                className="mx-auto"
                                >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { type: 'email', message: 'กรุณากรอกอีเมลให้ถูกต้อง' },
                                        { required: true, message: 'กรุณากรอกอีกเมล' },
                                    ]}
                                    onChange={(e)=>{setEmail(e.target.value)}}
                                >
                                    <Input 
                                        prefix={<UserOutlined className="site-form-item-icon" />} 
                                        placeholder="อีเมล"/>
                                        
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    hasFeedback
                                    rules={[
                                    { required: true, message: 'กรุณากรอกรหัสผ่าน', },
                                    { min: 6, message: 'รหัสผ่านขั้นต่ำ 6 ตัวอักษร' },
                                    ]}
                                    onChange={(e)=>{setPassword(e.target.value)}}
                                >
                                    <Input.Password  
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="รหัสผ่าน" 
                                        
                                     />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    dependencies={["password"]}
                                    hasFeedback
                                    rules={[
                                    { required: true, message: "กรุณากรอกรหหัสผ่าน" },
                                    { min: 6, message: 'รหัสผ่านขั้นต่ำ 6 ตัวอักษร' },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            "รหัสผ่านไม่ตรงกัน"
                                        );
                                        }
                                    })
                                    ]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="ยืนยันรหัสผ่าน" 
                                    />
                                </Form.Item>

                                <Radio.Group onChange={onRadioChange} value={role} className="mb-3 text-left">
                                    <Radio value="member">Register as member</Radio>
                                    <Radio value="employee">Register as employee</Radio>
                                </Radio.Group>

                                <Form.Item > 
                                    <Button type="primary" htmlType="submit" style={{width: "300px"}}>
                                        สมัครเลย !
                                    </Button><br/>
                                        มีบัญชีอยู่แล้ว ? <a href="/login">ลงชื่อเข้าใช้เลย !</a>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
