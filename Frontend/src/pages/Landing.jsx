import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

export default function Landing() {
    return <>
        <nav className="intro h-[25vh] bg-blue-500 text-white flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">Collaborative Coding Platform (CCP)</h1>
            <h3 className="text-xl">Zero Setup. Multi-Language. Real-Time.</h3>
            <p className="font-semibold text-gray-300">Create/Join a room - Write & Run code together - Chat about errors, bugs and fixes.</p>
        </nav>

        <ul className="features-list flex justify-evenly h-[40vh] items-center list-disc text-xl">
            <div className="left h-[25vh] flex flex-col justify-between">
                <li className="feature">
                    <h4 className="font-bold text-2xl">Real-time collaboration.</h4>
                    <p>Code together, see each other's cursors live.</p>
                </li>
                <li className="feature">
                    <h4 className="font-bold text-2xl">Multi-language support.</h4>
                    <p>C++, Java, & Python - compiler instantly.</p>
                </li>
            </div>
            <div className="right h-[25vh] flex flex-col justify-between">
                <li className="feature">
                    <h4 className="font-bold text-2xl">Secure room access.</h4>
                    <p>Login protected and JWT-authenticated rooms.</p>
                </li>
                <li className="feature">
                    <h4 className="font-bold text-2xl">Built-in chatbox.</h4>
                    <p>Text chat with room members.</p>
                </li>
            </div>
        </ul>

        <div className="btns h-[20vh] flex justify-center gap-5 items-center">
            <Link to="/create-room">                                               {/* edit link to CREATE-ROOM */}
                <button className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">Create a Room</button>
            </Link>
            <Link to="/join-room">                                                  {/* edit link to JOIN-ROOM */}
                <button className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold border-3 border-blue-500 ">Join a Room</button>
            </Link>
        </div>

        <footer className="h-[15vh] bg-blue-500 text-white flex items-center">
            <ul className="w-full flex justify-evenly">
                <li className="w-1/3 flex justify-center">
                    <div className="custom-box flex w-[6vw] justify-between items-center">
                        <FaGithub className="text-2xl"/>
                        <h3><a className="underline hover:text-blue-300" href="https://github.com/Sarthak4730/Collaborative-Coding-Platform-CCP" target="_blank">Github</a></h3>
                    </div>
                </li>
                <li className="w-1/3 flex justify-center">
                    <div className="custom-box flex w-[20.5vw] justify-between items-center">
                        <FaHeart className="text-red-500 text-2xl"/>
                        <h3>Made with love by Sarthak Kharade</h3>
                    </div>
                </li>
                <li className="w-1/3 flex justify-center">
                    <div className="custom-box flex w-[16vw] justify-between items-center">
                        <IoIosMail className="text-2xl"/>
                        <h3>Feedback (NOT WORKING). <br/> <a className="underline hover:text-blue-300" href="mailto:sarthak.kharade.dev@gmail.com" target="_blank">Click here.</a></h3>
                    </div>
                </li>
            </ul>
        </footer>
    </>
};