import JobModel, { Job } from "@/models/JobModel"
import { connectDB } from "@/utils/ConnectDB"

type JobType = Job & {
    _id?: string;
}

export default async function GetCategoryJobs(categoryName: string): Promise<JobType[] | null> {
    connectDB()
    try {
        const jobs = await JobModel.find({ categories: categoryName }).sort({ createdAt: -1 })

        if(!jobs || jobs.length === 0) {
            return null
        }

        return jobs as JobType[]
    } catch (error) {
        console.error("Error fetching jobs for category:", error)
        return null
    }
}