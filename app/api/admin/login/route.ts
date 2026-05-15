import { NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  const trimmedPassword = password?.trim()

  if (!adminPassword) {
    return NextResponse.json({ error: "Server error: password not configured" }, { status: 500 })
  }

  if (trimmedPassword !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = await createSession()
  
  // Return token in response body for localStorage storage
  return NextResponse.json({ success: true, token })
}
