import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div>
            <div className="intro h-[25vh] bg-blue-500 text-white flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Collaborative Coding Platform (CCP)</h1>
                <h3 className="text-xl">Zero Setup. Multi-Language. Real-Time.</h3>
                <p className="font-semibold text-gray-300">Create/Join a room - Write & Run code together - Chat about errors, bugs and fixes.</p>
            </div>

            <ul className="features-list flex justify-evenly h-[50vh] items-center list-disc text-xl">
                <div className="left h-[30vh] flex flex-col justify-between">
                    <li className="feature">
                        <h4 className="font-bold text-2xl">Real-time collaboration.</h4>
                        <p>Code together, see each other's cursors live.</p>
                    </li>
                    <li className="feature">
                        <h4 className="font-bold text-2xl">Multi-language support.</h4>
                        <p>C++, Java, & Python - compiler instantly.</p>
                    </li>
                </div>
                <div className="right h-[30vh] flex flex-col justify-between">
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
                <Link to="/register">
                    <button className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 ">(register)Create a Room</button>
                </Link>
                <Link to="/login">
                    <button className="w-[15vw] h-[10vh] rounded-xl cursor-pointer text-lg hover:scale-105 font-bold border-3 border-blue-500 ">(login)Join a Room</button>
                </Link>
            </div>
        </div>
    )
};