import { cache } from "react"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/VerifyJWT"

export const getUser = cache(async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) return null

    const user = await verifyJWT(token)  
      
    return user ? JSON.parse(JSON.stringify(user)) : null
})