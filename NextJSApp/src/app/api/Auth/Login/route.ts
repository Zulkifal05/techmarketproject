import UserModel from "@/models/UserModel"
import { NextResponse } from "next/server"
import { LoginSchema } from "@/schemas/LoginSchema"
import { connectDB } from "@/utils/ConnectDB"
import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"

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

        const user = await UserModel.findOne({ email }).select("+password")

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const payload = { userId: user._id };
        const secret = process.env.NEXT_JWT_SECRET!;
        const expiresIn = "5d"; // Token expires in 5 days
        const options: SignOptions = { expiresIn };

        const token = jwt.sign(payload, secret, options);

        const userObject = user.toObject();
        delete userObject.password; // Remove password from user object

        const res = NextResponse.json({ success: true, message: "Login successful", user: userObject }, { status: 200 })

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 5 * 24 * 60 * 60, // 5 days in seconds
        })

        return res
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "An error occurred while logging in" }, { status: 500 })
    }

}