"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import authService from "@/services/client/AuthService"

const SignoutBtn = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const response = await authService.Logout()

      if (!response) {
        toast.error("Logout failed. Please try again.")
        return
      }

      toast.success("Signed out successfully.")
      router.push("/Login")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Unable to sign out right now.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </button>
  )
}

export default SignoutBtn