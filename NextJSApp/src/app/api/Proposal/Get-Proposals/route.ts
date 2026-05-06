import { NextResponse } from "next/server"
import { verifyJWT } from "@/utils/VerifyJWT"
import ProposalModel from "@/models/ProposalModel"
import { cookies } from "next/headers"

export async function GET() {
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

        if(user.role !== "SELLER") {
            return NextResponse.json({ error: "Forbidden: Only SELLERs can get proposals", success: false }, { status: 403 })
        }

        const proposals = await ProposalModel.find({ uploadedBy: user._id })

        if (!proposals  || proposals.length === 0) {
            return NextResponse.json({ error: "No proposals found for this user", success: true }, { status: 200 })
        }

        return NextResponse.json({ message: "Proposals fetched successfully", proposals, success: true }, { status: 201 })

    } catch (error) {
        console.error("Error fetching proposals:", error)

        if(error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON format", success: false }, { status: 500 })
        }

        return NextResponse.json({ message: "Failed to fetch proposals", success: false }, { status: 500 })
    }
}