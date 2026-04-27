import dotenv from 'dotenv'
dotenv.config();

import { connectDB } from "./utils/db.js"
import { Server } from "socket.io"
import http from 'http'
import { app } from "./app.js"

const PORT = process.env.PORT || 5000
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
})

// Object to store online users
const onlineUsers: Record<string, string> = {};

export function getReceiverSocketId(userId: string): string | undefined {
    return onlineUsers[userId];
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    // Listen for user login and store their socket ID
    const { userId } = socket.handshake.auth;
    onlineUsers[userId] = socket.id;

    socket.on('disconnect', () => {
        // Remove the user from the online users list
        delete onlineUsers[userId];
    });
})

export { io }