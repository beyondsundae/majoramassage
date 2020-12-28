// © 2020 Copyright: NongNuabNaab.com 
// By beyondsundae (Thanakrit)

// May the knowledge and Intention be with those who work hard ❤️ 

import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../../Firebase/firebase"

import { Avatar, Menu, Divider, Button, Badge } from "antd";
import { CaretDownFilled, ShoppingCartOutlined, ProfileOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
 
import { AuthContext } from "../Auth"

var _ = require('lodash');
function Header() {
    const { width, currentUser, userData, allEmployees } = useContext(AuthContext)

    const { SubMenu } = Menu;

    const Arrow = <CaretDownFilled style={{ fontSize: '20px'}}/>
    const Cart = <ShoppingCartOutlined style={{ fontSize: '30px' }}/>

    const FilterByNotDone = (userData? _.filter(userData.queue, ['status', "NotDone"]) : null ) // Filter หาที่มี status เป็น NotDone

    useEffect(() => {
        // console.log(userData.queue)
    }, [])

    return (
        <div className="row ">
                    <div className={width < 500 ? ("col-12 col-sm-2 col-md-5 col-lg-5 col-xl-9 text-center mt-2") : ("col-12 col-sm-2 col-md-5 col-lg-5 col-xl-9 text-left mt-2 pl-5") }>
                        <a href="/">
                            <img 
                            src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/logo%2Flogo1.png?alt=media&token=78babaac-7e6a-4c99-90bd-917e8258448f" 
                            style={{width: width < 800 ? ("60%") : ("15%")}}    />
                        </a>
                    </div>

{/* ////////////////////// Cart */}
                    <div className="col-1 col-sm-2 col-md-2 pl-4 col-lg-2 col-xl-1" style={{left: (width < 500 ? ("-20px") : ("60px") )}}>
                        {userData? (
                            <>
                                <Button size="large" className="mt-2 pt-3 mb- mr-4 text-white" style={{ border: "1px solid transparent", background: 'transparent'}}>
                                    <a href="/booking">
                                        <Badge className="text-white" count={FilterByNotDone.length}>
                                            {Cart}
                                        </Badge>
                                    </a>
                                </Button>
                            </>
                        ) : (null)}
                            
                    </div>

{/* ////////////////////// Menu Profile */}
                        <div className="col-10 col-sm-2 col-md-5 pl-3 col-lg-5 col-xl-2">
                                {currentUser? (
                                    <Menu
                                        mode="horizontal"
                                        className="mr-5 mt-2 text-right "
                                        style={{border: "1px solid transparent", background: 'transparent', color: "white", paddingLeft: (width < 500 ? ("130px") : ("120px") )}}
                                    > 
                                        <SubMenu key="SubMenu" 
                                            icon={
                                                <div className="d-inline ">
                                                    {userData? (<Avatar src={userData.urlPhoto} size="large" shape="square" />) : null}
                                                    
                                                    {(userData? ( 
                                                        userData.role == "employee" ? (
                                                            <p className="d-inline ml-2 text-white">น้อง  { userData.displayName} </p> ) : (
                                                            <p className="d-inline ml-2 text-white">คุณ  { userData.displayName} </p>)): null)}
                                                </div>} 
                                            title={<div className="d-inline ml-2">{Arrow}</div>}>
                                                <Menu.Item key="setting:1" ><a href="/profile"><ProfileOutlined /> โปรไฟล์</a></Menu.Item>
                                                <Menu.Item key="setting:2" onClick={() => {app.auth().signOut().then(() => window.location.reload())}}><LogoutOutlined /> Log out</Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                ) : (
                                    <p className="mt-4 mr-4">
                                        <a href="/login" className="mr-4 text-white">
                                           <LoginOutlined /> เข้าสู่ระบบ
                                        </a>
                                        <a href="/register" className="mr-2 text-white">
                                           <LoginOutlined /> สมัครบัญชี
                                        </a>
                                    </p>
                                )}
                        </div>
                </div>
    )
}

export default Header
