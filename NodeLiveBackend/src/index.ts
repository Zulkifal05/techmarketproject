import dotenv from 'dotenv'
dotenv.config();

import { connectDB } from "./utils/db.js"
import { Server } from "socket.io"
import http from 'http'
import { app } from "./app.js"
import jwt, { JwtPayload } from "jsonwebtoken";

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

// ------------------- Socket.IO Authentication and Online Users Management -------------------

// Object to store online users
const onlineUsers: Record<string, Set<string>> = {};

// Socket.io middleware to authenticate users based on their access token
interface MyJwtPayload extends JwtPayload {
  userId: string;
}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as MyJwtPayload;

    if(!decoded.userId) {
        return next(new Error("Token Payload Issue"));
    }
    
    socket.user = decoded; // attach verified user info to socket object
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

export function getReceiverSocketId(userId: string): string[] | undefined {
    return onlineUsers[userId] ? Array.from(onlineUsers[userId]) : [];
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    const userId = socket.user.userId;

    // initialize set if user not exists
    if (!onlineUsers[userId]) {
        onlineUsers[userId] = new Set();
    }

    // add this socket to user's set
    onlineUsers[userId].add(socket.id);

    socket.on('disconnect', () => {
        // remove this socket from user's set
        onlineUsers[userId]?.delete(socket.id);

        // cleanup if no sockets left
        if (onlineUsers[userId]?.size === 0) {
            delete onlineUsers[userId];
        }
    });
});

export { io }