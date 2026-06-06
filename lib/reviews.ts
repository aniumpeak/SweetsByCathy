import { list, put } from "@vercel/blob"

export interface Review {
  id: string
  dessertId: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

const REVIEWS_PATHNAME = "reviews/reviews.json"

async function readAllReviews(): Promise<Review[]> {
  try {
    const { blobs } = await list({ prefix: REVIEWS_PATHNAME })
    const match = blobs.find((b) => b.pathname === REVIEWS_PATHNAME)
    if (!match) return []

    const res = await fetch(match.url, { cache: "no-store" })
    if (!res.ok) return []
    const data = (await res.json()) as Review[]
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("[v0] Failed to read reviews:", error)
    return []
  }
}

async function writeAllReviews(reviews: Review[]): Promise<void> {
  await put(REVIEWS_PATHNAME, JSON.stringify(reviews, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  })
}

export async function getReviewsForDessert(dessertId: string): Promise<Review[]> {
  const all = await readAllReviews()
  return all
    .filter((r) => r.dessertId === dessertId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function addReview(input: {
  dessertId: string
  name: string
  rating: number
  comment: string
}): Promise<Review> {
  const all = await readAllReviews()
  const review: Review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dessertId: input.dessertId,
    name: input.name.trim(),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    comment: input.comment.trim(),
    createdAt: new Date().toISOString(),
  }
  all.push(review)
  await writeAllReviews(all)
  return review
}
