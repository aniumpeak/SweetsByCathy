"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface OrderFormProps {
  dessertName: string
  dessertPrice: string
  priceNote?: string
}

export function OrderForm({ dessertName, dessertPrice, priceNote }: OrderFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string
      const phone = formData.get("phone") as string
      const quantity = formData.get("quantity") as string
      const pickupDate = formData.get("pickupDate") as string
      const specialRequests = formData.get("specialRequests") as string

      // Prepare data object for Formspree
      const orderData = {
        Dessert: dessertName,
        Price: dessertPrice,
        "Customer Name": name,
        Phone: phone,
        Quantity: quantity,
        "Pickup Date": pickupDate,
        ...(specialRequests && { "Special Requests": specialRequests }),
      }

      const response = await fetch("https://formspree.io/f/mvzypbgv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const data = await response.json()
        console.error("[v0] Formspree error:", data)
        setError("Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("[v0] Form submission error:", err)
      setError("Failed to submit order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(() => {
        setIsSubmitted(false)
        setError("")
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Contact Cathy to Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="text-center py-8 px-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mx-auto mb-4">
              <AlertCircle className="h-9 w-9 text-amber-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl mb-2">Order Request Received</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm mt-2 mb-6">
              Your order details have been submitted. <strong>Payment is required to complete your order.</strong>
            </p>
            <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 text-left mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">⚠️ Next Step: Send Payment</p>
              <p className="text-sm text-muted-foreground mb-3">
                To secure your order and confirm your pickup date, send payment via Venmo:
              </p>
              <p className="text-xl font-bold text-primary text-center py-2">@yellowlady29</p>
              <p className="text-xs text-muted-foreground mt-3 bg-background/50 p-2 rounded">
                <strong>Include in payment note:</strong> Your name, dessert name, quantity, and desired pickup date
              </p>
            </div>
            <Button className="w-full" variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">Place an Order</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 mt-1">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{dessertName}</p>
                <p className="text-xs text-muted-foreground">{dessertPrice} &mdash; {priceNote}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {error && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name <span className="text-primary">*</span></Label>
                <Input id="name" name="name" placeholder="Your full name" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number <span className="text-primary">*</span></Label>
                <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Quantity <span className="text-primary">*</span></Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder={priceNote?.includes("dozen") ? "e.g. 2 dozen" : "e.g. 3"}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pickupDate">Desired Pickup Date <span className="text-primary">*</span></Label>
                  <Input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  placeholder="Custom toppers, event theme, dietary notes..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Place Order Request"}
              </Button>
              <p className="text-center text-xs text-muted-foreground pb-1">
                Cathy will contact you to confirm before any payment is needed.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
