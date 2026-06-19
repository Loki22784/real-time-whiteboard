import {useState} from 'react'

import { useNavigate } from 'react-router-dom'

import { nanoid } from "nanoid";

import "./index.css"

const HomePage = () =>{
    const [joinId,setJoined] = useState("")
    const [userName,setUsername] = useState("")

    const navigate = useNavigate()

    const changed = event => {
        setJoined(event.target.value)
    }
    const changed1 = event => {
        setUsername(event.target.value)
    }

    const clicked_C = () => {
        if(userName.length === 0){
            alert("Enter User Name")
        } else {
            const roomId = nanoid(8);
            navigate(`/${roomId}`,{
                state : {
                    userName: userName,
                }
            });
        }
    }

    const clicked_E = () => {
        if(userName.length === 0){
            alert("Enter User Name")
        } else {
            navigate(`/${joinId}`,{
                state : {
                    userName: userName,
                }
            });
        }
    }
    return (
        <div className='bg'>
            <h1 className='he'>Real-Time Collaborative Whiteboard </h1>
            <div className='part1'>
                <label htmlFor="lo1" class>Enter User Name  </label>
                <input id ="lo1" type="text" placeholder='Enter Name' onChange={changed1}/>
            </div>
            <div className='part2'>
                <div className='part21'>
                    <h1 className='he2'>Creating Room</h1>
                    <button onClick={clicked_C}>create</button>
                </div>
                <div className='part21'>
                    <h1 className='he2'>Joining Room</h1>
                    <label htmlFor="lo">Enter Room ID  </label>
                    <input id ="lo" type="text" placeholder='.....' onChange={changed}/>
                    <button onClick={clicked_E}>Enter</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage