import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import JobModel from "@/models/JobModel"
import { ChangeJobStatusSchema } from "@/schemas/JobSchema"

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ message: "No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 })
        }

        if(user.role !== "BUYER") {
            return NextResponse.json({ message: "Only buyers can change job status", success: false }, { status: 403 })
        }
        
        const body = await req.json()
        const { jobId, status } = body

        if (!jobId || !status) {
            return NextResponse.json({ message: "Job ID and status are required", success: false }, { status: 400 })
        }

        const validationResult = ChangeJobStatusSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ message: "Invalid request data", success: false, errors: validationResult.error.flatten().fieldErrors }, { status: 400 })
        }

        const job = await JobModel.findById(jobId)

        if (!job) {
            return NextResponse.json({ message: "Job not found", success: false }, { status: 404 })
        }

        if (job.uploadedBy.toString() !== user.id) {
            return NextResponse.json({ message: "You are not authorized to change the status of this job", success: false }, { status: 403 })
        }

        job.status = status
        await job.save()

        return NextResponse.json({ message: "Job status updated successfully", success: true, job }, { status: 200 })
    } catch (error) {
        console.error("Error changing job status:", error)

        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: "Invalid request body", success: false }, { status: 400 })
        }

        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 })
    }
}
