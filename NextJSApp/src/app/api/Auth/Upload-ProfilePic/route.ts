import { verifyJWT } from "@/utils/VerifyJWT"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import isCloudinaryUrl from "@/utils/CloudinaryLinkCheck"

export async function POST(req: Request) {
    try {
        const { profilePicture } = await req.json()

        if(!profilePicture || typeof profilePicture !== "string" || profilePicture.length === 0) {
            return NextResponse.json({ error: "Profile picture URL is required,must be a non-empty string", success: false }, { status: 400 })
        }

        if(!isCloudinaryUrl(profilePicture)) {
            return NextResponse.json({ error: "Invalid profile picture URL. Only Cloudinary URLs are allowed.", success: false }, { status: 400 })
        }

        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "No token provided", success: false }, { status: 401 })
        }

        const user = await verifyJWT(token)

        if(!user) {
            return NextResponse.json({ error: "Invalid token", success: false }, { status: 401 })
        }

        user.profilePicture = profilePicture
        await user.save()

        return NextResponse.json({ message: "Profile picture uploaded successfully", success: true, user }, { status: 200 })
    } catch (error) {
        console.error("Error in Upload-ProfilePic route:", error)
        if(error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON format", success: false }, { status: 400 })
        }
        return NextResponse.json({ error: "Internal Server Error", success: false }, { status: 500 })
    }
}