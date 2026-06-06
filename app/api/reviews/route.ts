import { type NextRequest, NextResponse } from "next/server"
import { addReview, getReviewsForDessert } from "@/lib/reviews"

export async function GET(req: NextRequest) {
  const dessertId = req.nextUrl.searchParams.get("dessertId")
  if (!dessertId) {
    return NextResponse.json({ error: "Missing dessertId" }, { status: 400 })
  }

  try {
    const reviews = await getReviewsForDessert(dessertId)
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("[v0] Failed to load reviews:", error)
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dessertId, name, rating, comment } = body

    if (!dessertId || !name || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const numericRating = Number(rating)
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (String(name).trim().length === 0 || String(comment).trim().length === 0) {
      return NextResponse.json({ error: "Name and comment are required" }, { status: 400 })
    }

    const review = await addReview({
      dessertId: String(dessertId),
      name: String(name).slice(0, 80),
      rating: numericRating,
      comment: String(comment).slice(0, 1000),
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("[v0] Failed to submit review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
