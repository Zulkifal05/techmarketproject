"use client"
import jobService from "@/services/client/JobService"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

const AssignJobBtn = ({jobId, proposalId}: { jobId: string; proposalId: string }) => {
	const [isAssigning, setIsAssigning] = useState(false)
	const router = useRouter()

	async function AssignJob() {
		try {
			setIsAssigning(true)
			const assignResult = await jobService.AssignJob(jobId, proposalId)

			if(assignResult) {
				toast.success("Job assigned successfully!")
				router.push("/Chat")
			} else {
				toast.error("Failed to assign job. Please try again.")
			}
		} catch (error) {
			console.error("Error assigning job:", error)
			toast.error("Failed to assign job. Please try again.")
			return
		} finally {
			setIsAssigning(false)
		}
	}

	return (
		<button
		className="inline-flex items-center justify-center rounded-3xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 cursor-pointer"
		onClick={AssignJob}
		disabled={isAssigning}
		>
			{isAssigning ? "Assigning..." : "Assign this job"}
		</button>
	)
}

export default AssignJobBtn