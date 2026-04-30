import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import ProposalModel from "@/models/ProposalModel"
import { headers } from "next/headers"
import { DeleteProposalSchema } from "@/schemas/ProposalSchema"

export async function DELETE(req: Request, { params }: { params: { proposalId: string } }) {
    try {
        const headerList = await headers()
        const token = headerList.get("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if (!user) {
            return NextResponse.json({ message: "Unauthorized: Invalid token", success: false }, { status: 401 })
        }

        if (user.role !== "SELLER") {
            return NextResponse.json({ message: "Forbidden: Only SELLERs can delete proposals", success: false }, { status: 403 })
        }

        const { proposalId } = params
        const body = { proposalId }
        const validation = DeleteProposalSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.flatten().fieldErrors.proposalId?.[0], success: false }, { status: 400 })
        }

        const proposal = await ProposalModel.findByIdAndDelete(proposalId)

        if (!proposal) {
            return NextResponse.json({ message: "Proposal not found", success: false }, { status: 404 })
        }

        return NextResponse.json({ message: "Proposal deleted successfully", success: true }, { status: 200 })
    } catch (error) {
        console.error("Error deleting proposal:", error)

        if(error instanceof SyntaxError) {
            return NextResponse.json({ message: "Invalid JSON format", success: false }, { status: 400 })
        }

        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 })
    }
}