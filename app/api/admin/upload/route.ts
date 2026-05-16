import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { isAuthenticatedFromHeader } from "@/lib/auth"

export async function POST(request: NextRequest) {
  // Verify admin session via Authorization header
  if (!(await isAuthenticatedFromHeader(request.headers.get("Authorization")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `desserts/${timestamp}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Vercel Blob (public access for images)
    const blob = await put(filename, file, {
      access: "public",
    })

    // Return the public URL
    return NextResponse.json({ path: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
