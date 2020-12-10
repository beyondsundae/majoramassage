import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './cropImage'

const ImageCropper = ({ getBlob, inputImg64 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const onCropComplete = async (_, croppedAreaPixels) => {
        // console.log(croppedAreaPixels)
        const croppedImage = await getCroppedImg(
            inputImg64,
            croppedAreaPixels
        )
        getBlob(croppedImage)
        //ทุกครั้งที่ crop เปลี่ยนไป function getBlob จะทำงาน จะส่งต่า blob ไปหา parent 
    }

    return (
        /* need to have a parent with `position: relative` 
    to prevent cropper taking up whole page */
        <div className='cropper' style={{position: "relative", height: "500px"}}> 
            <Cropper
                image={inputImg64}
                crop={crop}
                zoom={zoom}
                showGrid={false}
                aspect={3 / 3.5}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </div>
    )
}

export default ImageCropper