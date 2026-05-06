import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import JobModel from "@/models/JobModel"

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("accessToken")?.value

        if (!token) {
            return NextResponse.json({ error: "No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ error: "Invalid token", success: false }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)

        const page = Number(searchParams.get("page")) || 1
        const limit = Number(searchParams.get("limit")) || 10
        const skip = (page - 1) * limit

        const jobs = await JobModel.find().skip(skip).limit(limit).sort({ createdAt: -1 })

        return NextResponse.json({ message: "Job feed fetched successfully", jobs, success: true }, { status: 200 })
    } catch (error) {
        console.error("Error fetching job feed:", error)
        return NextResponse.json({ error: "Failed to fetch job feed", success: false }, { status: 500 })   
    }
}