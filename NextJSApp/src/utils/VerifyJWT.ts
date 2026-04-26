"use server"

import jwt , { JwtPayload as DefaultPayload } from "jsonwebtoken"
import { User as UserModel } from "@techmarket/models"
import { connectDB } from "./ConnectDB"

export const verifyJWT = async (token: string) => { 
    connectDB() // Ensure the database is connected before performing any operations  
    try {
        const decoded = jwt.verify(token, process.env.NEXT_JWT_SECRET as string) as DefaultPayload

        if(decoded) {
            const user = await UserModel.findById(decoded?.userId)
            if(!user) {
                return null
            }

            return user
        }
    } catch (error) {
        console.error("JWT verification failed:", error)
        return null
    }
}