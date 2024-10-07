import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketState';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'

const Home = (e) => {
    const [code, setCode] = useState("");
    const [room1, setRoom1] = useState("");
    const [room2, setRoom2] = useState("");
    // const [arr, setArr] = useState([]);

    const navigate = useNavigate();

    const {socket} = useSocket();

    const handleCode = () => {
        const minm = 11111
        const maxm = 99999
        const code = Math.floor(Math.random() * (maxm - minm + 1)) + minm
        setCode(code);
    }

    const handleCreate = () => {
        const change1 = document.getElementById("b1");
        const change2 = document.getElementById("b2");

        change1.style.backgroundColor = "bisque";
        change1.style.color = "black";

        change2.style.backgroundColor = "white";
        change2.style.color = "black";

        const dis = document.getElementById("b4");
        dis.style.display = "block";

        const dis1 = document.getElementById("b5");
        dis1.style.display = "none";
    }

    const handleJoin = () => {
        const change1 = document.getElementById("b1");
        const change2 = document.getElementById("b2");

        change2.style.backgroundColor = "bisque";
        change2.style.color = "black";

        change1.style.backgroundColor = "white";
        change1.style.color = "black";

        const dis = document.getElementById("b4");
        dis.style.display = "none";

        const dis1 = document.getElementById("b5");
        dis1.style.display = "block";

    }

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


    const handleSubmit1 = (e)=>{
        e.preventDefault();
        const room = room1;
        socket.emit("join-room", {room});
        // const room1 = document.getElementById("createRoom")
        // const room = parseInt(room1.value);
        // console.log(room, code);
        // if(room===code){
        //     const ar = arr;
        //     ar.push(room);
        //     setArr(ar);
        //     socket.emit("join-room", {room});
        // }
        // else{
        //     alert("invalid code");
        // }
    }

    const handleSubmit2 = (e)=>{
        e.preventDefault();
        console.log("yes")
        const room = room2;
        socket.emit("join-room",{room});
        // const room1 = document.getElementById("joinRoom");
        // const room = parseInt(room1.value);
        // const ar = arr;
        // console.log(arr);
        // let flag = false;
        // for(let i=0; i<ar.length; i++){
        //     if(ar[i]===room){
        //         console.log("yes");
        //         ar.splice(i, 1);
        //         setArr(ar);
        //         console.log(arr);
        //         flag = true;
        //         socket.emit("join-room", {room});
        //         break;
        //     }
        // }
        // if(!flag){
        //     alert("invalid code");
        // }
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

    const handleChange1 = (e)=>{
        setRoom1(e.target.name = e.target.value);
    }

    const handleChange2 = (e)=>{
        setRoom2(e.target.name = e.target.value);
    }


    return (
        <>
            <Navbar />
            <div className='box1'>
                <div className='box2'>
                    <div className="box3">
                        <div className="cbox1" id='b1' onClick={handleCreate}>Create</div>
                        <div className="cbox2" id='b2' onClick={handleJoin}>Join</div>
                    </div>
                    <div className="box4" id='b4'>

                        <div className="container">
                            <div>
                                <input placeholder='click on "Code"' value={code} readOnly className="form-control edit" type="text" />
                                <button type="button" onClick={handleCode} className="btn btn-primary edit2">Code</button>
                            </div>
                            <div className="some"></div>
                            
                            <form onSubmit={handleSubmit1}>
                                <div className="mb-3">
                                    <input type="text" value={room1} placeholder='Enter room code here' onChange={handleChange1} className="form-control" id="createRoom" name='createRoom' />
                                </div>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </form>

                        </div>
                    </div>
                    <div className="box5" id='b5'>
                        <div className="container">

                            <form onSubmit={handleSubmit2}>
                                <div className="mb-3">
                                    <input type="text" value={room2} placeholder='Enter room code here' onChange={handleChange2} className="form-control" id="joinRoom" name='joinRoom' />
                                </div>
                                <button type="submit" className="btn btn-primary">Join</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
