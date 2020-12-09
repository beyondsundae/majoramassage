import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import ImageCropper from './ImageCropper'

import { AuthContext } from "./Auth"

function AdminPage() {
    const { currentUser, userData } = useContext(AuthContext)

    const [pic, setPic] = useState("")

    const [ file, setFile ] = useState("")

    const [blob, setBlob] = useState(null)
    const [inputImg, setInputImg] = useState('')

    const [ loadingPic, setLoadingPic ] = useState("true")
    const [ progress, setProgress ] = useState(false)

    const upPicRef = storage.child(userData.role + "/" + currentUser.uid )

    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

    const getBlob = (blob) => {
        // blob คือ ตัวไฟล์รูป ข้อมูลไฟล์รูปที่ได้มาจาก children 
        setBlob(blob)
    }

    const onInputChange = (e) => {
        // convert image file to base64 string
        const file = e.target.files[0]
        setFile(file)

        const reader = new FileReader()

        reader.onload = () => {
            setInputImg(reader.result)
            // รูปที่ encode เป็น base64 แล้ว
        }

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleSubmitImage = async (e) => {
        e.preventDefault()
        if( file ) {
            const fileName = "ProfilePic.jpg";
            const targetRef = upPicRef.child(fileName)
            const uploadTask = targetRef.put(blob, { contentType: blob.type })

            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()

            setProgress(true)

            uploadTask.on(
                "state_changed", 

                " ",

                (error) => {
                    console.log(error)
                },

                () => {
                    setProgress(false)
                    setInputImg("")
                    setFile("")

                    uploadTask
                    .snapshot
                    .ref
                    .getDownloadURL()
                    .then(( photoURL ) => {
                        const obj = {
                            ...objDoc,
                            urlPhoto: photoURL
                        }
    
                        userRef
                        .set(obj)
                    })
                    
                }
            )
        } else{
            console.log("no upload")
        }
    }

    // useEffect(() => {
    //     // console.log(currentUser)
    //     // console.log(userData)
    //     console.log(file)
    // }, [file])

    useEffect(() => {
        tempPic()
    }, [])

    storage.child(userData.role + "/" + currentUser.uid + "/ProfilePic.jpg")
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
                            onChange={ onInputChange }
                        />

                        <label 
                            className="custom-file-label w-50 ml-5"
                            htmlFor="custpmFile">
                            {!file? <div>Browse Pic</div> : <div>{file.name}</div>}
                        </label>
                    </div>

                        {
                            inputImg ? (
                            <ImageCropper getBlob={getBlob} inputImg={inputImg}/> 
                            ) : (
                                null
                            )
                        }

                    <div>
                        <button 
                            type="submit"
                            onClick={ handleSubmitImage }
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
             </div>
        </div>
    )
}

export default AdminPage
