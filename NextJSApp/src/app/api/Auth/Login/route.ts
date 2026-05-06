import { User as UserModel } from "@techmarket/models"
import { NextResponse } from "next/server"
import { LoginSchema } from "@/schemas/LoginSchema"
import { connectDB } from "@/utils/ConnectDB"
import bcrypt from "bcryptjs"
import GenerateAccessAndRefreshToken from "@/utils/GenerateJWTTokens"

export async function POST(request: Request) {
    const { email, password } = await request.json()

    if(!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectDB()

    try {
        const parseResult = LoginSchema.safeParse({ email, password })

        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 })
        }

        const user = await UserModel.findOne({ email }).select("+password -refreshToken")

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const { accessToken , refreshToken } = await GenerateAccessAndRefreshToken(user._id)

        const userObject = user.toObject();
        delete userObject.password; // Remove password from user object

        const res = NextResponse.json({ success: true, message: "Login successful", user: userObject }, { status: 200 })

        res.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        })

        res.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 15 // 15 mins
        })

        return res
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "An error occurred while logging in" }, { status: 500 })
    }

}