"use client"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import jobService from "@/services/client/JobService"
import { useRouter } from "next/navigation"

const DeleteJobBtn = ({ jobID }: { jobID: string }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter(); 

    const handleDeleteJob = async (jobId: string) => {
        try {
            setIsDeleting(true);
            const deletePromise = await jobService.DeleteJob(jobId);

            if(!deletePromise) {
                toast.error("Failed to delete the job. Please try again.")
                return;
            }

            toast.success("Job deleted successfully.");
            router.refresh(); // Refresh the page to reflect the changes
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Failed to delete the job. Please try again.")
        } finally {
            setIsDeleting(false);
        }
    }

  return (
    <button
    onClick={() => handleDeleteJob(jobID)}
    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition cursor-pointer"
    title="Delete job"
    disabled={isDeleting}
    >
        <Trash2 className="w-4 h-4" />
    </button>
  )
}

export default DeleteJobBtn