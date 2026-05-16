import { readFileSync } from "fs"
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

export function getDessertById(id: string): Dessert | undefined {
  return getDesserts().find((d) => d.id === id)
}

export function getDessertsByCategory(category: string): Dessert[] {
  const all = getDesserts()
  if (category === "All") return all
  return all.filter((d) => d.category === category)
}
