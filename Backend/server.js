import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use( cors( {
    origin: "https://ccp-by-sk.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
} ) );
app.use(express.json());
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server( server, {
    cors: {
        "origin": "https://ccp-by-sk.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
} );

const roomUsers = {};

io.on("connection", (socket) => {
    socket.on("join-room", ( { roomId, username } ) => {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.username = username;

        if(!roomUsers[roomId]) roomUsers[roomId] = [];
        roomUsers[roomId].push( { socketId: socket.id, username } );

        const leader = roomUsers[roomId][0];
        io.to(roomId).emit("set-leader", {
            leaderId: leader.socketId,
            leaderName: leader.username
        } );

        io.to(roomId).emit("members-update", { socketUsername: username, roomUsers: roomUsers[roomId] } );
    } );

    socket.on("send-message", ( { roomId, message, sender } ) => {
        socket.to(roomId).emit("receive-message", { message, sender } );
    } );

    socket.on("language-change", ( { roomId, lang } ) => {
        socket.to(roomId).emit("language-updated", lang );
    } );

    // Code-Input-Output Changes START
    socket.on("code-change", ( { roomId, code } ) => {
        socket.to(roomId).emit("code-change", { code } );
    } );
    socket.on("input-change", ( { roomId, input } ) => {
        socket.to(roomId).emit("input-change", { input } );
    } );
    socket.on("output-change", ( { roomId, output } ) => {
        socket.to(roomId).emit("output-change", { output } );
    } );
    // Code-Input-Output Changes END

    // Cursor Event START
    socket.on("cursor-update", ( { roomId, ...data } ) => {
        socket.to(roomId).emit("cursor-update", data );
    } );
    // Cursor Event END

    // RUN CODE START
    socket.on("run-started", (roomId) => {
        socket.to(roomId).emit("run-started");
    } );
    socket.on("run-finished", (roomId) => {
        socket.to(roomId).emit("run-finished");
    } );
    // RUN CODE END

    socket.on("disconnect", () => {
        const roomId = socket.roomId;
        io.to(roomId).emit("user-disconnected", {
            socketId: socket.id, username: socket.username, roomUsers: roomUsers[roomId]
        } );
        
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        if( roomUsers[roomId].length > 0 ){
            const newLeader = roomUsers[roomId][0];
            io.to(roomId).emit("set-leader", {
                leaderId: newLeader.socketId,
                leaderName: newLeader.username
            } );
        }

        io.to(roomId).emit("members-update", { socketUsername: socket.username, roomUsers: roomUsers[roomId] } );
    } );
});

app.get('/', (req, res) => res.send("API is running"));

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});