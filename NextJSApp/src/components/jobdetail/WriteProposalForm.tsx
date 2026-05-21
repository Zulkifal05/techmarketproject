"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import proposalService from "@/services/client/ProposalService"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const ProposalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  bid: z.number().min(0, "Bid must be a positive number"),
})

type ProposalFormValues = z.infer<typeof ProposalFormSchema>

const WriteProposalForm = ({ setShowProposalForm , proposalFor }: { setShowProposalForm: (show: boolean) => void; proposalFor: string }) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormValues>({
    resolver: zodResolver(ProposalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      bid: 0,
    },
  })

  const CreateProposal = async (data: z.infer<typeof ProposalFormSchema>) => {
    try {
        const submitResponse = await proposalService.CreateProposal(data.title, data.description, data.bid,proposalFor)

        if(!submitResponse) {
            toast.error("Failed to submit proposal. Please try again.")
        } else {
            toast.success("Proposal submitted successfully!")
            setShowProposalForm(false)
            router.push(`/Proposal/${submitResponse?._id}`)
        }
    } catch (error) {
        console.error("Error creating proposal:", error)
        toast.error("Failed to submit proposal. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => setShowProposalForm(false)}
      />
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Write a proposal</h2>
            <p className="mt-1 text-sm text-slate-500">
              Submit a proposal to the hirer with your title, description, and bid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowProposalForm(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 cursor-pointer"
            aria-label="Close proposal form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(CreateProposal)} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              {...register("title")}
              type="text"
              placeholder="Proposal title"
              aria-invalid={errors.title ? "true" : "false"}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.title ? (
              <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              {...register("description")}
              rows={6}
              placeholder="Describe how you will complete this job and why you are the best fit."
              aria-invalid={errors.description ? "true" : "false"}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.description ? (
              <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Bid</span>
            <input
              {...register("bid", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              placeholder="$100"
              aria-invalid={errors.bid ? "true" : "false"}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.bid ? <p className="mt-2 text-sm text-red-600">{errors.bid.message}</p> : null}
          </label>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowProposalForm(false)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 cursor-pointer"
            >
              Submit proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteProposalForm