import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import JobModel from "@/models/JobModel"
import ProposalModel from "@/models/ProposalModel"
import { DeleteJobSchema } from "@/schemas/JobSchema"

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ message: "Unauthorized: Invalid token", success: false }, { status: 401 })
        }

        if(user.role !== "BUYER") { 
            return NextResponse.json({ message: "Only BUYERS are authorized", success: false }, { status: 403 })
        }

        const { jobId } = await req.json()

        if (!jobId) {
            return NextResponse.json({ message: "Job ID is required", success: false }, { status: 400 })
        }

        const validatedData = DeleteJobSchema.safeParse({ jobId })

        if (!validatedData.success) {
            return NextResponse.json({ message: `Validation error`,errors: validatedData.error.flatten().fieldErrors, success: false }, { status: 400 })
        }

        const job = await JobModel.findById(jobId)

        if (!job) {
            return NextResponse.json({ message: "Job not found", success: false }, { status: 404 })
        }

        if (job.uploadedBy.toString() !== user.id) {
            return NextResponse.json({ message: "You are not authorized to delete this job", success: false }, { status: 403 })
        }

        // Delete associated proposals with the job
        await ProposalModel.deleteMany({ ProposalFor: job._id })

        await JobModel.findByIdAndDelete(jobId)

        return NextResponse.json({ message: "Job deleted successfully", success: true }, { status: 200 })
    } catch (error) {
        console.error("Error deleting job:", error)

        if(error instanceof SyntaxError) {
            return NextResponse.json({ message: "Invalid JSON in request body", success: false }, { status: 500 })
        }

        return NextResponse.json({ message: "Failed to delete job", success: false }, { status: 500 })
    }
}