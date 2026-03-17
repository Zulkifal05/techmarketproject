import jwt, { JwtPayload } from "jsonwebtoken"
import { Request , Response , NextFunction } from "express"
import UserModel from "../models/user.model.js"

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export async function AuthCheck(req: Request,res: Response,next: NextFunction) {
    try {
        const token = req.cookies?.token

        if(!token) {
            return res.status(401).json({
            success: false,
            message: "No token provided"
            })
        }

        const payload = jwt.verify(token,process.env.JWT_SECRET as string) as MyJwtPayload

        if(!payload?.userId) {
            return res.status(401).json({
            success: false,
            message: "Token Payload Issue"
            })
        }

        const user = await UserModel.findById(payload.userId)

        if(!user) {
            return res.status(403).json({
            success: false,
            message: "User does not exists"
            })
        }

        req.user = user
        next()
    } catch (error) {

        if(error instanceof jwt.TokenExpiredError) {
            return res.status(400).json({
            success: false,
            message: "Token Expired"
            })
        }

        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
            success: false,
            message: "Invalid Token"
            })
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}