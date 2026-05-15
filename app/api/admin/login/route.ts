import { NextRequest, NextResponse } from "next/server"
import { createSession, SESSION_COOKIE } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  const trimmedPassword = password?.trim()

  console.log("[v0] Password attempt received")
  console.log("[v0] ENV password exists:", !!adminPassword)
  console.log("[v0] Passwords match:", trimmedPassword === adminPassword)

  if (!adminPassword) {
    console.error("[v0] ADMIN_PASSWORD not set in environment!")
    return NextResponse.json({ error: "Server error: password not configured" }, { status: 500 })
  }

  if (trimmedPassword !== adminPassword) {
    console.log("[v0] Password mismatch - login denied")
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  console.log("[v0] Password correct - creating session")
  const token = await createSession()
  console.log("[v0] Session token created:", !!token)

  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  })
  console.log("[v0] Cookie set on response")
  return res
}
