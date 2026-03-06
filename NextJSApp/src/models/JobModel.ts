import mongoose from "mongoose"

interface Job {
    title: string,
    description: string,
    uploadedBy: mongoose.Types.ObjectId,
    Proposals: mongoose.Types.ObjectId[]
}

const JobSchema = new mongoose.Schema<Job>(
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
    Proposals: [{
        type: mongoose.Types.ObjectId,
        ref: "Proposal"
    }]
    },{timestamps: true})

const JobModel = mongoose.models.Job || mongoose.model<Job>("Job", JobSchema)

export default JobModel