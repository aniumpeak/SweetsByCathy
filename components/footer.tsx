import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-card py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-serif text-2xl font-bold">
              Sweets By Cathy
            </Link>
            <p className="mt-2 text-card/70 text-sm">
              Handcrafted desserts made with love
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-card/70 hover:text-card transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-card/70 hover:text-card transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-card/20 text-center text-card/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Sweets By Cathy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
