import { Briefcase , Users } from "lucide-react"
import Link from "next/link"
import DeleteJobBtn from "./DeleteJobBtn"
import GetProposals from "@/services/server/GetProposals"

const JobsPosted = async ({ userId , userAllowedToUpdate} : { userId: string , userAllowedToUpdate: boolean }) => {

    // TODO: Add pagination for this component if the user has more than 10 posted jobs
    const userProposals = await GetProposals(userId);

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
                <p className="text-2xl font-bold text-gray-900">{userProposals?.length || 0}</p>
                <p className="text-sm text-gray-600">Proposals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userProposals?.filter((proposal) => proposal.status === "ACCEPTED").length || 0}</p>
                <p className="text-sm text-gray-600">Successful Proposals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posted Jobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Posted Proposals</h2>
      
              {/* Projects List */}
              {(userProposals && userProposals?.length > 0) ? (
                <div className="flex flex-wrap gap-6">
                  {userProposals.map((proposal) => (
                    <div
                      key={proposal?._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition border border-gray-200 overflow-hidden group w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
                            {proposal?.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 shrink-0 ${
                            proposal?.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-700'
                              : proposal?.status === 'PENDING'
                              ? 'bg-blue-100 text-blue-700'
                              : proposal?.status === 'REJECTED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {proposal?.status}
                          </span>
                        </div>
      
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {proposal?.description}
                        </p>
      
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Bid</p>
                            <span className="text-2xl font-bold text-gray-900">
                              ${proposal?.Bid?.toLocaleString()}
                            </span>
                          </div>
                          <Link href={`/Proposal/${proposal?._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                            View Details
                          </Link>
                          {userAllowedToUpdate && <DeleteJobBtn jobID={String(proposal?._id)}/>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals found</h3>
                  <p className="text-gray-600">
                    No proposals to display.
                  </p>
                </div>
              )}
            </div>
      </>
    )
}

export default JobsPosted