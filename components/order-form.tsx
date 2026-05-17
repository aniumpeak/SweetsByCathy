"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2, Loader2 } from "lucide-react"

interface OrderFormProps {
  dessertName: string
  dessertPrice: string
  priceNote?: string
}

export function OrderForm({ dessertName, dessertPrice, priceNote }: OrderFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      dessertName,
      quantity: formData.get("quantity") as string,
      pickupDate: formData.get("pickupDate") as string,
      specialRequests: formData.get("specialRequests") as string,
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit order")
      }

      setIsSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again or contact us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form state when closing
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
      <DialogContent className="sm:max-w-md">
        {isSubmitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-2xl mb-2">Order Submitted!</DialogTitle>
              <DialogDescription className="text-base">
                Cathy will review your order and get back to you soon.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 p-4 bg-secondary rounded-lg text-left">
              <p className="font-semibold text-foreground mb-2">Next Step: Payment via Venmo</p>
              <p className="text-sm text-muted-foreground mb-3">
                Once Cathy confirms your order, send payment to:
              </p>
              <p className="text-lg font-bold text-primary">@yellowlady29</p>
              <p className="text-xs text-muted-foreground mt-2">
                Include your name and order details in the payment note
              </p>
            </div>
            <Button 
              className="mt-6 w-full" 
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Order {dessertName}</DialogTitle>
              <DialogDescription>
                Fill out the form below and Cathy will get back to you to confirm your order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Full name" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="you@email.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    name="quantity" 
                    placeholder={priceNote?.includes("dozen") ? "e.g., 1 dozen" : "e.g., 1"}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date *</Label>
                  <Input 
                    id="pickupDate" 
                    name="pickupDate" 
                    type="date" 
                    required 
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea 
                  id="specialRequests" 
                  name="specialRequests" 
                  placeholder="Custom toppers, dietary notes, event theme, etc."
                  rows={3}
                />
              </div>

              <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                <p className="font-medium">{dessertName}</p>
                <p className="text-muted-foreground">{dessertPrice} {priceNote}</p>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Order Request"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
