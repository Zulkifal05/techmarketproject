import { connectDB } from "@/utils/ConnectDB"
import { Job } from "@/models/JobModel"
import JobModel from "@/models/JobModel"

type JobType = Job & {
    _id?: string;
}

export default async function GetPostedJobs(userId: string) : Promise<JobType[] | null> {
    connectDB();
    try {
        const jobs = await JobModel.find({ uploadedBy: userId }).lean();

        if(!jobs) {
            return null;
        }

        return jobs;
    } catch (error) {
        console.error("Error fetching posted jobs:", error);
        return null;
    }
}