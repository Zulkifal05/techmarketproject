import { notFound } from "next/navigation"
import Link from "next/link"
import GetProposal from "@/services/server/GetProposal"
import AssignProposalSection from "@/components/proposaldetail/AssignProposalSection"
import { Suspense } from "react"

const page = async ({ params }: { params: Promise<{ proposalId: string }> }) => {
  const { proposalId } = await params

  if (!proposalId) {
    notFound()
  }

  const proposal = await GetProposal(proposalId)

  if (!proposal) {
    notFound()
  }

  const createdDate = proposal.createdAt
    ? new Date(proposal.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown"

  const descriptionPreview = proposal.description?.length > 140
    ? `${proposal.description.slice(0, 140).trim()}...`
    : proposal.description

  return (
    <>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-12 text-white sm:px-12 sm:py-16">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-100/80">Proposal detail</p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">{proposal.title}</h1>
          <p className="mt-5 max-w-3xl text-base text-blue-100/90 sm:text-lg">{descriptionPreview}</p>
        </div>

        <div className="space-y-8 p-8 sm:p-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Bid</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">${proposal.Bid?.toLocaleString() ?? "0"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Status</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{proposal.status}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Submitted</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{createdDate}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Proposal description</h2>
                <p className="mt-2 text-sm text-slate-600">Full details on the bid and the work requested for this job.</p>
              </div>
            </div>
            <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
              <p>{proposal.description}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Submitted by</p>
              <p className="mt-4 text-base font-semibold text-slate-900">{proposal.uploadedBy?.name ?? "Unknown seller"}</p>
              {proposal.uploadedBy?.email ? <p className="mt-2 text-sm text-slate-600">{proposal.uploadedBy.email}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Proposal for</p>
              <p className="mt-4 text-base font-semibold text-slate-900">{proposal.ProposalFor?.title ?? "Unknown job"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {proposal.ProposalFor?._id ? (
              <Link
                href={`/job/${proposal.ProposalFor._id}`}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
              >
                View job details
              </Link>
            ) : null}

            {proposal.uploadedBy?._id ? (
              <Link
                href={`/Profile/${proposal.uploadedBy._id}`}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
              >
                View proposer profile
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>

        {proposal?.status === "PENDING" && 
          <Suspense fallback={<h1>...</h1>}>
              <AssignProposalSection proposalJobOwner={proposal.ProposalFor?.uploadedBy ?? ""} jobId={String(proposal.ProposalFor?._id) ?? ""} proposalId={String(proposal._id) ?? ""} />
          </Suspense> 
        }
    </>
    )
}

export default page


