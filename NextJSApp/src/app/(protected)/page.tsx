import CategoriesBanner from "@/components/mainpage/CategoriesBanner"
import Feed from "@/components/mainpage/Feed"
import HirerFeatures from "@/components/mainpage/HirerFeatures"
import { getUser } from "@/services/server/GetUser"
import { redirect } from "next/navigation"

export default async function Page() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Welcome {user?.name || "to TechMarket"}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Your one-stop platform for connecting developers and clients to build, hire, and grow in tech.
            </p>
          </div>
        </div>
      </div>

      { user?.role === "SELLER" ? 
        <>
          <CategoriesBanner />
          <Feed />
        </> : 
        <HirerFeatures user={user} /> }
    </>
  )
}