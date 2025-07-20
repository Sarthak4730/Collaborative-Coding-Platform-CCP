import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
    const [roomCode] = useState( () => generateRoomCode() );
    const navigate = useNavigate();

    function generateRoomCode() {
        return Math.random().toString(36).slice(2, 8).toUpperCase();
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);

        Swal.fire( {
            position: "top-end",
            icon: "success",
            title: `Copied room code.<br/>Share with friends.`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        } );
    }
    const handleEnterRoom = () => {
        navigate(`/room/${roomCode}`);
    }

    return <>
        <nav className="intro h-[25vh] bg-blue-500 text-white flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">Collaborative Coding Platform (CCP)</h1>
            <h3 className="text-xl">Zero Setup. Multi-Language. Real-Time.</h3>
            <p className="font-semibold text-gray-300">Create/Join a room - Write & Run code together - Chat about errors, bugs and fixes.</p>
        </nav>

        <div className="container flex flex-col items-center h-[50vh] justify-evenly">
            <h1 className="text-4xl font-bold">Room Created</h1>       
            <h4 className="text-2xl">Room Code: <span className="font-bold text-2xl">{roomCode}</span></h4>

            <div className="btns flex justify-center gap-5 items-center">
                <button onClick={handleCopy} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold border-2 border-blue-500 ">Copy Room Code</button>
                <button onClick={handleEnterRoom} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Enter Room</button>
            </div>
        </div>
    </>
}