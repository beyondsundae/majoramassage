import React, { useContext, useEffect, useState } from 'react'

import app, { firestore, storage } from "../Firebase/firebase"

import Header from "./Parts/Header"

import { AuthContext } from "./Auth"


function Profile() {
    const { currentUser, userData, Modal } = useContext(AuthContext)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [statusButt, setstatusButt] = useState({ disabled: false });
    const [ progress, setProgress ] = useState(false)

    const [ pic, setPic ] = useState("")

    const [ loadingPic, setLoadingPic ] = useState("true")

    const [ changeDName, setchangeDName ] = useState("")

    const Style = {
        Header: {
            height: "7vh"
        },
        // preContent: {
        //     height: "30vh"
        // },
        Content: {
            minHeight: "92vh"
        }
    }

    const tempPic = () => {
        setTimeout(() => {
            setLoadingPic(false)
        }, 1000);
    }

    const handleChangeDName =  (e) => {
        setchangeDName(e.target.value)
    }

    const submitNewName = async (e) => {
        e.preventDefault();

        setProgress(true)
        setstatusButt({ disabled: true })

        try{

            const userRef = firestore.collection("users").doc(userData.uid)

            const getDoc = await userRef.get()
            const objDoc = await getDoc.data()
            // console.log(objDoc)

           const obj = {
               ...objDoc,
               displayName: changeDName
           }
            userRef.set(obj)

            setTimeout(() => {
                setchangeDName('')

                setIsModalVisible(false);
                setProgress(false)
                setstatusButt({ disabled: false })
            }, 2000);
            

        } catch(err) {
            console.log(err)

        }
        
    }

    const showModal = (e) => {
        e.preventDefault();
        setIsModalVisible(true);
        };
    const handleCancel = () => {
        setIsModalVisible(false);
        };

    useEffect(() => {
    //   console.log(currentUser.email)
    //   console.log(pic)

      if(userData.role){
        storage.child(userData.role + "/" + currentUser.uid + "/ProfilePic.jpg")
        .getDownloadURL()
        .then((url) => {
            setPic(url)
        // This can be inserted into an <img> tag
      }).catch((err) => {
        console.log(err)
      });
    } 
      
      tempPic()
    }, [])
    
    return (
        <div style={{textAlign: "center"}}>
            <div className="container-fluid text-right border border-danger " style={Style.Header}>
                <Header />
            </div>

            <div className="container-fluid mt-1 text-center border border-danger" style={Style.Content}>
                {pic ? (
                    loadingPic ? null : ( <img src={pic} style={{width: "20%"}} />) 
                )  
                : (
                    loadingPic ? null : ( <img src="https://icons-for-free.com/iconfiles/png/512/instagram+person+profile+icon-1320184028516722357.png" style={{width: "10%"}}/> ) 
                )}
            {/* still have unset picture delay */}
            
                <h1>Profile</h1>
                <h2>{currentUser.email}</h2><br/>
                <button className="mt-3 btn btn-info" >
                    <a href="/admin" className="text-light" style={{textDecoration: "none"}}>
                    Admin 
                    </a>
                </button>
                <h1>Data Firestore</h1>
                <h2>uid: { userData? userData.uid : null }</h2>
                <h2>displayName: { userData? userData.displayName : null}</h2>
                <h2>email: { userData? userData.email : null}</h2>
                <h2>role: { userData? userData.role : null}</h2>
                <br/>

                <form onSubmit={(e) => showModal(e)}>
                    
                    <button className=" btn btn-success my-5" type='submit'>เปลี่ยนชื่อ</button>

                </form>
                <button className="btn btn-danger" onClick={() => {app.auth().signOut()}}>Log Out</button>

                <Modal
                    title="Change Name"
                    visible={isModalVisible}
                    onOk={(e)=>submitNewName(e)}
                    onCancel={()=>handleCancel()}
                    closable={false}
                    okButtonProps={ statusButt }
                    cancelButtonProps={ statusButt }
                >
                    <div className="text-center">
                        <input type="text" value={changeDName} onChange={(e) => handleChangeDName(e)} placeholder="New Name" />

                        {progress ? (
                            <div className="text-center">
                                <div className="spinner-border mt-5 my-3" role="status"/><br/>
                                <span className="">Uploading...</span>
                            </div>
                            
                        ) : null}
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Profile
