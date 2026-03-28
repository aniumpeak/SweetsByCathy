"use client"

import Image from "next/image"
import { useState } from "react"

interface DessertCardProps {
  name: string
  description: string
  image: string
  category: string
}

export function DessertCard({ name, description, image, category }: DessertCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full mb-2">
          {category}
        </span>
        <h3 className="font-serif text-xl md:text-2xl font-bold text-card mb-1 drop-shadow-lg">
          {name}
        </h3>
        <p className="text-card/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  )
}
