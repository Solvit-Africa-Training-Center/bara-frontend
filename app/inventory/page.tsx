"use client"

import * as React from "react"
import {
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  unit: string
  minPar: number
  unitCost: number
  supplier: string
  status: "ok" | "low" | "critical"
}

const initialItems: InventoryItem[] = [
  {
    id: "1",
    name: "Fresh Cooking Cream 1L",
    sku: "ING-CRM-01",
    category: "Dairy & Kitchen",
    currentStock: 1.5,
    unit: "L",
    minPar: 5.0,
    unitCost: 4200,
    supplier: "Kigali Dairy Co.",
    status: "critical",
  },
  {
    id: "2",
    name: "Prime Ribs Beef",
    sku: "ING-BF-02",
    category: "Meat & Poultry",
    currentStock: 4.2,
    unit: "kg",
    minPar: 10.0,
    unitCost: 11000,
    supplier: "Prime Butchery Kigali",
    status: "low",
  },
  {
    id: "3",
    name: "Beef Tenderloin AAA",
    sku: "ING-BF-01",
    category: "Meat & Poultry",
    currentStock: 8.5,
    unit: "kg",
    minPar: 12.0,
    unitCost: 14500,
    supplier: "Prime Butchery Kigali",
    status: "low",
  },
  {
    id: "4",
    name: "Fresh Atlantic Salmon",
    sku: "ING-FISH-04",
    category: "Specials",
    currentStock: 6.0,
    unit: "kg",
    minPar: 5.0,
    unitCost: 18200,
    supplier: "Lake & Ocean Imports",
    status: "ok",
  },
  {
    id: "5",
    name: "Irish Potatoes (Kinigi)",
    sku: "ING-VEG-09",
    category: "Produce",
    currentStock: 45.0,
    unit: "kg",
    minPar: 30.0,
    unitCost: 800,
    supplier: "Northern Farm Collective",
    status: "ok",
  },
  {
    id: "6",
    name: "Hass Avocados",
    sku: "ING-VEG-12",
    category: "Produce",
    currentStock: 22.0,
    unit: "kg",
    minPar: 15.0,
    unitCost: 1800,
    supplier: "Kigali Fresh Market",
    status: "ok",
  },
  {
    id: "7",
    name: "Pure Vegetable Cooking Oil",
    sku: "ING-OIL-01",
    category: "Pantry & Dry",
    currentStock: 18.0,
    unit: "L",
    minPar: 20.0,
    unitCost: 3200,
    supplier: "Gisozi Agro Wholesalers",
    status: "low",
  },
  {
    id: "8",
    name: "London Dry Gin (Tanqueray)",
    sku: "BAR-GIN-01",
    category: "Bar & Spirits",
    currentStock: 14.0,
    unit: "btl",
    minPar: 8.0,
    unitCost: 28000,
    supplier: "Bralirwa Premium Dist.",
    status: "ok",
  },
]

