import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);

const userSocketMap = {}; // { userId: socketIdss}

const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173"]
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}


io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] = socket.id;
    }
    console.log("userSocketMap:", userSocketMap); // 👈 check the map

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("disconnect", () => {  
        console.log("A user disconnected", socket.id);
        if(userId){
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    }); 
})

export {io, app, server};

