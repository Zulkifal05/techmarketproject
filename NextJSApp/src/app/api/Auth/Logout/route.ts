import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT } from "@/utils/VerifyJWT"

export async function POST() {
  // Read cookies from request
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
  
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const decoded = await verifyJWT(token);
    if(!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const res = NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
    res.cookies.delete("token");
  
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "An error occurred while logging out" }, { status: 500 });
  }
}