import { connectDB } from "@/utils/ConnectDB"
import ProposalModel from "@/models/ProposalModel"
import { Proposal } from "@/models/ProposalModel"

type Proposals = Proposal & {
    _id?: string;
}

export default async function GetProposals(userID: string) : Promise<Proposals[] | null> {
    connectDB();
    try {
        const proposals = await ProposalModel.find({ uploadedBy: userID }).lean();

        if(!proposals) {
            return null;
        }

        return proposals
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return null;
    }
}