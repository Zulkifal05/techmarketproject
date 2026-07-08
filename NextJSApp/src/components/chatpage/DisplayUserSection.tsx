import GetSpecificUser from "@/services/server/GetSpecificUser"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const DisplayUserSection = async ({ userId }: { userId : string}) => {

  const user = await GetSpecificUser(userId)

  if(!user) {
    notFound()
  }

  return (
    <div className="flex px-3 justify-between">
      <div className="flex items-center gap-2">
          <Image
            src={user?.profilePicture || "/Default-Avatar.png"}
            alt={user?.name || "User"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="font-bold text-[1.3rem]">{user?.name}</h1>
            <p className="text-[12px]">{user?.role === "BUYER" ? "Hirer" : "Developer" }</p>
          </div>
      </div>
      <Link href={`/Profile/${user?._id}`} className="bg-linear-to-br from-blue-600 to-purple-600 my-5 py-1 px-2 rounded-xl text-white">Go To Profile</Link>
    </div>
  )
}

export default DisplayUserSection