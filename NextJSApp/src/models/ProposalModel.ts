import mongoose from "mongoose"

interface Proposal {
    title: string,
    description: string,
    uploadedBy: mongoose.Types.ObjectId,
    Bid: number,
    ProposalFor: mongoose.Types.ObjectId
    status?: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"
}

const ProposalSchema = new mongoose.Schema<Proposal>(
    {
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    uploadedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "UploadedBy is required"]
    },
    Bid: {
        type: Number,
        required: [true, "Bid is required"]
    },
    ProposalFor: {
        type: mongoose.Types.ObjectId,
        ref: "Job",
        required: [true, "ProposalFor is required"]
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"],
        default: "PENDING",
    }
    },{timestamps: true})

const ProposalModel = mongoose.models.Proposal || mongoose.model<Proposal>("Proposal", ProposalSchema)

export default ProposalModel