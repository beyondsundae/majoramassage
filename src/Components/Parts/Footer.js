// © 2020 Copyright: NongNuabNaab.com 
// By beyondsundae (Thanakrit)

// May the knowledge and Intention be with those who work hard ❤️ 

import React, { useContext } from 'react'
import { Avatar } from 'antd';

import { AuthContext } from "../Auth"
function Footer() {

    const { width, currentUser, userData, allEmployees } = useContext(AuthContext)

    const Style = {
        Footer: {
            height:  width < 500 ? "25vh" : "10vh",
            background: '#444B54'
        },
        
    }

    return (
        <div>
            <div className="container-fluid pt-3 mr-4 text-center" style={Style.Footer}>
          
                <strong className="px-4 text-white">
                © 2020 Copyright: NongNuabNaab.com 
                </strong><br/>
                <strong className="px-4 text-white">
                By beyondsundae (Thanakrit)
                </strong> 
                <a target="_blank" href="https://github.com/beyondsundae" >
                    <Avatar size="large" icon={<img 
                        src="https://avatars2.githubusercontent.com/u/59742129?s=60&v=4" 
                        className=""
                        alt="Beyondsundae"
                        />} />
                    
                </a><br/>
                <strong className="px-4 text-white">May the knowledge and Intention be with those who work hard ❤️ </strong>
           </div>
        </div>
    )
}

export default Footer
