import { Job } from "@/models/JobModel"
import Link from "next/link"

type PostcardProps = {
  job: Job & { _id?: string; id?: string }
}

export default function Postcard({ job }: PostcardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition border border-gray-200 overflow-hidden group max-w-87.5 min-w-87.5 p-1" >
              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">{job.title}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {job.description}
                </p>

                {/* Categories */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                      {job.categories.map((category,index) => (
                        <span
                        className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-200"
                        key={`${category}-${index}`}
                      >
                        {category}
                      </span>
                      ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Base Price</p>
                    <span className="text-2xl font-bold text-gray-900">
                      ${job.jobPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/job/${job._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm cursor-pointer">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
    )
}