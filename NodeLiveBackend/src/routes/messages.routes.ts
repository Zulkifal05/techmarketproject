import { Router } from "express"
import { GetMessages, SendMessage } from "../controllers/messages.controller.js"
import { AuthCheck } from "../middlewares/auth.middleware.js"

const messagesRouter = Router()

messagesRouter.post("/Send-Message",AuthCheck,SendMessage)
messagesRouter.get("/Get-Messages",AuthCheck,GetMessages)

export default messagesRouter