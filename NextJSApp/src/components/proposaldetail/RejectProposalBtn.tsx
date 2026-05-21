"use client"
import proposalService from "@/services/client/ProposalService"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const RejectProposalBtn = ({proposalId}: { proposalId: string }) => {
	const [isDeleting, setIsDeleting] = useState(false)
	const router = useRouter()

	async function RejectProposal() {
		try {
			setIsDeleting(true)

			const rejectResult = await proposalService.RejectProposal(proposalId)

			if(rejectResult) {
				toast.success("Proposal rejected successfully!")
				router.push("/")
			} else {
				toast.error("Failed to reject proposal. Please try again.")
			}
		} catch (error) {
			console.error("Error rejecting proposal:", error)
			toast.error("Failed to reject proposal. Please try again.")
			return
		} finally {
			setIsDeleting(false)
		}
	}
	return (
		<button
			className="inline-flex items-center justify-center rounded-3xl bg-red-600 border border-slate-200 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
			onClick={RejectProposal}
			disabled={isDeleting}
		>
			{isDeleting ? "Rejecting..." : "Reject this proposal"}
		</button>
  )
}

export default RejectProposalBtn