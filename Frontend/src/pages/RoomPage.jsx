import axios from "axios";
import Select from "react-select";
import Editor from "@monaco-editor/react";

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";

import { FaPlay, FaHome, FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

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
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [leaderName, setLeaderName] = useState("")
    const [isLeader, setIsLeader] = useState(false);
    const [isCodeRunning, setIsCodeRunning] = useState(false);
    const [language, setLanguage] = useState(languageOptions[0]);
    const [code, setCode] = useState(defaultCode.cpp);

    // Room Chatbox Variables
    const [message, setMessage] = useState('');
    const [membersDropdown, setMembersDropdown] = useState(false);
    const [chatLog, setChatLog] = useState([]);
    const [decorationIds, setDecorationIds] = useState([]);
    const [otherCursors, setOtherCursors] = useState({});
    const [roomUsers, setRoomUsers] = useState([]);
    const socketRef = useRef(null);
    const lastMsg = useRef(null);
    const editorRef = useRef(null);
    const { roomId } = useParams();
    const username = localStorage.getItem("username") || "Unknown";
    
    // Code Editor Functions
    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);

        Swal.fire( {
            position: "bottom-end",
            icon: "success",
            title: `Copied room code.<br/>Share with friends.`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        } );
    }
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
    const getColorForSocket = (socketId) => {
        const colors = ['violet', 'purple', 'green', 'orange', 'teal', 'crimson'];
        let hash = 0;
        for(let i=0; i<colors.length; i++) hash += socketId.charCodeAt(i);
        return colors[ hash % colors.length ];
    }
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
    
    // useEffects
    // Chatbox - Auto-Scroll To Latest Message
    useEffect( () => {
        lastMsg.current?.scrollIntoView( { behaviour: "smooth" } );
    }, [chatLog] );

    useEffect( () => {
        socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
            transports: ["websocket"],
            withCredentials: true,
        });
        // socketRef.current = io("http://localhost:5000");

        // EMIT call
        socketRef.current.emit("join-room", { roomId, username } );

        // ON calls
        socketRef.current.on("members-update", ( { type, socketUsername, roomUsers } ) => {
            if (socketUsername !== username) {
                Swal.fire( {
                    position: "bottom-end",
                    icon: "success",
                    title: `${socketUsername} ${type} the room`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                } );
            }
            setRoomUsers(roomUsers);            
        } );
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
        // Cursor Events
        socketRef.current.on("cursor-update", ( { socketId, username, position } ) => {
            if(socketId === socketRef.current.id) return;
            setOtherCursors( (prev) => {
                return {
                    ...prev,
                    [socketId]: {
                        username,
                        ...position,
                        color: getColorForSocket(socketId)
                    }
                }
            } );
        } );
        socketRef.current.on("user-disconnected", ( { socketId, username } ) => {
            setOtherCursors( (prev) => {
                const updated = { ...prev };
                delete updated[socketId];
                return updated;
            } );
            Swal.fire( {
                position: "bottom-end",
                icon: "success",
                title: `${username} Left the room`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            } );
        } );
        // Code-Input-Output Change
        socketRef.current.on("code-change", ( { code } ) => {
            setCode(code);
        } );
        socketRef.current.on("input-change", ( { input } ) => {
            setInput(input);
        } );
        socketRef.current.on("output-change", ( { output } ) => {
            setOutput(output);
        } );
        // Run Code
        socketRef.current.on("run-started", () => setIsCodeRunning(true));
        socketRef.current.on("run-finished", () => setIsCodeRunning(false));
        
        return () => socketRef.current.disconnect();
    }, [roomId] );
    
    // Cursor Decoration
    useEffect( () => {
        if( !editorRef.current ) return;

        const decorations = Object.entries(otherCursors).map( ( [ id, { username, lineNumber, column, color } ] ) => {
            return {
                range: new monaco.Range(lineNumber, column, lineNumber, column),
                options: {
                    className: `remote-cursor-${id}`,
                    afterContentClassName: `remote-username-${id}`
                }
            }
        } );

        const newDecorationIds = editorRef.current.deltaDecorations(decorationIds, decorations);
        setDecorationIds(newDecorationIds);
        
        Object.entries(otherCursors).forEach( ( [ id, data ] ) => {
            if( !document.getElementById("blink-cursor-style") ){
                const blinkStyle = document.createElement("style");
                blinkStyle.id = "blink-cursor-style";
                blinkStyle.innerHTML = `
                    @keyframes blink-cursor{
                        0% { opacity: 1 }
                        50% { opacity: 0 }
                        100% { opacity: 1 }
                    }
                `;
                document.head.appendChild(blinkStyle);
            }
            const styleId = `cursor-style-${id}`;
            if( !document.getElementById(styleId) ){
                const style = document.createElement("style");
                style.id = styleId;
                style.innerHTML = `
                    .remote-cursor-${id} {
                        border-left: 2px solid ${data.color};
                        height: 100%;
                        animation: blink-cursor 1s steps(2, start) infinite;
                    }
                    .remote-username-${id}::after {
                        content: '${data.username}';
                        background: ${data.color};
                        color: white;
                        padding: 2px 5px;
                        font-size: 10px;
                        border-radius: 4px;
                        position: absolute;
                        margin-top: 20px;
                        z-index: 10;
                    }
                `;
                document.head.appendChild(style);
            }
        } );
    }, [otherCursors] );


    return <>
        <div className="fixed top-0 z-10 w-screen">
            <Navbar/>
        </div>

        <div className="h-screen overflow-y-scroll md:overflow-hidden snap-y snap-mandatory flex flex-col md:flex-row items-center md:justify-evenly md:h-[75vh] md:mt-[20vh]">
            {/* CODE EDITOR */}
            <section className="pt-10 md:pt-0 md:mt-60 mb-60 flex flex-col md:flex-row items-center md:justify-evenly h-screen snap-start md:h-11/12 md:snap-none">
                <div className="md:mt-5 code-editor h-full w-90 md:w-[60vw] border-2 rounded-xl flex flex-col">
                    {/* Top Row */}
                    <div className="top w-full h-[14vh] flex justify-between px-5 items-center">
                        <div className="left w-1/2 h-2/3 md:h-full md:w-[20vw] flex md:justify-between md:items-center">
                            <h1 className="text-xl md:text-2xl font-bold underline underline-offset-5 decoration-blue-500 decoration-4">Code Editor</h1>
                            <div className="room-code-copy text-xs md:text-base flex w-11/12 md:w-[7.5vw] h-1/2 md:h-[5.5vh] justify-between items-center border-blue-500 border-2 rounded-lg px-2 font-bold">
                                {roomId}
                                <MdContentCopy className="cursor-pointer transition hover:scale-105" onClick={handleCopy}/>
                            </div>
                        </div>
                        
                        <div className="right w-1/2 h-2/3 md:w-[30vw] md:h-full flex flex-col md:flex-row justify-between items-end md:items-center">
                            <div className="dropdown-hover-leader-alert relative group h-10.25 w-3/4 md:w-[8vw] border-2 border-blue-500 rounded-md">
                                { !isLeader && <p className="text-xs p-2 rounded-md bg-blue-500 text-white absolute w-44 h-12 md:w-[12vw] md:h-[6.5vh] bottom-full md:left-full md:-top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Only the Room Leader '👑'<br/>can change language</p> }
                                
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
                            <button className="w-3/4 md:w-[8vw] h-2/6 md:h-[5.5vh] cursor-pointer text-sm md:text-lg hover:scale-105 font-bold text-white bg-blue-500 flex justify-evenly items-center rounded-md" onClick={runCode} > 
                                <FaPlay className="text-white" />
                                Run Code 
                            </button>
                        </div>
                    </div>

                    {/* Center Code Editor */}
                    <Editor
                        height="32vh"
                        theme="vs-dark"
                        language={language.value}
                        value={code}
                        onChange={ (text) => {
                            setCode(text);
                            socketRef.current.emit("code-change", { roomId, code: text } );
                        } }
                        options={ {
                            minimap: { enabled: false },
                            // wordWrap: "on"
                        } }
                        onMount={ (editor, monaco) => {
                            editorRef.current = editor;

                            editor.onDidChangeCursorPosition( (e) => {
                                const position = e.position;
                                socketRef.current.emit("cursor-update", {
                                    roomId, socketId: socketRef.current.id, username, position
                                } );
                            } );
                        } }
                    />

                    {/* Bottom Row */}
                    <div className="stdin-and-stdout-div h-52 md:h-[18vh] flex justify-between px-3">
                        <div className="INput-div w-1/3 md:w-[28vw] h-full">
                            <h3 className="py-2 pl-2 text-xl font-bold underline underline-offset-3 decoration-blue-500 decoration-3">Input:</h3>
                            <textarea
                                value={input}
                                onChange={ (e) => {
                                    setInput(e.target.value);
                                    socketRef.current.emit("input-change", { roomId, input: e.target.value } );
                                } }
                                placeholder="Enter your custom input here..."
                                className="rounded-lg text-xs md:text-base p-2 w-full md:w-[29vw] h-3/4 md:h-5/6 mx-auto overflow-y-auto bg-neutral-800 text-white"
                            />
                        </div>
                        <div className="OUTput-div w-2/3 md:w-[28vw] h-full">
                            <h3 className="py-2 pl-4 md:pl-3 ml-2 md:ml-0 text-xl font-bold underline underline-offset-3 decoration-blue-500 decoration-3">Output:</h3>
                            <div className="rounded-lg text-xs md:text-base p-2 ml-4 md:ml-1 w-11/12 md:w-[28vw] h-3/4 md:h-5/6 overflow-y-auto bg-neutral-800 text-white">
                                <pre className="whitespace-pre-wrap break-words">{output}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="scroll-down-div mt-5 flex md:hidden justify-center gap-4 w-full">
                    <h1 className="font-bold text-xl underline underline-offset-5 decoration-red-500 decoration-4">Scroll Down for Room Chat</h1>
                    <FaAngleDoubleDown className="animate-bounce" style={ { height: "6vh", width: "6vw" } } />
                </div>
            </section>

            { isCodeRunning && <Loader text="Running Code"/> }
            
            {/* ROOM CHATBOX */}
            <section className="relative bottom-5 md:pt-2.5 md:mt-40 flex flex-col md:flex-row items-center md:justify-evenly h-screen snap-start md:h-11/12 md:snap-none">
                <div className="scroll-up-div flex md:hidden justify-center gap-4 w-full">
                    <h1 className="font-bold text-xl underline underline-offset-5 decoration-blue-500 decoration-4">Scroll Up for Code Editor</h1>
                    <FaAngleDoubleUp className="animate-bounce" style={ { height: "6vh", width: "6vw" } } />
                </div>
                <div className="room-chat h-full w-90 md:w-[30vw] border-2 rounded-xl flex flex-col justify-evenly items-center">
                    <div className="top-row h-[7.5vh] w-full px-3 flex justify-between items-center">
                        <h1 className="text-xl md:text-2xl h-5/6 w-1/4 md:pt-2 md:w-1/3 font-bold underline underline-offset-5 decoration-red-500 decoration-4">Room Chat</h1>
                        
                        <div className="dropdown-div relative">
                            <button className="users-count flex w-36 md:w-[10vw] h-10 md:h-[5vh] justify-between items-center border-red-500 border-2 rounded-lg px-2 font-bold cursor-pointer hover:scale-105" onClick={ () => setMembersDropdown( (prev) => !prev ) }>
                                { membersDropdown ? <IoIosArrowDropup className="text-2xl"/> : <IoIosArrowDropdown className="text-2xl"/> }
                                {roomUsers.length} Members
                            </button>
                            {
                                membersDropdown && <ol className="members-ul border-red-500 border-2 bg-white absolute w-36 md:w-[10vw] rounded-lg text-sm pl-2">
                                    { 
                                        roomUsers.map( (u,idx) => {
                                            return <li className="my-2" key={idx}><b>{idx+1}.</b> {u.username}{u.username === leaderName && '👑'}</li>
                                        } )
                                    }
                                </ol>
                            }
                        </div>
                        
                        <Link to='/'>
                            <button className="w-16 md:w-[5vw] h-[6vh] rounded-xl cursor-pointer hover:scale-105 font-bold text-white bg-red-500 flex flex-col items-center justify-evenly">
                                <FaHome className="text-2xl" />
                                <p className="text-sm">Home</p>
                            </button>
                        </Link>
                    </div>

                    <ul className="chats mt-2 h-[50vh] w-full overflow-y-auto break-all whitespace-normal">
                        {
                            chatLog.map( (msg, idx) => (
                                <li className="flex justify-between px-3 my-3 gap-2" key={idx}>
                                    <span className="inline-block w-1/3 md:w-[10vw] font-bold">
                                        {msg.sender === leaderName && '👑'}{msg.sender}:
                                    </span>
                                    <p className="w-2/3 md:w-[16vw]">{msg.message}</p>
                                </li>
                            ) )
                        }
                        <div ref={lastMsg} className="div-for-lastMsg" />
                    </ul>

                    <div className="input-msg-div h-[7.5vh] w-full px-3 flex justify-between items-center">
                        <input className="border-2 border-red-500 bg-white rounded-2xl px-4 h-10 w-60 md:w-[22vw]" type="text" value={message} placeholder="Type your message" onChange={ (e) => setMessage(e.target.value) } onKeyDown={ (e) => e.key === "Enter" && sendMessage() } required/>
                        <button onClick={sendMessage} className="w-1/4 md:w-[5.5vw] h-2/3 md:h-[5.5vh] rounded-3xl cursor-pointer text-lg hover:scale-105 font-bold text-white bg-red-500"> Send </button>
                    </div>
                </div>
            </section>
        </div>
    </>
}