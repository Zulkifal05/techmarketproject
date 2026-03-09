import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import JobModel from "@/models/JobModel"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: No token provided", success: false }, { status: 401 })
        }
        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized: Invalid token", success: false }, { status: 401 })
        }

        if(user.role !== "BUYER") {
            return NextResponse.json({ error: "Forbidden: Only BUYERS are allowed", success: false }, { status: 403 })
        }

        const jobs = await JobModel.find({ uploadedBy: user._id }).sort({ createdAt: -1 })

        if(!jobs || jobs.length === 0) {
            return NextResponse.json({ error: "User has no Jobs", success: true, jobs }, { status: 201 })
        }

        return NextResponse.json({ message: "Jobs fetched successfully", jobs, success: true }, { status: 200 })
    } catch (error) {
        console.error("Error fetching jobs:", error)

        if(error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON in request body", success: false }, { status: 500 })
        }

        return NextResponse.json({ error: "Failed to fetch jobs", success: false }, { status: 500 })
    }
}