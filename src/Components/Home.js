import React, { useContext, useEffect, useState } from 'react'

import app, { firestore } from '../Firebase/firebase'

import Header from "./Parts/Header"

import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

import { AuthContext } from "./Auth"

function Home() {

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

    const AddFav = () => {

    }

    const SubFav = () => {
        
    }


    useEffect(() => {
        let tempArr = []
        allEmployees.forEach((item) => {
           tempArr = [...tempArr, {created:item.createed}]
        })

        setMyFavorite(tempArr)
    }, [])
    
    useEffect(() => {
        console.log(userData.Favorite) 
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
                        <a href={"/em/" + item.createed} key={index}>
                             <div className="card mx-5 my-5 text-center" style={{width: "13rem"}} > 
                            {item.urlPhoto ? (
                                <img className="card-img-top" src={item.urlPhoto} />
                            ) : (
                                <img className="card-img-top" src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" />

                            )}
                            <div className="card-body">
                                <h5 className="card-title">น้อง{item.displayName}</h5>
                            </div>

                            <div className="text-right mr-3">
                                <StyledRating
                                    size="large"
                                    // value=""
                                    max="5"
                                    precision={1}
                                    onChange={(event, newValue) =>{console.log(newValue === 1? ("1") : ("0"))}}
                                    icon={<FavoriteIcon fontSize="inherit" />}
                                    /> 
                            </div>
                            
                        </div>
                        </a>
                       
                    )

                })}
                 </div>   
            </div>
        </div>
    )
}

export default Home
