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
const io = new Server(server, {
    cors: { "origin": "http://localhost:3000" }
});

const roomLeaders = {}

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);

        if( !roomLeaders[roomId] ) roomLeaders[roomId] = socket.id;
        socket.emit("language-leader", roomLeaders[roomId] == socket.id);

        console.log(`Socket-${socket.id} Joined Room-${roomId}`);
    } );

    socket.on("send-message", ( { roomId, message, sender } ) => {
        socket.to(roomId).emit("receive-message", { message, sender } );
    } );

    socket.on("language-change", ( { roomId, lang } ) => {
        socket.to(roomId).emit("language-updated", lang);
    } );

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    } );
});

app.get('/', (req, res) => res.send("API is running"));

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});