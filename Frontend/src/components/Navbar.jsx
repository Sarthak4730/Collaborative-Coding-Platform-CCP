import { useState } from "react";
import Swal from "sweetalert2";
import { FaGithub } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
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
        navigate('/');
    }

    return <nav className="navbar h-20 md:h-[15vh] bg-gradient-to-r from-[#3b82f6] to-[#ef4444] text-white font-bold flex justify-between px-[2vw] items-center">
        <div className="left flex w-1/2 items-center gap-2">
            <button className="w-1/6 h-1/6 md:w-[3vw] md:h-[3vw]" onClick={ () => navigate('/') }>
                <img src="/logo.svg" alt="logo" className="cursor-pointer hover:scale-110 transition border-2 border-white rounded-lg"/>
            </button>
            <h1 className="w-1/2 text-xs md:text-2xl">Collaborative Coding Platform</h1>
        </div>

        <div className="right flex justify-end md:justify-end w-1/2 h-full items-center md:gap-4">
            <div className="two-btns md:flex gap-3">
                <div className="hover:scale-110 transition flex w-1/4 md:w-[7vw] justify-evenly">
                    <FaGithub className="text-2xl"/>
                    <h3><a className="hover:text-blue-300 text-xs md:text-base underline md:no-underline" href="https://github.com/Sarthak4730/Collaborative-Coding-Platform-CCP" target="_blank">Github</a></h3>
                </div>
                <div className="hover:scale-110 transition flex w-1/4 md:w-[7vw] justify-evenly">
                    <IoIosMail className="text-2xl"/>
                    <a className="hover:text-blue-300 text-xs md:text-base underline md:no-underline" href="mailto:sarthak.kharade.dev@gmail.com">Contact</a>
                </div>
            </div>
            {
                isLoggedIn && <button onClick={handleLogout} className="w-1/3 h-1/2 md:w-[7vw] md:h-[7vh] rounded-xl cursor-pointer text-sm md:text-lg transition hover:scale-110 hover:text-blue-500 text-red-500 font-bold border-2 border-black bg-white">Logout</button>
            }
        </div>
    </nav>
}

export default Navbar;