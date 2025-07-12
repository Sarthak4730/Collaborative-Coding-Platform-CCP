import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

export default function RoomPage() {
    const [chatLog, setChatLog] = useState([]);
    const [message, setMessage] = useState("");
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const username = localStorage.getItem("username") || "Unknown";

    useEffect( () => {
        socketRef.current = io("http://localhost:5000");
        socketRef.current.emit("join-room", roomId);
        socketRef.current.on("receive-message", (msg) => {
            setChatLog( (prev) => [...prev, msg] );
        } );
        return () => socketRef.current.disconnect();
    }, [roomId] );

    const sendMessage = () => {
        if(message.trim()){
            socketRef.current.emit("send-message", {
                roomId,
                message,
                sender: username
            } );
            setChatLog( (prev) => [ ...prev, { message, sender: username } ] );
            setMessage("");
        }
    }

    return <>
        <div className="flex justify-center h-[100vh] items-center gap-10">
            <div className="code-editor w-[40vw] h-[75vh] border-2 rounded-xl flex flex-col justify-evenly items-center">
                <h1 className="text-3xl font-bold underline underline-offset-5 decoration-blue-500 decoration-4">Code Editor</h1>
            </div>
            
            <div className="room-chat w-[40vw] h-[75vh] border-2 rounded-xl flex flex-col justify-evenly items-center">
                <h1 className="text-3xl font-bold underline underline-offset-5 decoration-blue-500 decoration-4">Room Chat</h1>

                <ul>
                    {
                        chatLog.map( (msg, idx) => {
                            return <li className="w-[30vw] flex gap-3 my-1" key={idx}>
                                <span className="font-bold">{msg.sender}:</span>
                                <p>{msg.message}</p>
                            </li>
                        } )
                    }
                </ul>

                <div className="input-msg-div w-[30vw] flex justify-between">
                    <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[22vw]" type="text" value={message} placeholder="Type your message" onChange={ (e) => setMessage(e.target.value) } onKeyDown={ (e) => e.key === "Enter" && sendMessage() } required/>
                    <button onClick={sendMessage} className="w-[7vw] h-[5.5vh] rounded-3xl cursor-pointer text-lg hover:scale-110 font-bold text-white bg-blue-500"> Send </button>
                </div>
            </div>
        </div>
    </>
}