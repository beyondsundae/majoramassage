import React, { useEffect, useContext, useState } from 'react'

import app, { firestore, storage } from "../../Firebase/firebase"

import { Avatar, Menu, Divider, Button, Badge } from "antd";
import { CaretDownFilled, ShoppingCartOutlined } from "@ant-design/icons";
 
import { AuthContext } from "../Auth"

var _ = require('lodash');
function Header() {
    const {width} = useWidth()
    const breakPoint = 500

    const { SubMenu } = Menu;

    const [ pixelValue, setPixelValue ] = useState("")

    const Arrow = <CaretDownFilled style={{ fontSize: '20px'}}/>
    const Cart = <ShoppingCartOutlined style={{ fontSize: '30px' }}/>

    const { currentUser, userData, allEmployees } = useContext(AuthContext)

    const FilterByNotDone = _.filter(userData.queue, ['status', "NotDone"])// Filter หาที่มี status เป็น NotDone

    useEffect(() => {
        

    }, [])

    return (
        <div className="row ">
                    <div className="col- col-sm-2 col-md-5 col-lg-5 col-xl-9">
                    </div>

                    <div className="col-3 col-sm-2 col-md-2 pl-4 col-lg-2 col-xl-1 " style={{left: (width < 500 ? ("-20px") : ("190px") )}}>
                            <Button size="large" className="mt-2 pt-3 mb- mr-4 text-white" style={{ border: "1px solid transparent", background: 'transparent'}}>
                                <a href="/booking" >
                                    <Badge className="text-white" count={FilterByNotDone.length}>
                                        {Cart}
                                    </Badge>
                                </a>
                            </Button>
                    </div>

                        <div className="col-9 col-sm-2 col-md-5 pl-3 col-lg-5 col-xl-2" >
                            <div className="">
                                {currentUser? (
                                    <Menu
                                    // onClick={this.handleClick}
                                    // selectedKeys={[current]}
                                    mode="horizontal"
                                    className="mr-5 mt-2 text-right "
                                    style={{border: "1px solid transparent", background: 'transparent', color: "white", paddingLeft: (width < 500 ? ("115px") : ("150px") )}}
                                    > 
                                        <SubMenu key="SubMenu" 
                                        icon={
                                            <div className="d-inline ">
                                                <Avatar src={userData.urlPhoto} size="large" shape="square" />
                                                {(userData? ( 
                                                    userData.role == "employee" ? (
                                                        <h4 className="d-inline ml-2 text-white">น้อง  { userData.displayName} </h4> ) : (
                                                        <p className="d-inline ml-2 text-white">คุณ  { userData.displayName} </p>)): null)}
                                            </div>} 
                                        title={<div className="d-inline ml-2">{Arrow}</div>}>
                                            <Menu.Item key="setting:1" ><a href="/profile"  >โปรไฟล์</a></Menu.Item>
                                            <Menu.Item key="setting:2" onClick={() => {app.auth().signOut()}}>Log out</Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                ) : (
                                    <button className="mt-3 btn btn-info " >
                                        <a href="/login" className="text-light" style={{textDecoration: "none"}}>
                                            Log In
                                        </a>
                                    </button>
                                )}
                            </div>
                        </div>
                </div>
    )
}

export default Header

const useWidth = () => {
    const [ width, setWidth ] = useState(window.innerWidth)

    const widthHandler =()=>{
        setWidth(window.innerWidth)
    }

    useEffect(()=>{
        window.addEventListener("resize", widthHandler)

        return()=>{
            window.removeEventListener("resize", widthHandler)
        }
    }, [])

    return { width };
}