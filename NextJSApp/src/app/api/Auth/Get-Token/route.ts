import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if(!accessToken) {
            return NextResponse.json({ message: "No access token", success: false }, { status: 400 })
        }

        return NextResponse.json({ message: "Token fetched Successfully", success: true, accessToken }, { status: 200 })
    } catch (error) {
        console.error("Error in get token",error)

        return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 })
    }
}