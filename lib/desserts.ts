import { readFileSync, writeFileSync } from "fs"
import path from "path"

export interface Dessert {
  id: string
  name: string
  description: string
  longDescription: string
  image: string
  images?: string[]
  category: string
  price: string
  priceNote?: string
  allergens: string[]
  ingredients: string[]
  servingSize?: string
}

const DATA_PATH = path.join(process.cwd(), "data", "desserts.json")

export function getDesserts(): Dessert[] {
  const raw = readFileSync(DATA_PATH, "utf-8")
  return JSON.parse(raw) as Dessert[]
}

export function saveDesserts(desserts: Dessert[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(desserts, null, 2), "utf-8")
}

export function getDessertById(id: string): Dessert | undefined {
  return getDesserts().find((d) => d.id === id)
}

export function getDessertsByCategory(category: string): Dessert[] {
  const all = getDesserts()
  if (category === "All") return all
  return all.filter((d) => d.category === category)
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}
