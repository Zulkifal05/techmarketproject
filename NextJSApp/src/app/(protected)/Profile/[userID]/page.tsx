import { Mail } from "lucide-react"
import Image from "next/image"
import { verifyJWT } from "@/utils/VerifyJWT"
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation"
import GetSpecificUser from "@/services/server/GetSpecificUser"
import JobsPosted from "@/components/profile/JobsPosted"
import Proposals from "@/components/profile/Proposals"
import { Suspense } from "react"
import SignoutBtn from "@/components/profile/SignoutBtn";
import { string } from "zod";

export default async function ProfilePage({ params }: { params: Promise<{ userID: string }> }) {

    const { userID } = await params;
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value as string;

    if(!token) {
      redirect("/Login");
    }

    const loggedInUser = await verifyJWT(token)  // Verify the JWT token to get the logged-in user's information

    if(!loggedInUser) {
      redirect("/Login");
    }

    const userProfile = await GetSpecificUser(userID);  // Fetch the profile data of the user being viewed

    if(!userProfile) {
      notFound();
    }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Profile Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <Image
                src="/Default-Avatar.png"
                alt="Profile Picture"
                className="w-28 h-28 rounded-xl object-cover"
                width={112}
                height={112}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{userProfile?.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{userProfile?.role === "BUYER" ? "Hirer" : "Developer"}</p>

              <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userProfile?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      { userProfile?.role === "BUYER" ? 
        <Suspense fallback={<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500">Loading posted jobs...</div>}>
          <JobsPosted userId={String(userProfile?._id)} userAllowedToUpdate={String(loggedInUser?._id) === String(userProfile?._id)}/>
        </Suspense> :
        <Suspense fallback={<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-gray-500">Loading proposals...</div>}>
          <Proposals userId={String(userProfile?._id)} userAllowedToUpdate={String(loggedInUser?._id) === String(userProfile?._id)}/>
        </Suspense>}

        {/* Signout Button - Only show if the logged-in user is viewing their own profile */ }
        { String(loggedInUser?._id) === String(userProfile?._id) && 
        <div className="flex justify-end px-3">
          <SignoutBtn />
        </div> }
      </div>
      )
}
