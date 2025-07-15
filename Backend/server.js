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
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server( server, {
    cors: { "origin": "http://localhost:3000" }
} );

const roomUsers = {};

io.on("connection", (socket) => {
    socket.on("join-room", ( { roomId, username } ) => {
        socket.join(roomId);
        socket.username = username;

        if(!roomUsers[roomId]) roomUsers[roomId] = [];
        roomUsers[roomId].push( { socketId: socket.id, username } );

        const leader = roomUsers[roomId][0];
        io.to(roomId).emit("set-leader", {
            leaderId: leader.socketId,
            leaderName: leader.username
        } );

        console.log(`${socket.username} Joined Room-${roomId}`);
    } );

    socket.on("send-message", ( { roomId, message, sender } ) => {
        socket.to(roomId).emit("receive-message", { message, sender } );
    } );

    socket.on("language-change", ( { roomId, lang } ) => {
        socket.to(roomId).emit("language-updated", lang);
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

    // RUN CODE START
    socket.on("run-started", (roomId) => {
        socket.to(roomId).emit("run-started");
    } );
    socket.on("run-finished", (roomId) => {
        socket.to(roomId).emit("run-finished");
    } );
    // RUN CODE END

    socket.on("disconnect", () => {
        console.log(socket.username, " disconnected");
        for(const roomId in roomUsers){
            roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);

            if( roomUsers[roomId].length > 0 ){
                const newLeader = roomUsers[roomId][0];
                io.to(roomId).emit("set-leader", {
                    leaderId: newLeader.socketId,
                    leaderName: newLeader.username
                } );
            }
        }
    } );
});

app.get('/', (req, res) => res.send("API is running"));

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});