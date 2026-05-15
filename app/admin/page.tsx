"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, LogOut, ChevronRight, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import DessertForm from "@/components/admin/dessert-form"
import type { Dessert } from "@/lib/desserts"

type View = "list" | "add" | "edit"

export default function AdminPage() {
  const router = useRouter()
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [view, setView] = useState<View>("list")
  const [editing, setEditing] = useState<Dessert | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Dessert | null>(null)
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

  async function handleLogout() {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  async function handleAdd(data: Partial<Dessert>) {
    await fetch("/api/admin/desserts", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    await fetchDesserts()
    setView("list")
  }

  async function handleEdit(data: Partial<Dessert>) {
    if (!editing) return
    await fetch(`/api/admin/desserts/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    await fetchDesserts()
    setView("list")
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await fetch(`/api/admin/desserts/${deleteTarget.id}`, { 
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await fetchDesserts()
    setDeleteTarget(null)
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <span
            className={view === "list" ? "text-foreground font-medium" : "cursor-pointer hover:text-foreground"}
            onClick={() => { setView("list"); setEditing(null) }}
          >
            Desserts
          </span>
          {view !== "list" && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">
                {view === "add" ? "Add New" : `Edit — ${editing?.name}`}
              </span>
            </>
          )}
        </div>

        {/* List view */}
        {view === "list" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">{desserts.length} dessert{desserts.length !== 1 ? "s" : ""}</p>
              <Button onClick={() => setView("add")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add Dessert
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-3">
                {desserts.map((d) => (
                  <Card key={d.id} className="border border-border">
                    <CardContent className="flex items-center gap-4 py-4 px-5">
                      {/* Color swatch placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                        {d.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{d.name}</p>
                        <p className="text-sm text-muted-foreground">{d.category} · {d.price}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditing(d); setView("edit") }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(d)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add / Edit form */}
        {(view === "add" || view === "edit") && (
          <Card className="border border-border">
            <CardContent className="py-6 px-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                {view === "add" ? "Add New Dessert" : `Edit — ${editing?.name}`}
              </h2>
              <DessertForm
                initial={editing ?? undefined}
                onSave={view === "add" ? handleAdd : handleEdit}
                onCancel={() => { setView("list"); setEditing(null) }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the dessert from your collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
