import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "")

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow /admin/login without session
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for session token on other /admin routes
    const token = request.cookies.get("admin_session")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (err) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
