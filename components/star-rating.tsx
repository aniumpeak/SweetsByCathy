"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
  readOnly?: boolean
}

export function StarRating({
  value,
  onChange,
  size = 20,
  className,
  readOnly = false,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} role={readOnly ? "img" : "radiogroup"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value)
        if (readOnly) {
          return (
            <Star
              key={star}
              style={{ width: size, height: size }}
              className={cn(
                "shrink-0",
                filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40",
              )}
            />
          )
        }
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={star === Math.round(value)}
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                "shrink-0 transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40 hover:text-amber-300",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
