import { Proposal } from "@/models/ProposalModel"
import { connectDB } from "@/utils/ConnectDB"
import ProposalModel from "@/models/ProposalModel"

type JobProposalType = Proposal & {
    _id?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export default async function GetJobProposals(jobId: string): Promise<JobProposalType[] | null> {
    connectDB()
    try {
        const proposals = await ProposalModel.find({ ProposalFor: jobId })

        if (!proposals || proposals.length === 0) {
            return null
        }

        return proposals as JobProposalType[]
    } catch (error) {
        console.error("Error fetching job proposals:", error)
        return null
    }
}