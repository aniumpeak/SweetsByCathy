"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Cookie, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Dessert } from "@/lib/desserts"

export default function AdminPage() {
  const router = useRouter()
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("admin_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const fetchDesserts = useCallback(async () => {
    const res = await fetch("/api/admin/desserts", {
      headers: getAuthHeaders(),
    })
    if (res.status === 401) {
      localStorage.removeItem("admin_token")
      router.push("/admin/login")
      return
    }
    const data = await res.json()
    setDesserts(data)
    setLoading(false)
  }, [router, getAuthHeaders])

  useEffect(() => {
    fetchDesserts()
  }, [fetchDesserts])

  function handleLogout() {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cookie className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-serif text-lg font-bold text-foreground leading-tight">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Cathy&apos;s Sweet Creations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            View Site
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Info banner */}
        <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            This is a view-only dashboard. To add, edit, or remove desserts, contact your developer through v0.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-foreground">Your Desserts</h2>
          <p className="text-sm text-muted-foreground">{desserts.length} item{desserts.length !== 1 ? "s" : ""}</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-3">
            {desserts.map((d) => (
              <Card key={d.id} className="border border-border">
                <CardContent className="flex items-center gap-4 py-4 px-5">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                    {d.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{d.name}</p>
                    <p className="text-sm text-muted-foreground">{d.category}</p>
                  </div>
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-foreground">{d.price}</p>
                    {d.priceNote && <p className="text-xs text-muted-foreground">{d.priceNote}</p>}
                  </div>
                  {/* View link */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`/desserts/${d.id}`, "_blank")}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
