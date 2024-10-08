import React, { useState, useEffect, useCallback } from 'react'
import Navbar from './Navbar'
import { useSocket } from '../context/SocketState';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Home01 = () => {

    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    const [code, setCode] = useState("");
    const [room1, setRoom1] = useState(null);
    const [room2, setRoom2] = useState(null);

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


    const handleCreateSubmit = (e)=>{
        // e.preventDefault();
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

    const handleJoinSubmit = (e)=>{
        e.preventDefault();
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

    const handleCreateChange = (e)=>{
        setRoom1(e.target.value);
    }

    const handleJoinChange = (e)=>{
        setRoom2(e.target.value);
    }

    return (
        <div>
            <ToastContainer />
            <Navbar />
            <div className='main-container'>
                <div style={{ padding: "0 1rem", width: "100vw" }}>
                    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">

                        <button className="ghost ghostbtn1 d-md-none d-block" onClick={handleSignUpClick} id="signUp">Create Room</button>
                        <button className="ghost ghostbtn2 d-md-none d-block" onClick={handleSignInClick} id="signIn">Join Room</button>

                        <div className="form-container sign-up-container">
                            <form onSubmit={handleJoinSubmit}>
                                <h1>Join Room</h1>
                                <input
                                    type="number"
                                    name="joinRoom"
                                    placeholder="Enter room code here"
                                    value={room2}
                                    onChange={handleJoinChange}
                                />
                                <button type="submit">Join</button>
                            </form>
                        </div>
                        <div className="form-container sign-in-container">
                            <form>
                                <h1>Create Room</h1>
                                <input
                                    type="number"
                                    name="code"
                                    placeholder="get code here"
                                    value={code}
                                />
                                <input
                                    type="number"
                                    name="createRoom"
                                    placeholder="Enter room code here"
                                    value={room1}
                                    onChange={handleCreateChange}
                                />
                                <button type="button" onClick={handleCreateSubmit}>Create</button>
                            </form>
                        </div>
                        <div className="overlay-container d-md-block d-none">
                            <div className="overlay">
                                <div className="overlay-panel overlay-left">
                                    <h1>Welcome Back!</h1>
                                    <p>To keep connected with us please login with your personal info</p>
                                    <button className="ghost" onClick={handleSignInClick} id="signIn">Create Room</button>
                                </div>
                                <div className="overlay-panel overlay-right">
                                    <h1>Hello, Friend!</h1>
                                    <p>Enter your personal details and start your journey with us</p>
                                    <button className="ghost" onClick={handleSignUpClick} id="signUp">Join Room</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home01
