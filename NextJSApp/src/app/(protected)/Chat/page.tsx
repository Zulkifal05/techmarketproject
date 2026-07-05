import { MessageSquareText } from "lucide-react"
import { getUser } from "@/services/server/GetUser"
import { redirect } from "next/navigation"

const page = async () => {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-100 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 text-white">
          <MessageSquareText className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Messaging made simple
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
          Stay in touch with clients, collaborators, and teammates through a clean and straightforward messaging experience.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {user?.name ? `Welcome back, ${user.name}.` : "Welcome back."}
        </div>
      </div>
    </div>
  )
}

export default page