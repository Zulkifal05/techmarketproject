import { notFound } from "next/navigation"
import GetJob from "@/services/server/GetJob"
import Link from "next/link"
import JobProposalsSection from "@/components/jobdetail/JobProposalsSection"
import { Suspense } from "react"
import WriteProposalSection from "@/components/jobdetail/WriteProposalSection"

const page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params

    if (!jobId) {
        notFound()
    }

    const job = await GetJob(jobId)

    if (!job) {
        notFound()
    }

    const postedDate = job?.createdAt
        ? new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
        : "Unknown"

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-12 text-white sm:px-12 sm:py-16">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-100/80">Job detail</p>
            <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">
                {job.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base text-blue-100/90 sm:text-lg">
                {job.description.length > 140
                ? `${job.description.slice(0, 140).trim()}...`
                : job.description}
            </p>
            </div>

            <div className="space-y-8 p-8 sm:p-12">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Base price</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">${job.jobPrice}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Status</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{job.status}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Posted</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{postedDate}</p>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Job details</h2>
                    <p className="mt-2 text-sm text-slate-600">
                    Full information about the job post and what you can expect as a buyer.
                    </p>
                </div>
                </div>
                <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
                <p>{job.description}</p>
                <div>
                    <p className="text-sm font-semibold text-slate-900">Categories</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                    {job.categories.map((category) => (
                        <span
                        key={category}
                        className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                        >
                        {category.replace(/-/g, " ")}
                        </span>
                    ))}
                    </div>
                </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:flex sm:items-center sm:justify-between">
                <div>
                <p className="text-sm font-semibold text-slate-900">Posted by</p>
                <p className="mt-3 text-base text-slate-700">
                    {job.uploadedBy?.name ? job.uploadedBy?.name : "Unknown user"}
                </p>
                </div>
                {job.uploadedBy ? (
                <Link
                    href={`/Profile/${String(job.uploadedBy?._id)}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:mt-0 sm:w-auto"
                >
                    View Poster Profile
                </Link>
                ) : null}
            </div>
            </div>
        </div>
        </div>

        {/* Write proposal section for developers */}
        {job?.status === "OPEN" && <WriteProposalSection proposalFor={String(job._id)} />}

        {/* Job proposals section */}
        <Suspense fallback={<h1 className="text-center text-2xl font-semibold text-gray-700">Loading proposals...</h1>}>
            <JobProposalsSection jobId={jobId} />
        </Suspense>
        </>
    )
}

export default page