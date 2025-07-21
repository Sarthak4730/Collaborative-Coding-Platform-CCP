import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

export default function CreateRoom() {
    const [roomCode] = useState( () => generateRoomCode() );
    const [isLoggedIn, setIsLoggedIn] = useState( localStorage.length != 0 );
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        Swal.fire( {
            position: "bottom-end",
            icon: "success",
            title: "Logged Out Successfully.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        } );
        setIsLoggedIn(false);
    }
    function generateRoomCode() {
        return Math.random().toString(36).slice(2, 8).toUpperCase();
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);

        Swal.fire( {
            position: "bottom-end",
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
        <Navbar />

        <div className="container flex flex-col items-center mt-[10vh] h-[50vh] justify-evenly">
            <h1 className="text-4xl font-bold">Room Created</h1>       
            <h4 className="text-2xl">Room Code: <span className="font-bold text-2xl">{roomCode}</span></h4>

            <div className="btns flex justify-center gap-5 items-center">
                <button onClick={handleCopy} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold border-2 border-blue-500 ">Copy Room Code</button>
                <button onClick={handleEnterRoom} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Enter Room</button>
            </div>
        </div>
    </>
}