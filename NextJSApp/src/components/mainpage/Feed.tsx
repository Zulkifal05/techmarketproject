"use client"
import { useEffect, useRef, useState } from "react"
import jobService from "@/services/JobService"
import Postcard from "./Postcard"
import { Job } from "@/models/JobModel"
import toast from "react-hot-toast"

const PAGE_SIZE = 10

type JobWithId = Job & { _id?: string; id?: string }

export default function Feed() {
  const [jobs, setJobs] = useState<JobWithId[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchJobs() {
      setIsLoading(true)

      try {
        const data = await jobService.GetJobsFeed(page, PAGE_SIZE)

        if (!isMounted) return

        if (!data || data.length === 0) {
          if (page === 1) {
            setJobs([])
          }
          setHasMore(false)
          return
        }

        setJobs((currentJobs) =>
          page === 1 ? data : [...currentJobs, ...data]
        )

        if (data.length < PAGE_SIZE) {
          setHasMore(false)
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
        toast.error("Failed to load jobs. Please try again later.")
        setHasMore(false)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchJobs()

    return () => {
      isMounted = false
    }
  }, [page])

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setPage((currentPage) => currentPage + 1)
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    )

    observer.observe(sentinelRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
        {isLoading && page === 1 ? (
          <p className="text-sm text-gray-500">Loading projects...</p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-6 justify-center">
        {jobs.map((job) => (
          <Postcard key={job._id} job={job} />
        ))}
      </div>

      {!isLoading && jobs.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          No projects available right now. Check back later.
        </p>
      ) : null}

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {isLoading && page > 1 ? (
        <p className="mt-6 text-center text-gray-500">Loading more projects...</p>
      ) : null}

      {!hasMore && jobs.length > 0 ? (
        <p className="mt-6 text-center text-gray-500">You have reached the end of the feed.</p>
      ) : null}
    </section>
  )
}
