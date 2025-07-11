import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    const handleEnterRoom = () => {
        if( !roomCode.trim() ) return alert("Please enter a valid room code");
        navigate(`/room/${ roomCode.trim().toUpperCase() }`);
    }

    return <>
        <nav className="intro h-[25vh] bg-blue-500 text-white flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">Collaborative Coding Platform (CCP)</h1>
            <h3 className="text-xl">Zero Setup. Multi-Language. Real-Time.</h3>
            <p className="font-semibold text-gray-300">Create/Join a room - Write & Run code together - Chat about errors, bugs and fixes.</p>
        </nav>

        <div className="container flex flex-col items-center h-[50vh] justify-evenly">
            <h1 className="text-4xl font-bold">Enter Room Code</h1>       
            
            <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[20vw]" type="text" name="roomcode" placeholder="Room Code" onChange={(e) => setRoomCode(e.target.value)} required/>

            <button onClick={handleEnterRoom} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Join Room</button>
        </div>
    </>
}