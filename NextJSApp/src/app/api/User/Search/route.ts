import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/utils/ConnectDB"
import { User as UserModel } from "@techmarket/models"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")?.trim() || ""

  if (!query) {
    return NextResponse.json({ users: [] })
  }

  const accessToken = request.cookies.get("accessToken")?.value

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized", users: [] }, { status: 401 })
  }

  try {
    const payload = jwt.verify(accessToken, process.env.NEXT_JWT_SECRET as string) as { userId?: string }
    await connectDB()

    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    const users = await UserModel.find(
      {
        $and: [
          {
            $or: [
              { name: searchRegex },
              { email: searchRegex }
            ],
          },
          { _id: { $ne: payload.userId } }
        ]
      },
      { password: 0, refreshToken: 0 }
    )
      .limit(10)
      .lean()

    const safeUsers = users.map((user) => ({
      _id: String(user._id),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture || "",
      role: user.role,
    }))

    return NextResponse.json({ users: safeUsers })
  } catch (error) {
    console.error("User search error:", error)
    return NextResponse.json({ error: "Unable to search users", users: [] }, { status: 500 })
  }
}
