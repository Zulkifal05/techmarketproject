import GenerateAccessAndRefreshToken from "@/utils/GenerateJWTTokens"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import UserModel from "@/models/UserModel"
import { connectDB } from "@/utils/ConnectDB"

export async function GET() {
    connectDB()
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("refreshToken")?.value

        if(!token) {
            return NextResponse.json({error: "No refresh token", success: false}, { status : 400 })
        }

        const decoded = jwt.verify(token as string , process.env.NEXT_JWT_SECRET!) as JwtPayload

        const user = await UserModel.findById(decoded?.userId)

        if(!user) {
            return NextResponse.json({error: "Invalid ID in payload", success: false}, { status : 401 })
        }

        if(user.refreshToken !== token) {
            return NextResponse.json({error: "Invalid refresh token", success: false}, { status : 403 })
        }

        const { accessToken , refreshToken } = await GenerateAccessAndRefreshToken(user._id)

        const res = NextResponse.json({message: "Token refreshed successfuly", success: true, accessToken}, { status : 200 })

        res.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        })

        return res
    } catch (error) {
        console.error(error)

        if(error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({
            success: false,
            message: "Token Expired"
            }, { status: 400 })
        }

        if(error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({
            success: false,
            message: "Invalid Token"
            }, { status: 400 })
        }

        return NextResponse.json({error: "Internal Server Error", success: false}, { status : 500 })
    }
}