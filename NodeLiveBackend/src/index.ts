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