import { verifyJWT } from "@/utils/VerifyJWT"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const headerList = await headers()
        const token = headerList.get("Authorization")?.replace("bearer ","")

        if (!token) {
            return NextResponse.json({ error: "No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if(!user) {
            return NextResponse.json({ error: "Invalid token", success: false }, { status: 401 })
        }

        return NextResponse.json({ user, success: true }, { status: 200 })  
    } catch (error) {
        console.error("Error in GetMe route:", error)
        return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 })
    }
}