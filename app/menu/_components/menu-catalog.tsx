"use client"

import * as React from "react"
import {
  CheckCircle2,
  Edit,
  Fish,
  Percent,
  Plus,
  Search,
  Utensils,
  Wifi,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  MENU_CATEGORIES,
  type MenuItemWithRecipe,
} from "../_lib/menu-data"

export interface MenuCatalogProps {
  items: MenuItemWithRecipe[]
  onEditItem: (item: MenuItemWithRecipe) => void
  onNewItem: () => void
  onToggleAvailable: (id: string) => void
  currency?: string
}

export function MenuCatalog({
  items,
  onEditItem,
  onNewItem,
  onToggleAvailable,
  currency = "RWF",
}: MenuCatalogProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [syncNotice, setSyncNotice] = React.useState(false)

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // KPIs
  const totalItems = items.length
  const activeCount = items.filter((i) => i.available).length
  const avgFoodCost =
    items.length > 0
      ? (
          items.reduce((sum, item) => {
            const cost = item.ingredients.reduce((acc, ing) => acc + ing.lineCost, 0)
            const percent = item.price > 0 ? (cost / item.price) * 100 : 0
            return sum + percent
          }, 0) / items.length
        ).toFixed(1)
      : "0"

  const handleSyncPOS = () => {
    setSyncNotice(true)
    setTimeout(() => setSyncNotice(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Menu Items &amp; Recipe Engineering
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure dishes, ingredients, portion cost margins, and live POS terminal availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncPOS}
            className="h-9 rounded-xl border-border text-xs font-bold gap-1.5 cursor-pointer hover:bg-muted"
          >
            <Wifi className="size-3.5 text-emerald-600" />
            <span>Sync to POS Terminals</span>
          </Button>

          <Button
            onClick={onNewItem}
            className="h-9 rounded-xl bg-[#C1440E] hover:bg-[#A8380A] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Create Menu Item</span>
          </Button>
        </div>
      </div>

      {syncNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>All menu recipes, portion weights, and prices synchronized with connected POS tablets!</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl p-4 border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Utensils className="size-4 text-[#C1440E]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Menu Items</span>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-1.5">{totalItems}</p>
          <span className="text-[10px] text-muted-foreground">Catalog active</span>
        </Card>

        <Card className="rounded-2xl p-4 border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Active on POS</span>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-1.5">{activeCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Available for orders</span>
        </Card>

        <Card className="rounded-2xl p-4 border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="size-4 text-[#E8A33D]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Food Cost</span>
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-1.5">{avgFoodCost}%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Target &lt; 34.0%</span>
        </Card>

        <Card className="rounded-2xl p-4 border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="size-4 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">POS Sync Status</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1.5">100% Online</p>
          <span className="text-[10px] text-muted-foreground">Live stock deduction</span>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", ...MENU_CATEGORIES].map((category) => {
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-[#C1440E] text-white shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
                )}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or recipe..."
            className="h-9 w-full rounded-xl border border-border bg-background pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Items List Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const costPerServing = Math.round(
            item.ingredients.reduce((acc, ing) => acc + ing.lineCost, 0)
          )
          const foodCostPercent =
            item.price > 0
              ? Number(((costPerServing / item.price) * 100).toFixed(1))
              : 0

          return (
            <Card
              key={item.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 transition-all flex flex-col justify-between hover:shadow-md",
                item.available
                  ? "border-border bg-card"
                  : "border-border/60 bg-muted/20 opacity-80"
              )}
            >
              <div>
                {/* Header row: Category & Availability Switch */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold py-0">
                    {item.category}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {item.available ? "Active" : "Disabled"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.available}
                      onClick={() => onToggleAvailable(item.id)}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
                        item.available ? "bg-[#234D3A] dark:bg-emerald-600" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-md transition-transform mt-0.5 ml-0.5",
                          item.available ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Dish info & photo */}
                <div className="mt-3.5 flex items-start gap-3.5">
                  <div className="size-14 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Fish className="size-7 text-[#E8A33D]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-foreground truncate">{item.name}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Price and COGS */}
                <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                      Selling Price
                    </span>
                    <span className="font-extrabold text-sm text-foreground">
                      {currency} {item.price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                      Cost / Margin
                    </span>
                    <span className="font-bold text-xs text-foreground">
                      {currency} {costPerServing.toLocaleString()} ({foodCostPercent}%)
                    </span>
                  </div>
                </div>

                {/* Ingredients tag count */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{item.ingredients.length} recipe ingredients</span>
                  <div className="flex items-center gap-1.5">
                    {item.channels.dineIn && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Dine-in</span>}
                    {item.channels.takeaway && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Takeaway</span>}
                    {item.channels.delivery && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Delivery</span>}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <Button
                  onClick={() => onEditItem(item)}
                  variant="outline"
                  className="w-full h-8.5 rounded-xl text-xs font-bold gap-1.5 border-[#C1440E]/40 text-[#C1440E] hover:bg-[#C1440E]/10 cursor-pointer"
                >
                  <Edit className="size-3.5" />
                  <span>Edit Recipe &amp; Details</span>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border text-muted-foreground">
          <Utensils className="size-8 mx-auto mb-2 text-muted-foreground/60" />
          <p className="text-sm font-semibold text-foreground">No menu items match your search.</p>
          <p className="text-xs mt-1">Try another keyword or category filter.</p>
        </div>
      )}
    </div>
  )
}
