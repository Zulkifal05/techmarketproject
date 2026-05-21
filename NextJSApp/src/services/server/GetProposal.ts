import ProposalModel, { Proposal } from "@/models/ProposalModel"
import { connectDB } from "@/utils/ConnectDB"

type ProposalType = Proposal & {
    _id?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    uploadedBy?: {
        _id?: string;
        name?: string;
        email?: string;
    };
    ProposalFor?: {
        _id?: string;
        title?: string;
        uploadedBy?: string;
    };
}

export default async function GetProposal(proposalId: string): Promise<ProposalType | null> {
    connectDB()
    try {
        const proposal = await ProposalModel.findById(proposalId)
            .populate("uploadedBy", "name email")
            .populate("ProposalFor", "title uploadedBy")

        if(!proposal) {
            return null
        }

        return proposal as ProposalType
    } catch (error) {
        console.error("Error fetching proposal:", error)
        return null
    }
}