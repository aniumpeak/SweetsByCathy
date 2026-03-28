import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { DessertGallery } from "@/components/dessert-gallery"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <DessertGallery />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
