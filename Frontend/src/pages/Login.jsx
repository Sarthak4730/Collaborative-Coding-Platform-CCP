import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import Swal from 'sweetalert2';

import Loader from "../components/Loader";

export default function Login() {
    const [formData, setFormData] = useState( {
        email: "",
        password: ""
    } );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData( { ...formData, [e.target.name]: e.target.value } );
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
            // const res = await axios.post(`http://localhost:5000/api/auth/login`, formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            console.log(res.data);
            Swal.fire( {
                position: "bottom-end",
                icon: "success",
                title: "Successfully Logged in to existing account",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            } );
            navigate( location.state?.from || '/' );
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    }
    
    return <>
        <form onSubmit={handleSubmit} className="bg-gray-200 w-5/6 h-96 md:w-[50vw] md:h-[75vh] mx-auto mt-64 md:mt-[10vh] rounded-2xl flex flex-col items-center justify-evenly">
            <h1 className="text-center text-2xl md:text-3xl font-bold">Log in to existing account</h1>

            <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 w-2/3 py-1 md:h-10 md:w-[20vw]" type="email" name="email" placeholder="Enter Email" onChange={handleChange} required/>
            <div className="password-div w-5/6 md:w-auto flex relative">
                <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 py-1 ml-8 md:ml-auto w-4/5 md:h-10 md:w-[20vw]" type={isHidden ? "password" : "text"} name="password" placeholder="Enter Password" onChange={handleChange} required/>
                {isHidden ? <LuEye className="cursor-pointer absolute right-9.5 top-1.5 md:right-4 md:top-2 text-2xl" onClick={() => setIsHidden(!isHidden)}/> : <LuEyeClosed className="cursor-pointer absolute right-9.5 top-1.5 md:right-4 md:top-2 text-2xl" onClick={() => setIsHidden(!isHidden)}/>}
            </div>

            {error && <p className="text-lg font-bold text-red-600">*{error}*</p>}
            {loading && <Loader text="Logging in"/>}

            <button type="submit" className="w-1/3 md:w-[12.5vw] md:h-[7.5vh] rounded-xl cursor-pointer py-1 text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Login</button>
        
            <div className="login-div w-5/6 flex justify-center gap-3 items-center">
                <p className="text-xs md:text-lg font-semibold">Don't have an account?</p>
                <button onClick={ () => { navigate("/register") } } type="submit" className="w-1/3 md:w-[12.5vw] md:h-[7.5vh] rounded-xl cursor-pointer py-1 text-lg hover:scale-105 font-bold border-3 border-blue-500 ">Register</button>
            </div>
        </form>
    </>
};