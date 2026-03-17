import { Router } from "express"
import { SendMessage } from "../controllers/messages.controller.js"
import { AuthCheck } from "../middlewares/auth.middleware.js"

const messagesRouter = Router()

messagesRouter.post("/Send-Message",AuthCheck,SendMessage)

export default messagesRouter