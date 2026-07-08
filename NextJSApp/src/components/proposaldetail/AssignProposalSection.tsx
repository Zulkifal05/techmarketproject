import { getUser } from "@/services/server/GetUser"
import AssignJobBtn from "./AssignJobBtn"
import RejectProposalBtn from "./RejectProposalBtn"

const AssignProposalSection = async ({ proposalJobOwner , jobId , proposalId , proposerId }: { proposalJobOwner: string; jobId: string; proposalId: string; proposerId: string }) => {
	const user = await getUser()

	const loggedInUserId = user?._id ? String(user._id) : null

	const canAssign = loggedInUserId && proposalJobOwner && String(loggedInUserId) === String(proposalJobOwner)

	if (!canAssign) return null

	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<p className="text-sm font-semibold text-slate-900">Manage proposal</p>
			<p className="mt-2 text-sm text-slate-600">As the job owner you can assign this job to the proposer.</p>

			<div className="mt-4 flex items-center gap-3">
				<AssignJobBtn jobId={jobId} proposalId={proposalId} proposerId={proposerId}/>
				<RejectProposalBtn proposalId={proposalId} />
			</div>
		</div>
	)
}

export default AssignProposalSection