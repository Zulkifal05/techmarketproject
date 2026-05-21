import { Job } from "@/models/JobModel"
import { connectDB } from "@/utils/ConnectDB"
import JobModel from "@/models/JobModel"

type JobType = Job & {
    _id?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    uploadedBy?: {
        name?: string;
        email?: string;
    };
}       

export default async function GetJob(jobId: string) : Promise<JobType | null> {
    connectDB()
    try {
        const job = await JobModel.findById(jobId).populate("uploadedBy", "name email") // Populate the uploadedBy field with name and email

        if (!job) {
            return null
        }

        return job as JobType
    } catch (error) {
        console.error("Error fetching job:", error)
        return null
    }
}