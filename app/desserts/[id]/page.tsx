import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { getDessertById, getDesserts } from "@/lib/desserts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ImageGallery from "@/components/image-gallery"

export async function generateStaticParams() {
  return getDesserts().map((dessert) => ({ id: dessert.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dessert = getDessertById(id)
  
  if (!dessert) {
    return {
      title: "Dessert Not Found",
    }
  }

  return {
    title: `${dessert.name} | Cathy's Sweet Creations`,
    description: dessert.description,
  }
}

export default async function DessertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dessert = getDessertById(id)

  if (!dessert) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/#desserts" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Desserts
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <ImageGallery
            images={[dessert.image, ...(dessert.images || [])]}
            name={dessert.name}
          />

          {/* Details */}
          <div className="flex flex-col gap-6">
            {/* Title & Category */}
            <div>
              <Badge variant="secondary" className="mb-3">
                {dessert.category}
              </Badge>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {dessert.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {dessert.longDescription}
              </p>
            </div>

            {/* Pricing */}
            <Card className="bg-secondary/50 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{dessert.price}</span>
                  {dessert.priceNote && (
                    <span className="text-muted-foreground">{dessert.priceNote}</span>
                  )}
                </div>
                {dessert.servingSize && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Serves: {dessert.servingSize}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Allergens Warning */}
            {dessert.allergens.length > 0 && (
              <Card className="border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Allergy Information</h3>
                      <div className="flex flex-wrap gap-2">
                        {dessert.allergens.map((allergen) => (
                          <Badge 
                            key={allergen} 
                            variant="outline" 
                            className="border-amber-400 text-amber-700 bg-amber-100"
                          >
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Ingredients</h3>
              <p className="text-muted-foreground leading-relaxed">
                {dessert.ingredients.join(", ")}
              </p>
            </div>

            {/* Payment Section */}
            <Card className="bg-card border-2 border-primary/30">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  Ready to Order?
                </h3>
                <p className="text-muted-foreground mb-4">
                  To place your order, please contact Cathy directly and payment can be made via Venmo.
                </p>
                <div className="bg-secondary rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Pay via Venmo:</p>
                  <p className="text-lg font-semibold text-primary">@yellowlady29</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Include your name and order details in the payment note
                  </p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>How to order:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Contact Cathy to confirm your order and pickup/delivery details</li>
                    <li>Send payment via Venmo to @yellowlady29</li>
                    <li>Include your name, item(s), and quantity in the payment note</li>
                    <li>Wait for confirmation before your pickup date</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Contact Button */}
            <Button asChild size="lg" className="w-full">
              <Link href="/#contact">
                Contact Cathy to Order
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
