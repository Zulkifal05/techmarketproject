"use server"

import jwt , { JwtPayload as DefaultPayload } from "jsonwebtoken"
import UserModel from "@/models/UserModel"

export const verifyJWT = async (token: string) => {   
    try {
        const decoded = jwt.verify(token, process.env.NEXT_JWT_SECRET as string) as DefaultPayload

        if(decoded) {
            const user = await UserModel.findById(decoded?.id).select("-password")
            if(!user) {
                return null
            }

            return decoded.id
        }
    } catch (error) {
        console.error("JWT verification failed:", error)
        return null
    }
}