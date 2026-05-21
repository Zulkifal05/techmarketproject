"use client"
import { useState } from "react"
import WriteProposalForm from "./WriteProposalForm"
import useAuthStore from "@/store/AuthStore"

const WriteProposalSection = ({proposalFor}: { proposalFor: string }) => {
    const [showProposalForm, setShowProposalForm] = useState(false)
    const user = useAuthStore((state) => state.user)

    return (
        <>
        { user?.role === "SELLER" &&
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900">Write a proposal</h2>
                <p className="mt-2 text-gray-600">
                    Submit a proposal to work on this job. Include details about your experience and how you can help.
                </p>
                <button className="mt-4 inline-flex items-center justify-center rounded-2xl border border-transparent bg-blue-600 px-3 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                onClick={() => setShowProposalForm(true)}
                >
                    Write Proposal
                </button>
            </div>
        </div>
        }
        {showProposalForm && <WriteProposalForm setShowProposalForm={setShowProposalForm} proposalFor={proposalFor} />}
        </>
    )
}

export default WriteProposalSection