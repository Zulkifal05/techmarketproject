import Link from "next/link"
import GetJobProposals from "@/services/server/GetJobProposals"

const JobProposalsSection = async ({ jobId }: { jobId: string }) => {
  const jobProposals = await GetJobProposals(jobId)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Job Proposals</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Proposals for this job</h2>
        </div>
      </div>

      {jobProposals && jobProposals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobProposals.map((proposal) => (
            <article
              key={proposal?._id}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {proposal?.title || "Untitled proposal"}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {proposal?.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm text-gray-600 mb-6">
                <div>
                  <p className="font-medium text-gray-900">Bid</p>
                  <p>${proposal?.Bid?.toLocaleString() ?? "0"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Status</p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      proposal?.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : proposal?.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : proposal?.status === "COMPLETED"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {proposal?.status ?? "PENDING"}
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <Link
                  href={`/Proposal/${proposal?._id}`}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View proposal details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-500">No proposals have been submitted for this job yet.</p>
          <p className="mt-3 text-gray-700">Check back later or share the job with qualified developers.</p>
        </div>
      )}
    </section>
  )
}

export default JobProposalsSection
