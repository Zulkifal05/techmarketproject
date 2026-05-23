import { Router } from "express"
import { GetMessages, GetUserChats, SendMessage } from "../controllers/messages.controller.js"
import { AuthCheck } from "../middlewares/auth.middleware.js"

const messagesRouter = Router()

messagesRouter.post("/Send-Message",AuthCheck,SendMessage)
messagesRouter.get("/Get-Messages",AuthCheck,GetMessages)
messagesRouter.get("/Get-User-Chats",AuthCheck,GetUserChats)

export default messagesRouter