import { verifyJWT } from "@/utils/VerifyJWT"
import { NextResponse } from "next/server"
import { CreateProposalSchema } from "@/schemas/ProposalSchema"
import { cookies } from "next/headers"
import JobModel from "@/models/JobModel"
import ProposalModel from "@/models/ProposalModel"

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("accessToken")?.value

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized: Invalid token", success: false }, { status: 401 })
        }

        if (user.role !== "SELLER") {
            return NextResponse.json({ error: "Forbidden: Only SELLERS can create proposals", success: false }, { status: 403 })
        }

        const requestData = await request.json()
        const validationResult = CreateProposalSchema.safeParse(requestData)

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors, success: false }, { status: 400 })
        }

        const { title, description, Bid, ProposalFor } = requestData

        const job = await JobModel.findById(ProposalFor)

        if (!job) {
            return NextResponse.json({ error: "Job not found", success: false }, { status: 404 })
        }

        const newProposal = await ProposalModel.create({
            title,
            description,
            uploadedBy: user._id,
            Bid,
            ProposalFor,
        })

        if (!newProposal) {
            return NextResponse.json({ error: "Failed to create proposal", success: false }, { status: 500 })
        }

        return NextResponse.json({ message: "Proposal created successfully", proposal: newProposal, success: true }, { status: 201 })
    } catch (error) {
        console.error("Error creating proposal:", error)

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON data", success: false }, { status: 400 })
        }

        return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 })
    }
}