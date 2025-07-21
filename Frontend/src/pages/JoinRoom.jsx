import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

export default function JoinRoom() {
    const [roomCode, setRoomCode] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState( localStorage.length != 0 );
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        Swal.fire( {
            position: "top-end",
            icon: "success",
            title: "Logged Out Successfully.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        } );
        setIsLoggedIn(false);
    }
    const handleEnterRoom = () => {
        if( !roomCode.trim() ) return alert("Please enter a valid room code");
        navigate(`/room/${ roomCode.trim().toUpperCase() }`);
    }

    return <>
        <Navbar />

        <div className="container flex flex-col items-center mt-[10vh] h-[50vh] justify-evenly">
            <h1 className="text-4xl font-bold">Enter Room Code</h1>       
            
            <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[20vw]" type="text" name="roomcode" placeholder="Room Code" onChange={(e) => setRoomCode(e.target.value)} required/>

            <button onClick={handleEnterRoom} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Join Room</button>
        </div>
    </>
}