export default function InventoryPage() {
  const [items, setItems] = React.useState<InventoryItem[]>(initialItems)
  const [filterCategory, setFilterCategory] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [orderedNotice, setOrderedNotice] = React.useState("")

  const filteredItems = items.filter((item) => {
    const matchesCat = filterCategory === "all" || item.category === filterCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const criticalCount = items.filter((i) => i.status === "critical").length
  const lowCount = items.filter((i) => i.status === "low").length
  const totalValue = items.reduce((acc, curr) => acc + curr.currentStock * curr.unitCost, 0)

  const handleQuickRestock = (itemName: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.name === itemName ? { ...i, currentStock: i.minPar, status: "ok" as const } : i
      )
    )
    setOrderedNotice(`PO generated for ${itemName}! Restocked to par level.`)
    setTimeout(() => setOrderedNotice(""), 3500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Inventory &amp; Stock Levels
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Monitor real-time ingredient par levels, wastage, and trigger supplier purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => {
              setOrderedNotice("Syncing live stock consumption from station POS terminals...")
              setTimeout(() => {
                setOrderedNotice("POS synchronization complete! Par levels up to date.")
                setTimeout(() => setOrderedNotice(""), 3500)
              }, 700)
            }}
          >
            <RefreshCw className="size-3.5" />
            <span>Sync POS Stock</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              const newName = prompt("Enter ingredient name:", "Fresh Button Mushrooms")
              if (newName) {
                const newItem: InventoryItem = {
                  id: String(Date.now()),
                  name: newName,
                  sku: `ING-${Math.floor(100 + Math.random() * 900)}`,
                  category: "Produce",
                  currentStock: 10,
                  unit: "kg",
                  minPar: 8,
                  unitCost: 3500,
                  supplier: "Kigali Fresh Market",
                  status: "ok",
                }
                setItems([newItem, ...items])
                setOrderedNotice(`Added ${newName} to inventory tracking!`)
                setTimeout(() => setOrderedNotice(""), 3500)
              }
            }}
            className="h-8 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-medium"
          >
            <Plus className="size-3.5" />
            <span>+ Add Ingredient</span>
          </Button>
        </div>
      </div>

      {orderedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{orderedNotice}</span>
        </div>
      )}

      {/* 4 Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Tracked Ingredients</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              {items.length}
            </span>
            <span className="text-xs text-muted-foreground">items</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Active in 34 menu recipes</div>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-50/30 p-5 shadow-xs dark:bg-rose-950/20">
          <div className="flex items-center justify-between text-xs font-medium text-rose-600 dark:text-rose-400">
            <span>Critical / Low Stock</span>
            <span className="flex size-2 rounded-full bg-rose-600 animate-ping" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-rose-700 dark:text-rose-400">
              {criticalCount + lowCount}
            </span>
            <span className="text-xs text-rose-600 font-semibold">items require reorder</span>
          </div>
          <div className="mt-2 text-xs text-rose-600/80">
            {criticalCount} critical • {lowCount} below min par
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Estimated Stock Value</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              {Math.round(totalValue / 1000).toLocaleString()},000
            </span>
            <span className="text-xs font-semibold text-muted-foreground">RWF</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Based on latest invoice prices</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Supplier Orders</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              1 In Transit
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold">ETA: Today 16:30</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ingredient, SKU, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["all", "Meat & Poultry", "Dairy & Kitchen", "Produce", "Bar & Spirits", "Specials"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all",
                    filterCategory === cat
                      ? "bg-primary text-white shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="pb-2.5 pl-1">Ingredient / SKU</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Stock Level vs Par</th>
                <th className="pb-2.5">Unit Cost</th>
                <th className="pb-2.5">Primary Supplier</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredItems.map((item) => {
                const percent = Math.min(100, Math.round((item.currentStock / item.minPar) * 100))

                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pl-1">
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{item.sku}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 min-w-[160px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-foreground">
                          {item.currentStock} {item.unit}
                        </span>
                        <span className="text-muted-foreground">
                          Min: {item.minPar} {item.unit}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            item.status === "critical"
                              ? "bg-rose-600"
                              : item.status === "low"
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-foreground">
                      {item.unitCost.toLocaleString()} RWF / {item.unit}
                    </td>
                    <td className="py-3 text-muted-foreground text-[11px]">
                      {item.supplier}
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase",
                          item.status === "critical"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : item.status === "low"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {item.status === "critical"
                          ? "Critical"
                          : item.status === "low"
                          ? "Low Par"
                          : "Optimal"}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-1">
                      <Button
                        size="sm"
                        variant={item.status === "critical" ? "default" : "outline"}
                        onClick={() => handleQuickRestock(item.name)}
                        className={cn(
                          "h-7 rounded-lg text-xs font-semibold px-2.5",
                          item.status === "critical"
                            ? "bg-rose-600 hover:bg-rose-700 text-white"
                            : ""
                        )}
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
