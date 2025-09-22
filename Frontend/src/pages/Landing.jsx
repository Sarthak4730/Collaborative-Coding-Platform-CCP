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

    return <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        <section className="hero relative h-screen snap-start bg-gradient-to-r from-[#3b82f6] to-[#ef4444] flex flex-col md:flex-row justify-evenly items-center gap-3">
            <div className="left/top text-center md:text-start">
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
                            "cout << \"Zero-Setup.\";",
                            "System.out.println(\"Multi-Language.\");",
                            "print('Real-Time.')"
                        ] }
                    />
                </div>
            </div>
            <div className="right/bottom">
                <DotLottieReact
                    className="w-screen md:w-[35vw]"
                    // style={ { width: "35vw" } }
                    src="/landingPageArt.lottie"
                    loop
                    autoplay
                />
            </div>
            <div className="absolute bottom-8 flex justify-center mt-10 animate-bounce text-white text-2xl">
                <FaAngleDoubleDown style={ { height: "8vh", width: "8vw" } } />
            </div>
        </section>

        <section className="navbar-and-features-and-buttons h-screen snap-start">
            <Navbar />
            
            <div className="buttons h-1/6 md:h-[25vh] flex justify-center gap-[3vw] items-center">
                <button onClick={() => handleClick("create")} className="w-1/3 md:w-[15vw] h-1/3 md:h-[10vh] rounded-xl cursor-pointer text-sm md:text-lg transition hover:scale-110 font-bold text-white bg-blue-500 flex justify-evenly md:justify-center md:gap-2 items-center">
                    <IoCreateOutline className="text-2xl" />
                    <p className="w-2/3">Create a Room</p>
                </button>
                <button onClick={() => handleClick("join")} className="w-1/3 md:w-[15vw] h-1/3 md:h-[10vh] rounded-xl cursor-pointer text-sm md:text-lg transition hover:scale-110 font-bold text-white bg-red-500 flex justify-evenly md:justify-center md:gap-2 items-center">
                    <IoEnterOutline className="text-2xl" />
                    <p className="w-2/3">Join a Room</p>
                </button>
            </div>

            <div className="features flex flex-col md:h-[60vh] md:grid md:grid-cols-2 md:grid-rows-2 px-[3vw] py-8 md:pt-[2vw] gap-8 md:gap-[3vw]">
                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="h-32 md:h-auto rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-between items-center border-2 border-blue-500"
                >
                    <div className="left w-2/3 md:w-auto">
                        <h4 className="font-bold text-lg md:text-2xl">Built-in chatbox.</h4>
                        <p className="text-sm md:text-base mt-1">Text chat with room members.</p>
                    </div>
                    <img className="ml-4 h-full md:w-1/4 md:h-[20vh] transition hover:scale-130" src="/Chatbox.png" alt="pic" />
                </Tilt>

                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="h-32 md:h-auto rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-between items-center border-2 border-red-500"
                >
                    <div className="left w-2/3 md:w-auto">
                        <h4 className="font-bold text-lg md:text-2xl">Real-time collaboration.</h4>
                        <p className="text-sm md:text-base mt-1">Code together, see each other's cursors live.</p>
                    </div>
                    <img className="ml-4 h-full md:w-1/3 md:h-[20vh] transition hover:scale-130" src="/Cursors.png" alt="pic" />
                </Tilt>

                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="h-32 md:h-auto rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-between items-center border-2 border-blue-500"
                >
                    <div className="left w-2/3 md:w-auto">
                        <h4 className="font-bold text-lg md:text-2xl">Multi-language support.</h4>
                        <p className="text-sm md:text-base mt-1">C++, Java, & Python - compile & run instantly.</p>
                    </div>
                    <img className="ml-4 md:w-auto h-full md:h-[20vh] transition hover:scale-130" src="/Languages.png" alt="pic" />
                </Tilt>

                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    scale={1.02}
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    transitionSpeed={250}
                    className="h-32 md:h-auto rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl flex justify-between items-center border-2 border-red-500"
                >
                    <div className="left w-2/3 md:w-auto">
                        <h4 className="font-bold text-lg md:text-2xl">Secure room access.</h4>
                        <p className="text-sm md:text-base mt-1">Login protected and JWT-authenticated rooms.</p>
                    </div>
                    <img className="ml-4 md:w-auto h-full md:h-[20vh] transition hover:scale-130" src="/Login.png" alt="pic" />
                </Tilt>
            </div>
        </section>
    </div>
};