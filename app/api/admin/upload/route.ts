import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
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
    const filename = `${timestamp}-${file.name.replace(/\s+/g, "-")}`
    const filepath = join(process.cwd(), "public", "images", filename)

    // Ensure directory exists
    await mkdir(join(process.cwd(), "public", "images"), { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    // Return the public path
    const publicPath = `/images/${filename}`
    return NextResponse.json({ path: publicPath })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
