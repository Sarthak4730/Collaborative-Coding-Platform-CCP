import { useNavigate } from "react-router-dom";
import { FaAngleDoubleDown } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Tilt from "react-parallax-tilt";
import { Typewriter } from "react-simple-typewriter";
import { IoCreateOutline, IoEnterOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Landing() {
    const [isLoggedIn, setIsLoggedIn] = useState( localStorage.length != 0 );
    const navigate = useNavigate();
    
    const handleClick = (intent) => {
        const target = intent === "create" ? "/create-a-room" : "/join-a-room";
        if(isLoggedIn) navigate(target);
        else navigate("/login", { state: { from: target } } );
    }

    return <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory">
        <section className="hero h-[100vh] snap-start bg-gradient-to-r from-[#3b82f6] to-[#ef4444] flex justify-evenly items-center gap-3">
            <div className="left">
                <h1 className="text-5xl font-bold text-white">Collaborative Coding Platform</h1>
                <div className="text-xl font-semibold mt-3">
                    <Typewriter
                        cursor="true"
                        cursorBlinking="true"
                        cursorColor="white"
                        delaySpeed="1500"
                        deleteSpeed="50"
                        loop="0"
                        typeSpeed="80"
                        words={ [
                            "cout<<\"Zero-Setup. Multi-Language. Real-Time.\";",
                            "System.out.println(\"Zero Setup. Multi-Language. Real-Time.\");",
                            "print('Zero Setup. Multi-Language. Real-Time.')"
                        ] }
                    />
                </div>
            </div>
            <div className="right">
                <DotLottieReact
                    style={ { width: "35vw" } }
                    src="/landingPageArt.lottie"
                    loop
                    autoplay
                />
            </div>
            <div className="absolute bottom-2 flex justify-center mt-10 animate-bounce text-white text-2xl">
                <FaAngleDoubleDown style={ { height: "10vh", width: "3vw" } } />
            </div>
        </section>

        <section className="navbar-and-features-and-buttons h-[100vh] snap-start">
            <Navbar />

            <div className="features h-[60vh] grid grid-cols-2 grid-rows-2 p-[3vw] gap-[3vw]">
                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-evenly border-2 border-blue-500"
                >
                    <div className="left">
                        <h4 className="font-bold text-2xl">Built-in chatbox.</h4>
                        <p>Text chat with room members.</p>
                    </div>
                    <img src="/Chatbox.png" alt="pic" />
                </Tilt>

                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-evenly border-2 border-red-500"
                >
                    <div className="left">
                        <h4 className="font-bold text-2xl">Real-time collaboration.</h4>
                        <p>Code together, see each other's cursors live.</p>
                    </div>
                    <img src="/Cursors.png" alt="pic" />
                </Tilt>

                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-evenly border-2 border-blue-500"
                >
                    <div className="left">
                        <h4 className="font-bold text-2xl">Multi-language support.</h4>
                        <p>C++, Java, & Python - compile & run instantly.</p>
                    </div>
                    <img src="/Languages.png" alt="pic" />
                </Tilt>

                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-evenly border-2 border-red-500"
                >
                    <div className="left">
                        <h4 className="font-bold text-2xl">Secure room access.</h4>
                        <p>Login protected and JWT-authenticated rooms.</p>
                    </div>
                    <img src="/Login.png" alt="pic" />
                </Tilt>
            </div>

            <div className="buttons h-[25vh] flex justify-center gap-[3vw] items-center">
                <button onClick={() => handleClick("create")} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg transition hover:scale-110 font-bold text-white bg-blue-500 flex justify-center gap-2 items-center">
                    <IoCreateOutline className="text-2xl" />
                    Create a Room
                </button>
                <button onClick={() => handleClick("join")} className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg transition hover:scale-110 font-bold text-white bg-red-500 flex justify-center gap-2 items-center">
                    <IoEnterOutline className="text-2xl" />
                    Join a Room
                </button>
            </div>
        </section>
    </div>
};