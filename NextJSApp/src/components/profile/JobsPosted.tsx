import GetPostedJobs from "@/services/server/GetPostedJobs"
import { Briefcase , Users } from "lucide-react"
import Link from "next/link"
import DeleteJobBtn from "./DeleteJobBtn";

const JobsPosted = async ({ userId , userAllowedToUpdate} : { userId: string , userAllowedToUpdate: boolean }) => {
    const userJobs = await GetPostedJobs(userId);

    return (
      <>
      {/* Stats and Bio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 pb-2">
          {/* Stats */}
          <div className="flex flex-wrap gap-8 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userJobs?.length || 0}</p>
                <p className="text-sm text-gray-600">Projects Posted</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userJobs?.filter((job) => job.status === "COMPLETED").length || 0}</p>
                <p className="text-sm text-gray-600">Successful Hires</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posted Jobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Posted Projects</h2>
      
              {/* Projects List */}
              {(userJobs && userJobs?.length > 0) ? (
                <div className="flex flex-wrap gap-6">
                  {userJobs.map((job) => (
                    <div
                      key={job?._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition border border-gray-200 overflow-hidden group w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
                            {job?.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 shrink-0 ${
                            job?.status === 'OPEN'
                              ? 'bg-green-100 text-green-700'
                              : job?.status === 'PROGRESSING'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {job?.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {job?.description}
                        </p>
      
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {job?.categories.map((category) => (
                              <span
                                key={category}
                                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-200"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
      
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Base Price</p>
                            <span className="text-2xl font-bold text-gray-900">
                              ${job?.jobPrice.toLocaleString()}
                            </span>
                          </div>
                          <Link href={`/job/${job?._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                            View Details
                          </Link>
                          {userAllowedToUpdate && <DeleteJobBtn jobID={String(job?._id)}/>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">
                    No projects to display.
                  </p>
                </div>
              )}
            </div>
      </>
    )
}

export default JobsPosted