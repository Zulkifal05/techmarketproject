import DisplayUserSection from "@/components/chatpage/DisplayUserSection"
import MessagesSection from "@/components/chatpage/MessagesSection"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { verifyJWT } from "@/utils/VerifyJWT"

const page = async ({ params }: { params: Promise<{ receiverId: string }> }) => {

  const { receiverId } = await params

  if(!receiverId) {
    notFound()
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if(!token) {
    redirect("/Login")
  }

  const user = await verifyJWT(token);

  if(!user) {
    redirect("/Login")
  }

  return (
    <div>
      <Suspense fallback={<div>Loading User...</div>}>
        <DisplayUserSection userId={receiverId}/>
      </Suspense>
      <MessagesSection receiver={receiverId} />
    </div>
  )
}

export default page