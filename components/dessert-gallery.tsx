"use client"

import { useState } from "react"
import { DessertCard } from "./dessert-card"
import { desserts } from "@/lib/desserts"

const categories = ["All", "Cakes", "Cupcakes", "Cookies", "Gelatinas", "Gluten Free"]

export function DessertGallery() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredDesserts =
    activeCategory === "All"
      ? desserts
      : desserts.filter((d) => d.category === activeCategory)

  return (
    <section id="desserts" className="py-20 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Our Creations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Dessert Collection
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Each dessert is handcrafted with care, using only the finest ingredients 
            to bring you moments of pure sweetness. Click any item to see full details.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dessert Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredDesserts.map((dessert) => (
            <DessertCard key={dessert.id} dessert={dessert} />
          ))}
        </div>
      </div>
    </section>
  )
}
