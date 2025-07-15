import axios from "axios";
import Select from "react-select";
import Editor from "@monaco-editor/react";

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";

import { FaPlay, FaHome } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";

export default function RoomPage() {
    // Code Editor Variables
    const languageOptions = [
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "python", label: "Python" }
    ];
    const defaultCode = {
        cpp: `#include <iostream>\nusing namespace std;\nint main() {\n\tcout << "Hello World - C++";\n\treturn 0;\n}`,
        java: `public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World - Java");\n\t}\n}`,
        python: `print("Hello World - Python")`
    };
    const [leaderName, setLeaderName] = useState("")
    const [isLeader, setIsLeader] = useState(false);
    const [language, setLanguage] = useState(languageOptions[0]);
    const [isCodeRunning, setIsCodeRunning] = useState(false);
    const [code, setCode] = useState(defaultCode.cpp);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    // Room Chatbox Variables
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const username = localStorage.getItem("username") || "Unknown";
    const [chatLog, setChatLog] = useState([]);
    const [message, setMessage] = useState('');
    const lastMsg = useRef(null);
    
    // Code Editor Functions
    const runCode = async () => {
        try {
            socketRef.current.emit("run-started", roomId);
            setIsCodeRunning(true);
            setOutput("Running...");

            const res = await axios.post(
                "https://emkc.org/api/v2/piston/execute",       // Piston API free code executer
                {
                    language: language.value,
                    version: '*',                               // latest version
                    files: [ { name: "main", content: code } ],
                    stdin: input
                }
            );
                        
            const result = res.data;
            setOutput( result.run?.stdout || result.run?.stderr || result?.message || "No Output" );
            socketRef.current.emit("output-change", {
                roomId, output: result.run?.stdout || result.run?.stderr || result?.message || "No Output"
            } );
        } catch (err) {
            console.error(err);
            setOutput("Error running the code");
        } finally {
            socketRef.current.emit("run-finished", roomId);
            setIsCodeRunning(false);
        }
    }
    
    // Room Chatbox Functions
    useEffect( () => {
        lastMsg.current?.scrollIntoView( { behaviour: "smooth" } );
    }, [chatLog] );
    useEffect( () => {
        socketRef.current = io("http://localhost:5000");

        // EMIT call
        socketRef.current.emit("join-room", { roomId, username } );

        // ON calls
        socketRef.current.on("set-leader", ( { leaderId, leaderName } ) => {
            setLeaderName(leaderName);
            setIsLeader( socketRef.current.id === leaderId );
        } );
        socketRef.current.on("receive-message", (msg) => {
            setChatLog( (prev) => [...prev, msg] );
        } );
        socketRef.current.on("language-updated", (langVal) => {
            const langObj = languageOptions.find( (l) => l.value == langVal );
            setLanguage(langObj);
            setCode(defaultCode[langVal]);
        } );
        socketRef.current.on("code-change", ( { code } ) => {
            setCode(code);
        } );
        socketRef.current.on("input-change", ( { input } ) => {
            setInput(input);
        } );
        socketRef.current.on("output-change", ( { output } ) => {
            setOutput(output);
        } );
        socketRef.current.on("run-started", () => setIsCodeRunning(true));
        socketRef.current.on("run-finished", () => setIsCodeRunning(false));

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
        <div className="flex justify-center h-[100vh] items-center gap-7.5">
            {/* CODE EDITOR */}
            <div className="code-editor w-[60vw] h-[90vh] border-2 rounded-xl flex flex-col justify-evenly items-center">
                {/* Top Row */}
                <div className="top w-full h-[10vh] flex justify-between px-5 items-center">
                    <h1 className="text-3xl font-bold underline underline-offset-5 decoration-blue-500 decoration-4">Code Editor</h1>
                    
                    <div className="dropdown-hover-leader-alert relative group w-[8vw] border-2 border-blue-500 rounded-md">
                        { !isLeader && <p className="text-xs p-2 rounded-md bg-blue-500 text-white absolute w-[12vw] left-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">Only the Room Leader(👑)<br/>can change language</p> }
                        
                        <Select
                            isDisabled={!isLeader}
                            isSearchable={false}
                            options={languageOptions}
                            value={language}
                            onChange={ (lang) => {
                                setLanguage(lang);
                                setCode(defaultCode[lang.value]);
                                socketRef.current.emit("language-change", { roomId, lang: lang.value } );
                            } }
                        />
                    </div>

                    <button className="w-[8vw] h-[5.5vh] cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500 flex justify-evenly items-center rounded-md" onClick={runCode} > 
                        <FaPlay className="text-white" />
                        Run Code 
                    </button>
                </div>

                {/* Center Code Editor */}
                <Editor
                    height="50vh"
                    theme="vs-dark"
                    language={language.value}
                    value={code}
                    onChange={ (text) => {
                        setCode(text);
                        socketRef.current.emit("code-change", { roomId, code: text } );
                    } }
                    options={ {
                        minimap: { enabled: false }
                    } }
                />

                {/* Bottom Row */}
                <div className="stdin-and-stdout-div flex">
                    <div className="INput-div w-[30vw] h-[25vh]">
                        <h3 className="py-2 pl-3 text-xl font-bold underline underline-offset-3 decoration-blue-500 decoration-3">Input :</h3>
                        <textarea
                            value={input}
                            onChange={ (e) => {
                                setInput(e.target.value);
                                socketRef.current.emit("input-change", { roomId, input: e.target.value } );
                            } }
                            placeholder="Enter your custom input here..."
                            className="rounded-lg h-[18vh] ml-2 p-2 w-[29vw] mx-auto overflow-y-auto bg-neutral-800 text-white"
                        />
                    </div>
                    <div className="OUTput-div w-[30vw] h-[25vh]">
                        <h3 className="py-2 pl-3 text-xl font-bold underline underline-offset-3 decoration-blue-500 decoration-3">Output :</h3>
                        <div className="rounded-lg h-[18vh] p-2 w-[29vw] mx-auto overflow-y-auto bg-neutral-800 text-white">
                            <pre>{output}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {
                isCodeRunning && <div className="full-screen-loader absolute w-[100vw] h-[100vh] bg-black opacity-80 text-white text-3xl flex flex-col justify-center items-center gap-3">
                    {<ThreeDot variant="bounce" color="#3b82f6" size="large" />}
                    <p>Running Code</p>
                </div>
            }
            
            {/* ROOM CHATBOX */}
            <div className="room-chat w-[30vw] h-[90vh] border-2 rounded-xl flex flex-col justify-between py-5 items-center">
                <div className="top-row flex w-full px-3 justify-between">
                    <h1 className="text-3xl font-bold underline underline-offset-5 decoration-blue-500 decoration-4">Room Chat</h1>
                    <Link to='/'>
                        <button className="w-[7vw] h-[5.5vh] rounded-3xl cursor-pointer text-lg hover:scale-110 font-bold text-white bg-red-500 flex items-center justify-evenly">
                            <FaHome className="text-2xl" />
                            Home
                        </button>
                    </Link>
                </div>

                <ul className="h-[70vh] overflow-y-auto">
                    {
                        chatLog.map( (msg, idx) => (
                            <li className="w-[25vw] flex gap-3 my-1" key={idx}>
                                <span className="font-bold">
                                    {msg.sender === leaderName && '👑'}{msg.sender}:
                                </span>
                                <p>{msg.message}</p>
                            </li>
                        ) )
                    }
                    <div ref={lastMsg} className="div-for-lastMsg" />
                </ul>

                <div className="input-msg-div w-[25vw] flex justify-between">
                    <input className="border-2 border-blue-500 bg-white rounded-2xl pl-4 h-10 w-[19.5vw]" type="text" value={message} placeholder="Type your message" onChange={ (e) => setMessage(e.target.value) } onKeyDown={ (e) => e.key === "Enter" && sendMessage() } required/>
                    <button onClick={sendMessage} className="w-[5vw] h-[5.5vh] rounded-3xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-blue-500"> Send </button>
                </div>
            </div>
        </div>
    </>
}