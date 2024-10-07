import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketState';
import { useNavigate } from 'react-router-dom';

const Home1 = () => {
    const [room, setRoom] = useState("");

    const navigate = useNavigate();

    const {socket} = useSocket();

    const urgent = async ()=>{
        const response = await fetch("/api/auth/getuser",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        })
        const data = await response.json();
        console.log(data);
    }

    useEffect(() => {
        if(localStorage.getItem("token")){
            urgent();
        }
        else{
            navigate('/');
        }
    }, [navigate])


    const handleSubmit = (e)=>{
        e.preventDefault();

        socket.emit("join-room", {room});
    }

    const handleRoomJoined = useCallback((data) =>{
        const {room} = data;
        navigate(`/room/${room}`);
    },[navigate])

    useEffect(()=>{
        socket.on("joined-room", handleRoomJoined)
        return() =>{
            socket.off("joined-room", handleRoomJoined)
        }
    }, [handleRoomJoined, socket]);

    const handleChange2 = (e)=>{
        setRoom(e.target.name = e.target.value);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" value={room} placeholder='Enter room code here' onChange={handleChange2} className="form-control" id="room" name='room' />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default Home1
