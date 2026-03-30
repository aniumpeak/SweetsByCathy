"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  if (images.length === 1) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
        <Image src={images[0]} alt={name} fill className="object-cover" priority />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
        <Image
          src={images[activeIndex]}
          alt={`${name} - photo ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />

        {/* Arrow controls */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === activeIndex ? "bg-primary w-4" : "bg-card/70 hover:bg-card"
              )}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`View photo ${i + 1}`}
            className={cn(
              "relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
              i === activeIndex
                ? "border-primary shadow-md scale-105"
                : "border-transparent opacity-60 hover:opacity-100 hover:border-primary/50"
            )}
          >
            <Image src={src} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
