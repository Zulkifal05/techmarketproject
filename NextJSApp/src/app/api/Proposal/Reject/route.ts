import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import ProposalModel from "@/models/ProposalModel"
import JobModel from "@/models/JobModel"
import { headers } from "next/headers"
import { DeleteProposalSchema } from "@/schemas/ProposalSchema"
//This schema is used to validate the request body for deleting a proposal which is also a mongoose object id

export async function POST(req: Request) {
    try {
        const headerList = await headers()
        const token = headerList.get("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized: Invalid token", success: false }, { status: 401 })
        }

        if(user.role !== "BUYER") {
            return NextResponse.json({ error: "Forbidden: Only BUYERs can reject proposals", success: false }, { status: 403 })
        }

        const body = await req.json()
        const validation = DeleteProposalSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors, success: false }, { status: 400 })
        }

        const { proposalId } = body
        
        //First we need to check if the proposal and job associated with it exists and then check if the user is the owner of the job associated with the proposal before rejecting it
        const proposal = await ProposalModel.findById(proposalId)

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found", success: false }, { status: 404 })
        }

        const job = await JobModel.findById(proposal.ProposalFor)

        if (!job) {
            return NextResponse.json({ error: "Associated job with Proposal not found", success: false }, { status: 404 })
        }

        if (job.uploadedBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden: You are not the owner of the job associated with this proposal", success: false }, { status: 403 })
        }

        proposal.status = "REJECTED"
        await proposal.save()

        return NextResponse.json({ message: "Proposal rejected successfully", success: true }, { status: 200 })
    } catch (error) {
        console.error("Error rejecting proposal:", error)

        if(error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON format", success: false }, { status: 500 })
        }

        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 })
    }
}