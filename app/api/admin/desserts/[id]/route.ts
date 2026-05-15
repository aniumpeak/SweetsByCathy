import { NextRequest, NextResponse } from "next/server"
import { isAuthenticatedFromHeader } from "@/lib/auth"
import { getDesserts, saveDesserts } from "@/lib/desserts"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticatedFromHeader(req.headers.get("Authorization")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const desserts = getDesserts()
  const index = desserts.findIndex((d) => d.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  desserts[index] = { ...desserts[index], ...body, id }
  saveDesserts(desserts)
  return NextResponse.json(desserts[index])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticatedFromHeader(req.headers.get("Authorization")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const desserts = getDesserts()
  const filtered = desserts.filter((d) => d.id !== id)

  if (filtered.length === desserts.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  saveDesserts(filtered)
  return NextResponse.json({ success: true })
}
