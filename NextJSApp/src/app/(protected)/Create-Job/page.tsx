"use client"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import jobService from "@/services/client/JobService"
import { developmentCategories } from "@/constants/Categories"
import toast from "react-hot-toast"
import useAuthStore from "@/store/AuthStore"

export default function Page() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryInput, setCategoryInput] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [basePrice, setBasePrice] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {  // Redirect to home if not a buyer
    if(!user || user?.role !== "BUYER") {
      router.push("/")
    }
  },[user,router])

  const filteredCategorySuggestions = useMemo(() => {
    const query = categoryInput.trim().toLowerCase()
    if (!query) return []

    return developmentCategories
      .filter((category) => !selectedCategories.includes(category))
      .filter((category) => category.toLowerCase().includes(query))
      .slice(0, 8)
  }, [categoryInput, selectedCategories])

  const addCategory = (category: string) => {
    if (selectedCategories.includes(category) || selectedCategories.length >= 3) {
      return
    }
    setSelectedCategories((current) => [...current, category])
    setCategoryInput("")
  }

  const removeCategory = (category: string) => {
    setSelectedCategories((current) => current.filter((item) => item !== category))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedBasePrice = Number(basePrice)
    const categoryList = selectedCategories

    if (!title || !description || categoryList.length === 0 || !parsedBasePrice || parsedBasePrice <= 0) {
      toast.error("Please complete all fields with valid information.")
      return
    }

    setIsSubmitting(true)

    try {
      const createdJob = await jobService.CreateJob(title, description, categoryList, parsedBasePrice)

      if (createdJob) {
        toast.success("Job post created successfully.")
        router.push(`job/${createdJob?._id}`)
      } else {
        toast.error("Could not create job. Please try again.")
      }

    } catch (error) {

        if(error === "Unauthorized") {
          toast.error("You must be logged in to create a job post.")
          router.push("/login")
          return
        }

        toast.error("Something went wrong while creating the job.")
        console.error(error)
    } finally {
        setIsSubmitting(false)
    }
  }

  if(user?.role === "BUYER") return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-12 text-white sm:px-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-semibold">Create a New Job Post</h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100/90 sm:text-lg">
            Publish your requirements and attract top developers. Add the job details below, then manage your post from your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8 sm:p-12">
          <div className="grid gap-6">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Job title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Build a React e-commerce dashboard"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Job description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                placeholder="Describe the project, deliverables, and your expectations."
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="relative block">
                <span className="text-sm font-semibold text-slate-900">Categories</span>
                <input
                  value={categoryInput}
                  onChange={(event) => setCategoryInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      if (filteredCategorySuggestions.length > 0) {
                        addCategory(filteredCategorySuggestions[0])
                      }
                    }
                  }}
                  placeholder="Type to search categories"
                  className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {filteredCategorySuggestions.length > 0 && selectedCategories.length < 3 ? (
                  <div className="absolute left-0 right-0 z-10 mt-2 max-h-52 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
                    {filteredCategorySuggestions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => addCategory(category)}
                        className="block w-full px-4 py-3 text-left text-sm text-slate-900 transition hover:bg-slate-100"
                      >
                        {category.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
                    >
                      <span>{category.replace(/-/g, " ")}</span>
                      <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Select up to 3 categories from suggestions.
                </p>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Base price $</span>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="Enter base price"
                  className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-600">
                After posting, you will be able to monitor proposals and manage your jobs from your profile page.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Posting job..." : "Create Job Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
