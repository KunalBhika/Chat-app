import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors : {
        origin : ["http://localhost:5173"]
    }
})

// to store online users
const userSocketMap = {};

io.on("connection" , (socket) => {
    console.log("client connected : " , socket.id);
    
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    socket.on("disconnect" , () => {
        console.log("client disconnected : " , socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    })
})

export const getReceiverSocketID = (userId) => {
    return userSocketMap[userId];
}

export { io , server , app };