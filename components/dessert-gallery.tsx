"use client"

import { useState } from "react"
import { DessertCard } from "./dessert-card"

const desserts = [
  {
    id: 1,
    name: "Chocolate Lava Cake",
    description: "Rich, decadent chocolate cake with a molten center that flows when you cut into it.",
    image: "/images/chocolate-lava-cake.jpg",
    category: "Cakes",
  },
  {
    id: 2,
    name: "Fresh Berry Tart",
    description: "Buttery pastry crust filled with vanilla custard and topped with seasonal berries.",
    image: "/images/berry-tart.jpg",
    category: "Tarts",
  },
  {
    id: 3,
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
    image: "/images/tiramisu.jpg",
    category: "Italian",
  },
  {
    id: 4,
    name: "Macarons",
    description: "Delicate French almond meringue cookies in assorted flavors and colors.",
    image: "/images/macarons.jpg",
    category: "Pastries",
  },
  {
    id: 5,
    name: "Crème Brûlée",
    description: "Silky vanilla custard with a perfectly caramelized sugar crust.",
    image: "/images/creme-brulee.jpg",
    category: "French",
  },
  {
    id: 6,
    name: "Cheesecake",
    description: "Creamy New York-style cheesecake with a graham cracker crust.",
    image: "/images/cheesecake.jpg",
    category: "Cakes",
  },
]

const categories = ["All", ...Array.from(new Set(desserts.map((d) => d.category)))]

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
            to bring you moments of pure sweetness.
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
            <DessertCard
              key={dessert.id}
              name={dessert.name}
              description={dessert.description}
              image={dessert.image}
              category={dessert.category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
