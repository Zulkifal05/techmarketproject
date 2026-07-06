"use client"
import React, { useRef, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import UploadFileToCloudinary from "@/services/client/UploadFileToCloudinary"
import { useRouter } from "next/navigation"
import authService from "@/services/client/AuthService"

type ProfileImageProps = {
  src: string
  userAllowedToUpdate: boolean
}

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]

const ProfileImage = ({ src, userAllowedToUpdate }: ProfileImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>(src || "/Default-Avatar.png")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const handleImageClick = () => {
    if (userAllowedToUpdate) {
      fileInputRef.current?.click()
      return
    }

    setIsPreviewOpen(true)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedImageTypes.includes(file.type)) {
      const message = "Invalid image format. Please upload JPG, PNG, WEBP or GIF."
      toast.error(message)
      return
    }

    const toastId = toast.loading("Uploading image...")

    let uploadedUrl = null

    try {
      uploadedUrl = await UploadFileToCloudinary(file)
    } catch (error) {
      if(error instanceof Error && error.message === "UnAuthorized") {
        toast.dismiss(toastId)
        toast.error("You are not authorized to upload images.")
        router.push("/Login")
      }
    }

    toast.dismiss(toastId)

    if (uploadedUrl) {  // If file uploaded successfully, update the imageUrl state and show success toast and update the profile image on the server
      setImageUrl(uploadedUrl)
      toast.success("Profile image uploaded successfully")

      try {
        await authService.UpdateProfilePicture(uploadedUrl);  // Update the profile picture on the server only
      } catch (error) {
        if(error instanceof Error && error.message === "Logout the User") {
          router.push("/Login")
        }
      }
    } else {  // If file upload failed, show error toast
      const message = "Upload failed. Please try again."
      toast.error(message)
    }
  }

  return (
    <div className="relative inline-block">
      <button type="button" onClick={handleImageClick} className="group focus:outline-none cursor-pointer">
        <Image
          src={imageUrl}
          alt="Profile Picture"
          className="w-28 h-28 rounded-xl object-cover"
          width={112}
          height={112}
          unoptimized
        />
        {userAllowedToUpdate && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center rounded-b-xl bg-black/30 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            Edit photo
          </span>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-w-xl rounded-3xl bg-white p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Close
            </button>
            <div className="max-h-[80vh] overflow-hidden rounded-2xl">
              <Image src={imageUrl} alt="Profile preview" className="h-full w-full object-contain" width={800} height={800} unoptimized />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileImage
