import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import ImageCropper from './ImageCropper'

import { AuthContext } from "./Auth"

function AdminPage() {
    const { currentUser, userData, Modal } = useContext(AuthContext)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [statusButt, setstatusButt] = useState({ disabled: false });

    const [pic, setPic] = useState("")

    const [ file, setFile ] = useState("")

    const [blob, setBlob] = useState(null)
    const [inputImg64, setinputImg64] = useState('')

    const [ loadingPic, setLoadingPic ] = useState(true)
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
        
        if(file){
            const isLt2M = file.size / 1024 / 1024 > 5;
            if (!isLt2M) {
                setFile(file)

                const reader = new FileReader()
        
                reader.onload = () => {
                    setinputImg64(reader.result)
                    // รูปที่ encode เป็น base64 แล้ว
                }
        
                if (file) {
                    reader.readAsDataURL(file)
                    setIsModalVisible(true);
                } 
            } else{ alert('Image must smaller than 5MB!')}
        } else{ return null}
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
            setstatusButt({ disabled: true })

            uploadTask.on(
                "state_changed", 
                ()=>{},
                (error) => {
                    console.log(error)
                },
                () => {
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

                        setTimeout(() => {
                            setinputImg64("")

                            setIsModalVisible(false); 
                            setProgress(false)
                            setstatusButt({ disabled: false })
                        }, 2000);
                            
                        
                    })
                    
                }
            )
        } else{
            console.log("no upload")
        }
    }

    // const showModal = () => {
    //     setIsModalVisible(true);
    //   };
    
    //   const handleOk = () => {
    //     setIsModalVisible(false);
    //   };
    
      const handleCancel = () => {
        setIsModalVisible(false);
        // setFile("")
      };

    // useEffect(() => {
    //     // console.log(currentUser)
    //     // console.log(userData)
    //     console.log(file)
    // }, [file])

    useEffect(() => {
        tempPic()
    }, [])

    // storage.child(userData.role + "/" + currentUser.uid + "/ProfilePic.jpg")
    //     .getDownloadURL()
    //     .then((url) => {
    //         setPic(url)
    //     // This can be inserted into an <img> tag
    //   }).catch((err) => {
    //     console.log(err)
    //   });
    

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
             {/* <div className="container-fluid text-right border border-danger " style={Style.Header} >
             <button className="mt-3 btn btn-info" >
                <a href="/profile" className="text-light" style={{textDecoration: "none"}}>
                Profile 
                </a>
            </button>
             </div> */}

             <div className="container-fluid mt-1 border border-danger" style={Style.Content}>
                 {/* {pic ? (
                    loadingPic ? null : ( <img src={pic} style={{width: "20%"}} />) 
                )  
                : (
                    loadingPic ? null : ( <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" style={{width: "10%"}}/> ) 
                )} */}

                <form>
                    <div className="custom-file">
                        <input
                            type="file"
                            // className="custom-file-input"
                            // id="customFile"
                            accept="image/*"
                            onChange={ onInputChange }
                        />

                    <input type="file" id="myfile" name="myfile"/>

                        {/* <label 
                            className="custom-file-label w-50 ml-5"
                            htmlFor="customFile">
                            {!file? <div>Browse Pic</div> : <div>{file.name}</div>}
                        </label> */}
                    </div>
                </form>
                
                <Modal
                    title="Crop Image"
                    visible={isModalVisible}
                    onOk={(e)=>handleSubmitImage(e)}
                    onCancel={handleCancel}
                    closable={false}
                    okButtonProps={ statusButt }
                    cancelButtonProps={ statusButt }
                >
                    {inputImg64 ? (
                        <ImageCropper getBlob={getBlob} inputImg64={inputImg64}/> 
                        ) : (
                            null
                        )
                    }
                    
                    {progress ? (
                        <div className="text-center">
                            <div className="spinner-border mt-5 my-3" role="status"/><br/>
                            <span className="">Uploading...</span>
                        </div>
                        
                    ) : null}
                </Modal>

             </div>
        </div>
    )
}

export default AdminPage
