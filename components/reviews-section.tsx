"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { StarRating } from "@/components/star-rating"
import type { Review } from "@/lib/reviews"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return ""
  }
}

export function ReviewsSection({ dessertId }: { dessertId: string }) {
  const apiUrl = `/api/reviews?dessertId=${encodeURIComponent(dessertId)}`
  const { data, isLoading } = useSWR<{ reviews: Review[] }>(apiUrl, fetcher)
  const reviews = data?.reviews ?? []

  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!name.trim() || !comment.trim() || rating < 1) {
      setError("Please add your name, a rating, and a comment.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dessertId, name, rating, comment }),
      })

      if (!res.ok) {
        throw new Error("Request failed")
      }

      setName("")
      setRating(0)
      setComment("")
      setSuccess(true)
      mutate(apiUrl)
    } catch (err) {
      console.error("[v0] Review submit error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">Reviews</h2>
          <p className="text-muted-foreground mt-1">
            See what customers are saying, or leave your own.
          </p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <StarRating value={averageRating} readOnly size={18} />
              <span className="text-sm text-muted-foreground mt-1">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Review List */}
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Spinner className="size-4" />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-foreground">{review.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <StarRating value={review.rating} readOnly size={16} className="mb-3" />
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Form */}
        <div className="order-1 lg:order-2">
          <Card className="bg-secondary/40 border-primary/20 lg:sticky lg:top-8">
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                Leave a Review
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input
                    id="review-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane D."
                    maxLength={80}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Your Rating</Label>
                  <StarRating value={rating} onChange={setRating} size={28} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved about this dessert..."
                    rows={4}
                    maxLength={1000}
                    required
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
                {success && (
                  <p className="text-sm text-green-600 font-medium">
                    Thank you! Your review has been posted.
                  </p>
                )}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Spinner className="size-4" />
                      Posting...
                    </>
                  ) : (
                    "Post Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
