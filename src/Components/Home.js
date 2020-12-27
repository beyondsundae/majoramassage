import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"
import Footer from "./Parts/Footer"

import { message } from "antd";

import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Home() {
    const { width, currentUser, userData, allEmployees, message } = useContext(AuthContext)
    const [ allFavorite, setAllFavorite ] = useState([])
    const [ myFavorite, setMyFavorite ] = useState([])

    const Style = {
        Header: {
            height: width < 500 ? "25vh" : "8vh",
            background: '#444B54'
        },
        preContent: {
            height: width < 500 ? "40vh" : "20vh",
            backgroundColor: "#ffa940",
            paddingLeft: "10%", 
            paddingRight: "10%",
        },
        Content: {
            height: width < 500 ? "62vh" : "71vh",
            // overflow: "auto",
            paddingLeft: "10%", 
            paddingRight: "10%",
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

{/* ////////////////////// message */}
    const msgError = (err) => {
        message.error({
            content: (<h5 className="mt-5">{err}</h5>), 
            duration: 3,
            style: {
                marginTop: '8vh',
            }})
    }

{/* ////////////////////// Get Allemployees */}
    useEffect(() => {
        let tempArr = []
        allEmployees.forEach((item) => {
           tempArr = [...tempArr, {createed:item.createed}]
        })
        setAllFavorite(tempArr)
    }, [])

{/* //////////////////////  Get myFav */}
    useEffect(() => {
        setMyFavorite(userData? (userData.Favorite) : [] )
    }, [userData])

    // useEffect(() => {
    //     console.log(myFavorite)
    // }, [myFavorite])
    
    return (
        <div>

{/* ////////////////////// Header */}
            <div className="container-fluid text-right" style={Style.Header}>
                <Header />
            </div>

{/* ////////////////////// Pre content*/}
            <div className="container-fluid pt-3" style={Style.preContent}>
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 ">
                        <h2 className="text-white" >
                            "น้อง - นวบ - นาบ" 
                        </h2>

                        <h5 className="text-white">
                            เป็นบริการนวดสำหรับท่านชาย จะมีน้องๆ น่ารักน่าเอาใจใส่ มาช่วยผ่อนคลายท่านชายทั้งทางกายและทางใจ เชิญท่านเลือกน้องๆ ได้เลย
                        </h5>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                        <img 
                        src="https://firebasestorage.googleapis.com/v0/b/majoramassage.appspot.com/o/logo%2Fbikini.svg?alt=media&token=bbc3e7b6-55cc-4fce-b1d5-d5cfb1c809b0"
                        style={{width: width < 800 ? (width < 500 ? ("30%") : ("65%")) : ("28%")}} />
                    </div>

                </div>
               
                
            </div>

{/* ////////////////////// Map create น้องๆ path */}
            <div className="container-fluid mt-1 text-center" style={Style.Content}>
            <h3 className="my-3 text-left">น้องๆ หมอนวดน่าสนใจ</h3>
                <div className="row text-center"> 
                {allEmployees.map((item, index) => {

                    const FilterByDone = _.filter(item.queue, ['status', "Done"])
                        const FilterReviewed = FilterByDone.filter(item => {
                            return ![{totalStar: null}].some(NullStar => NullStar.totalStar === item.Review.totalStar)
                            })// Different หาคืวที่มีการให้คะแนนแล้ว เพื่อจะเอาไปแสดงในช่องรีวิว
                                const sumStar = FilterReviewed.reduce((prev, item)=>{
                                    return(item.Review.totalStar + prev )
                                    }, 0)// sum star ที่งหมด
                                    const finalStar = (sumStar/FilterReviewed.length).toFixed( 1 ) // หารให้เต็ม 5 

                    return(
                        <>
                        <a href={"/em/" + item.createed} key={index}>
                             <div className="card mx-5 my-5 text-center" style={{width: "13rem"}} > 
                            {item.urlPhoto ? (
                                <img className="card-img-top" src={item.urlPhoto} />
                            ) : (
                                <img className="card-img-top" src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" />

                            )}
                            <div className="card-body text-left text-dark">
                                <h4 className="card-title">น้อง {item.displayName}</h4>
                                <p className="card-title">อายุ {item.age}</p>
                                <p className="card-title">จำนวนผู้เข้าใช้บริการ {FilterByDone === []? 0 : FilterByDone.length}</p>
                                    {FilterReviewed.length !== 0?(
                                        <p style={{color: "#ff6d75"}}>{finalStar}: { allEmployees? (<StyledRating
                                            className="mt-1"
                                            size="small"
                                            precision={0.1}
                                            value={finalStar}
                                            icon={<FavoriteIcon fontSize="inherit" />}
                                            readOnly
                                        />) : null}</p>):(<p>ยังไม่มีการรีวิว</p>)}
                            </div>

{/* ////////////////////// Favorite zone */}
                            <div className="text-right mr-3">
                                {userData? ( userData.role === "member"? (
                                    <StyledRating
                                        key={index}
                                        size="large"
                                        value={
                                            userData.role === "member"? (
                                                myFavorite.some((itemx)=>{
                                                    if(itemx.createed === item.createed){ return true } //Return True if there are in myFav
                                                })
                                            ) : false
                                        }
                                        max="1"
                                        precision={1}
                                        onChange={(event, newValue) =>{
                                            if(newValue === null){
                                                unFavAction(item, newValue, index)
                                            } else {
                                                FavAction(item, newValue, index)
                                            }
                                        }} //Initial is null After click is 1
                                        icon={<FavoriteIcon fontSize="inherit" />}
                                    /> 
                                ) : null) : null}
                                
                            </div>
                        </div>
                        </a>
                       </>
                    )
                })}
                 </div>   
            </div>

            <Footer/>
        </div>
    )
}

export default Home
