import { notFound } from "next/navigation"
import GetCategoryJobsSection from "@/components/categorypage/GetCategoryJobsSection"
import { Suspense } from "react"

const formatCategoryTitle = (category: string) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const page = async ({ params }: { params: Promise<{ categoryName: string }> }) => {
  const { categoryName } = await params

  if (!categoryName) {
    notFound()
  }

  const pageTitle = formatCategoryTitle(categoryName)

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-12 text-white sm:px-12 sm:py-16">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-100/80">Category</p>
            <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">{pageTitle}</h1>
            <p className="mt-5 max-w-3xl text-base text-blue-100/90 sm:text-lg">
              Browse the latest jobs matching the <span className="font-semibold">{pageTitle}</span> category.
            </p>
          </div>

          <div className="p-8 sm:p-12">
            <Suspense fallback={<div>Loading...</div>}>
              <GetCategoryJobsSection categoryName={categoryName} pageTitle={pageTitle} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page