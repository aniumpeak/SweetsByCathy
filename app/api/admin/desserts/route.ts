import { NextRequest, NextResponse } from "next/server"
import { isAuthenticatedFromHeader } from "@/lib/auth"
import { getDesserts } from "@/lib/desserts"

export async function GET(req: NextRequest) {
  if (!(await isAuthenticatedFromHeader(req.headers.get("Authorization")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json(getDesserts())
}
