import { ArrowDown } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Handcrafted with Love
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight text-balance">
            Sweetness in every bite
          </h1>
          <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Discover our collection of homemade desserts, crafted with the finest ingredients 
            and a passion for creating unforgettable sweet moments.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#desserts"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Explore Desserts
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center px-8 py-4 border border-border rounded-full font-medium hover:bg-secondary transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Link href="#desserts" aria-label="Scroll to desserts">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </Link>
      </div>
    </section>
  )
}
