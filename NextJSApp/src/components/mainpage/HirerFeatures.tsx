import Link from "next/link"

type HirerFeaturesProps = {
  user: { _id?: string }
}

const HirerFeatures = ({ user }: HirerFeaturesProps) => {
  const profileLink = user?._id ? `/Profile/${user._id}` : "/"

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-1 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.1)]">
          <div className="h-full rounded-[1.75rem] bg-white px-8 py-10 sm:px-10 sm:py-12">
            <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-200">
              Power up hiring
            </div>
            <h2 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900">Create Job</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Post a new job and attract top dev talent with a clear, polished brief.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/Create-Job"
                className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
              >
                Create Job Post
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-1 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.1)]">
          <div className="h-full rounded-[1.75rem] bg-white px-8 py-10 sm:px-10 sm:py-12">
            <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-200">
              My listings
            </div>
            <h2 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900">View Jobs</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Review your active postings and manage proposals from your profile page.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={profileLink}
                className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
              >
                View My Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HirerFeatures