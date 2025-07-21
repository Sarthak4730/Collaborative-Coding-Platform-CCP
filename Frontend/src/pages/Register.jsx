import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import Swal from 'sweetalert2';

export default function Register() {
    const [formData, setFormData] = useState( {
        username: "",
        email: "",
        password: ""
    } );
    const [error, setError] = useState("");
    const [isHidden, setIsHidden] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData( { ...formData, [e.target.name]: e.target.value } );
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            Swal.fire( {
                position: "top-end",
                icon: "success",
                title: "Successfully Registered new user",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            } );
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed");
        }
    }
    
    return <>
        <form onSubmit={handleSubmit} className="bg-gray-200 w-[50vw] h-[75vh] mx-auto mt-[10vh] rounded-2xl flex flex-col items-center justify-evenly">
            <h1 className="text-3xl font-bold">Register New User</h1>

            <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[20vw]" type="text" name="username" placeholder="Enter Username" onChange={handleChange} required/>
            <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[20vw]" type="email" name="email" placeholder="Enter Email" onChange={handleChange} required/>
            <div className="password-div flex relative">
                <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[20vw]" type={isHidden ? "password" : "text"} name="password" placeholder="Enter Password" onChange={handleChange} required/>
                {isHidden ? <LuEye className="cursor-pointer absolute right-4 top-2 text-2xl" onClick={() => setIsHidden(!isHidden)}/> : <LuEyeClosed className="cursor-pointer absolute right-4 top-2 text-2xl" onClick={() => setIsHidden(!isHidden)}/>}
            </div>

            {error && <p className="text-lg font-bold text-red-600">*{error}*</p>}

            <button type="submit" className="w-[12.5vw] h-[7.5vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Register</button>
            
            <div className="login-div flex items-center gap-3">
                <p className="text-lg font-semibold">Already have an account?</p>
                <button onClick={ () => { navigate("/login") } } type="submit" className="w-[12.5vw] h-[7.5vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold border-3 border-blue-500 ">Login</button>
            </div>
        </form>
    </>
};