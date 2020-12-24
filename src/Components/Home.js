import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

import { AuthContext } from "./Auth"

var _ = require('lodash');
function Home() {

    const [ allFavorite, setAllFavorite ] = useState([])
    const [ myFavorite, setMyFavorite ] = useState([])
    const { currentUser, userData, allEmployees } = useContext(AuthContext)

    const Style = {
        Header: {
            height: "7vh",
            background: '#595959'
        },
        preContent: {
            height: "30vh"
        },
        Content: {
            height: "62vh",
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
    
            // setMyFavorite(Filtered)
            
            const obj = {
               ...objDoc,
                Favorite: Filtered
            }

            await userRef.set(obj)

                // setchangeName('')

                // setIsModalVisible(false);
                // setProgress(false)
                // setstatusButt(false)
            

        } catch(err) {
            console.log(err)
        }
    }

    const FavAction = async (item, newValue, index) => {
        

        try{
            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()

            let tempArrx = [...myFavorite]
        
            tempArrx = [ ...tempArrx,  {createed: item.createed}]
            // setMyFavorite(tempArrx)
            
            const obj = {
               ...objDoc,
                Favorite: tempArrx
            }

            await userRef.set(obj)

                // setchangeName('')

                // setIsModalVisible(false);
                // setProgress(false)
                // setstatusButt(false)
            

        } catch(err) {
            console.log(err)
        }
        
    }

    useEffect(() => {
        let tempArr = []
        allEmployees.forEach((item) => {
           tempArr = [...tempArr, {createed:item.createed}]
        })
        setAllFavorite(tempArr)

    }, [])
    
    useEffect(() => {
        setMyFavorite(userData.Favorite)
    }, [userData])

    useEffect(() => {
        console.log(myFavorite)
    }, [myFavorite])
    
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
                                <h5 className="card-title">น้อง{item.displayName}</h5>
                                {item.createed}
                            </div>

                            <div className="text-right mr-3">
                                <StyledRating
                                    key={index}
                                    size="large"
                                    value={
                                        myFavorite.some((itemx)=>{
                                        if(itemx.createed === item.createed){
                                            return true
                                        }
                                    })
                                }
                                    max="1"
                                    precision={1}
                                    onChange={(event, newValue) =>{
                                        console.log(newValue)
                                        if(newValue === null){
                                            unFavAction(item, newValue, index)
                                        } else {
                                            FavAction(item, newValue, index)
                                        }
                                        

                                        // if(newValue !== 1){
                                        //     setTempFav((prev)=>[...prev, {creted: item.createed}])
                                        // } else {
                                        //     SubFav(item, newValue, index)
                                        // }
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
