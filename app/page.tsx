import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { DessertGallery } from "@/components/dessert-gallery"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { getDesserts } from "@/lib/desserts"

export default function Home() {
  const desserts = getDesserts()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <DessertGallery desserts={desserts} />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
