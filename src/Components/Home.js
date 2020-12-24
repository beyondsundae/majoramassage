import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import { message } from "antd";

import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Home() {
    const {width} = useWidth()

    const [ allFavorite, setAllFavorite ] = useState([])
    const [ myFavorite, setMyFavorite ] = useState([])
    const { currentUser, userData, allEmployees, message } = useContext(AuthContext)

    const Style = {
        Header: {
            height: width < 500 ? "25vh" : "8vh",
            background: '#444B54'
        },
        preContent: {
            height: width < 500 ? "30vh" : "30vh",
            backgroundColor: "mediumpurple"
        },
        Content: {
            height: width < 500 ? "62vh" : "61vh",
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
    
    useEffect(() => {
        setMyFavorite(userData? (userData.Favorite) : [] )
    }, [userData])

    // useEffect(() => {
    //     console.log(myFavorite)
    // }, [myFavorite])
    
    return (
        <div>

{/* ////////////////////// Header */}
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

{/* ////////////////////// Pre content*/}
            <div className="container-fluid mt-1 border border-danger" style={Style.preContent}>
                xxxx
            </div>

{/* ////////////////////// Map create น้องๆ path */}
            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
                <div className="row text-center"> 
                {allEmployees.map((item, index) => {
                    return(
                        <>
                        <a href={"/em/" + item.createed} key={index}>
                             <div className="card mx-5 my-5 text-center" style={{width: "13rem"}} > 
                            {item.urlPhoto ? (
                                <img className="card-img-top" src={item.urlPhoto} />
                            ) : (
                                <img className="card-img-top" src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" />

                            )}
                            <div className="card-body">
                                <h5 className="card-title">น้อง {item.displayName}</h5>
                                <h5 className="card-title">อายุ {item.age}</h5>
                            </div>

{/* ////////////////////// Favorite zone */}
                            <div className="text-right mr-3">
                                <StyledRating
                                    key={index}
                                    size="large"
                                    value={
                                        myFavorite.some((itemx)=>{
                                        if(itemx.createed === item.createed){ return true } //Return True if there are in myFav
                                    })
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
                            </div>
                            
                        </div>
                        </a>
                           
                       </>
                    )

                })}
                 </div>   
            </div>
        </div>
    )
}

export default Home

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