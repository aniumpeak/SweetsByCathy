import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getDesserts, saveDesserts, slugify, type Dessert } from "@/lib/desserts"

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json(getDesserts())
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const desserts = getDesserts()

  const newDessert: Dessert = {
    id: slugify(body.name),
    name: body.name,
    description: body.description,
    longDescription: body.longDescription,
    image: body.image || "",
    images: body.images || [],
    category: body.category,
    price: body.price,
    priceNote: body.priceNote || "",
    allergens: body.allergens || [],
    ingredients: body.ingredients || [],
    servingSize: body.servingSize || "",
  }

  desserts.push(newDessert)
  saveDesserts(desserts)
  return NextResponse.json(newDessert, { status: 201 })
}
