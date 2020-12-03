import { findByRole } from '@testing-library/react'
import React, { useContext, useEffect, useState } from 'react'
import app from "../Firebase/firebase"
import { storage } from "../Firebase/firebase"
import { AuthContext } from "./Auth"

function AdminPage() {
    const { currentUser, userData } = useContext(AuthContext)

    const [pic, setPic] = useState("")

    const [ file, setFile ] = useState("")
    const [ link, setLink ] = useState("")

    const [ loadingPic, setLoadingPic ] = useState("true")
    const [ progress, setProgress ] = useState(false)
    const [ spinner, setSpinner ] = useState("")

    const upPicRef = storage.child("employee/" + currentUser.uid )

    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

    useEffect(() => {
        // console.log(currentUser)
        // console.log(userData)
        console.log(file)
    }, [file])

    useEffect(() => {
        tempPic()
    }, [])

    const handleUpload = (e) =>{
        e.preventDefault()
        if(file){
            const fileName = "ProfilePic.jpg";
            const targetRef = upPicRef.child(fileName)
            const uploadTask = targetRef.put(file)
            setProgress(true)
            uploadTask.on(
                "state_changed",

                setSpinner(""),

                (error) => {
                    console.log(error)
                },

                () => {
                    setProgress(false)
                    uploadTask
                    .snapshot
                    .ref
                    .getDownloadURL()
                    .then(( photoURL ) => {
                        setLink(photoURL)
                    })
                }
            )
            // targetRef
            // .put(file)
            // .then((res)=>{
            //     console.log(res)
            //         res
            //         .ref
            //         .getDownloadURL()
            //         .then((photoURL) => {
            //             console.log(photoURL)
            //             setLink(photoURL)
            //         })
            // })
        } else{
            console.log("no upload")
        }
    }

    storage.child("employee/" + currentUser.uid + "/ProfilePic.jpg")
        .getDownloadURL()
        .then((url) => {
            setPic(url)
        // This can be inserted into an <img> tag
      }).catch((err) => {
        console.log(err)
      });
    

    const Style = {
        Header: {
            height: "7vh"
        },
        Content: {
            height: "92vh"
        }
    }

    return (
        <div className='text-center'>
             <div className="container-fluid text-right border border-danger " style={Style.Header} >
             <button className="mt-3 btn btn-info" >
                <a href="/profile" className="text-light" style={{textDecoration: "none"}}>
                Profile 
                </a>
            </button>
             </div>

             <div className="container-fluid mt-1 border border-danger" style={Style.Content}>
                 <div>Test get pic from storage </div>
                 {pic ? (
                    loadingPic ? null : ( <img src={pic} style={{width: "20%"}} />) 
                )  
                : (
                    loadingPic ? null : ( <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" style={{width: "10%"}}/> ) 
                )}

                <h1>Form</h1>
                <form>
                    <div className="custom-file">
                        <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            accept="image/*"
                            onChange={(e)=>{
                                const file = e.target.files[0]
                                setFile(file)
                                setLink("")
                            }}
                        />


                        <label 
                            className="custom-file-label"
                            htmlFor="custpmFile">
                            {!file? <div>Browse Pic</div> : <div>{file.name}</div>}
                        </label>
                    </div>

                    <div>
                        <button 
                            type="submit"
                            onClick={handleUpload}
                            className="btn btn-success my-5">
                                upload
                            </button><br/>

                            {progress ? (
                                <div className="spinner-border" role="status">
                                {/* <span className="sr-only">Loading...</span> */}
                              </div>
                            ) : null}
                    </div>
                </form>

                {/* {link? (
                    <div>
                        <hr/>
                        <img src={link} style={{width: "20%"}}/><br/>
                        <a href={link}>
                            Click {file.name}
                        </a>
                    </div>)
                    : null
            } */}
             </div>
        </div>
    )
}

export default AdminPage
