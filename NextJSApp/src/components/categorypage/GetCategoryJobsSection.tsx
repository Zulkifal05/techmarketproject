import GetCategoryJobs from "@/services/server/GetCategoryJobs"
import Postcard from "../mainpage/Postcard"

const GetCategoryJobsSection = async ({categoryName, pageTitle}: { categoryName: string; pageTitle: string }) => {

    const categoryJobs = await GetCategoryJobs(categoryName)

    if (categoryJobs && categoryJobs.length > 0) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {categoryJobs.map((job) => {
                    const jobKey = job._id ?? job.title
        
                    return <Postcard key={String(jobKey)} job={job} />
                })}
            </div>
        )
    } else {
         return (
            <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="text-lg font-semibold text-slate-900">No jobs found</p>
                <p className="mt-3 text-sm text-slate-600">
                    There are currently no jobs available under the {pageTitle} category. Check back later or explore another category.
                </p>
            </div>
        )
    }
}

export default GetCategoryJobsSection