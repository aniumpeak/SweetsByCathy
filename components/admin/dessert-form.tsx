"use client"

import { useState } from "react"
import { X, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Dessert } from "@/lib/desserts"

const CATEGORIES = ["Cakes", "Cupcakes", "Cookies", "Gelatinas", "Gluten Free"]

interface DessertFormProps {
  initial?: Partial<Dessert>
  onSave: (data: Partial<Dessert>) => Promise<void>
  onCancel: () => void
}

export default function DessertForm({ initial, onSave, onCancel }: DessertFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    longDescription: initial?.longDescription ?? "",
    image: initial?.image ?? "",
    images: initial?.images ?? ([] as string[]),
    category: initial?.category ?? "Cakes",
    price: initial?.price ?? "",
    priceNote: initial?.priceNote ?? "",
    allergens: initial?.allergens ?? ([] as string[]),
    ingredients: initial?.ingredients ?? ([] as string[]),
    servingSize: initial?.servingSize ?? "",
  })

  const [newAllergen, setNewAllergen] = useState("")
  const [newIngredient, setNewIngredient] = useState("")
  const [newImage, setNewImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingAdditional, setUploadingAdditional] = useState(false)

  function set(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function addTag(field: "allergens" | "ingredients", value: string, reset: () => void) {
    const trimmed = value.trim()
    if (!trimmed) return
    set(field, [...form[field], trimmed])
    reset()
  }

  function removeTag(field: "allergens" | "ingredients", index: number) {
    set(field, form[field].filter((_: string, i: number) => i !== index))
  }

  function addImage() {
    const trimmed = newImage.trim()
    if (!trimmed) return
    set("images", [...form.images, trimmed])
    setNewImage("")
  }

  function removeImage(index: number) {
    set("images", form.images.filter((_: string, i: number) => i !== index))
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setUploadingMain(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const { path } = await res.json()
      set("image", path)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploadingMain(false)
      e.currentTarget.value = ""
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setUploadingAdditional(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const { path } = await res.json()
      set("images", [...form.images, path])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploadingAdditional(false)
      e.currentTarget.value = ""
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Red Velvet Cake" />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Short description */}
      <div className="space-y-1.5">
        <Label>Short Description</Label>
        <Input value={form.description} onChange={(e) => set("description", e.target.value)} required placeholder="One sentence summary shown on the card" />
      </div>

      {/* Long description */}
      <div className="space-y-1.5">
        <Label>Full Description</Label>
        <Textarea value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} rows={3} placeholder="Detailed description shown on the dessert page" />
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Price</Label>
          <Input value={form.price} onChange={(e) => set("price", e.target.value)} required placeholder="e.g. $36.00" />
        </div>
        <div className="space-y-1.5">
          <Label>Price Note</Label>
          <Input value={form.priceNote} onChange={(e) => set("priceNote", e.target.value)} placeholder="e.g. per dozen" />
        </div>
      </div>

      {/* Serving size */}
      <div className="space-y-1.5">
        <Label>Serving Size</Label>
        <Input value={form.servingSize} onChange={(e) => set("servingSize", e.target.value)} placeholder="e.g. 12 cupcakes" />
      </div>

      {/* Main image */}
      <div className="space-y-1.5">
        <Label>Main Image</Label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            disabled={uploadingMain}
            className="hidden"
            id="main-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("main-image-upload")?.click()}
            disabled={uploadingMain}
          >
            <Upload className="w-4 h-4 mr-1" />
            {uploadingMain ? "Uploading..." : "Upload Main Image"}
          </Button>
          {form.image && (
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground text-sm rounded-md px-3 py-2">
              <img src={form.image} alt="Main" className="w-12 h-12 object-cover rounded" />
              <span className="flex-1 truncate">{form.image}</span>
              <button type="button" onClick={() => set("image", "")} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional images */}
      <div className="space-y-1.5">
        <Label>Additional Images</Label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingAdditional}
            className="hidden"
            id="additional-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("additional-image-upload")?.click()}
            disabled={uploadingAdditional}
          >
            <Upload className="w-4 h-4 mr-1" />
            {uploadingAdditional ? "Uploading..." : "Upload Additional Image"}
          </Button>
          {/* Or manual path entry */}
          <div className="flex gap-2">
            <Input value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="/images/another-angle.jpg" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage() }}} />
            <Button type="button" variant="outline" size="icon" onClick={addImage}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
        {form.images.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {form.images.map((img: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-secondary text-secondary-foreground text-sm rounded-md px-3 py-2">
                <img src={img} alt={`Image ${i + 1}`} className="w-10 h-10 object-cover rounded" />
                <span className="flex-1 truncate">{img}</span>
                <button type="button" onClick={() => removeImage(i)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Allergens */}
      <div className="space-y-1.5">
        <Label>Allergens</Label>
        <div className="flex gap-2">
          <Input value={newAllergen} onChange={(e) => setNewAllergen(e.target.value)} placeholder="e.g. Dairy" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("allergens", newAllergen, () => setNewAllergen("")) }}} />
          <Button type="button" variant="outline" size="icon" onClick={() => addTag("allergens", newAllergen, () => setNewAllergen(""))}><Plus className="w-4 h-4" /></Button>
        </div>
        {form.allergens.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.allergens.map((a: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs rounded-full px-3 py-1">
                {a}
                <button type="button" onClick={() => removeTag("allergens", i)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="space-y-1.5">
        <Label>Ingredients</Label>
        <div className="flex gap-2">
          <Input value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder="e.g. Butter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("ingredients", newIngredient, () => setNewIngredient("")) }}} />
          <Button type="button" variant="outline" size="icon" onClick={() => addTag("ingredients", newIngredient, () => setNewIngredient(""))}><Plus className="w-4 h-4" /></Button>
        </div>
        {form.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.ingredients.map((ing: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs rounded-full px-3 py-1">
                {ing}
                <button type="button" onClick={() => removeTag("ingredients", i)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={saving}>
          {saving ? "Saving..." : "Save Dessert"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
