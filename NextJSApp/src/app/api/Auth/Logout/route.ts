import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verifyJWT } from "@/utils/VerifyJWT"

export async function POST() {
  // Read headers from request
  try {
    const headerList = await headers();
    const token = headerList.get("Authorization")?.replace("bearer ","");
  
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const user = await verifyJWT(token);

    if(!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    user.refreshToken = ""
    await user.save()

    const res = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
    res.cookies.delete("refreshToken");
  
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "An error occurred while logging out" }, { status: 500 });
  }
}