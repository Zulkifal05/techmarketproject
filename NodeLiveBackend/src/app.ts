import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ 
    origin : process.env.CLIENT_URL,
    credentials : true
}))

app.get("/", async (req,res) => {
    res.send(`Hello!`)
})

import messagesRouter from "./routes/messages.routes.js"

app.use("/api/messages",messagesRouter)