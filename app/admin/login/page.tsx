"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include", // Important: include cookies in the request
      })

      console.log("[v0] Login response status:", res.status)

      if (res.ok) {
        console.log("[v0] Login successful, redirecting to /admin")
        // Use window.location for full page reload to ensure cookies are included
        window.location.href = "/admin"
      } else {
        const data = await res.json()
        console.log("[v0] Login failed:", data)
        setError(data.error || "Incorrect password. Please try again.")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cathy&apos;s Sweet Creations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 text-center text-base"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading || !password}
          >
            {loading ? "Checking..." : "Enter"}
          </Button>
        </form>
      </div>
    </main>
  )
}
