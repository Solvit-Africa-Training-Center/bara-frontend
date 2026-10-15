"use client"

import * as React from "react"
import { AlertCircle, ArrowDownRight, ArrowUpRight, CheckCircle2, PackageCheck, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Ingredient, StockMovement } from "@/lib/api-client"

interface InventoryKpiCardsProps {
  ingredients: Ingredient[]
  movements: StockMovement[]
  formatCurrency: (amount: number) => string
}

export function InventoryKpiCards({
  ingredients,
  movements,
  formatCurrency,
}: InventoryKpiCardsProps) {
  // Low stock calculation
  const lowStockCount = ingredients.filter((item) => {
    const qty = parseFloat(String(item.current_quantity ?? 0))
    const threshold = parseFloat(String(item.low_stock_threshold ?? 0))
    return qty <= threshold && qty > 0
  }).length

  const depletedCount = ingredients.filter((item) => {
    const qty = parseFloat(String(item.current_quantity ?? 0))
    return qty <= 0
  }).length

  // Total stock inventory value (quantity * cost_per_unit)
  const totalStockValue = ingredients.reduce((sum, item) => {
    const qty = Math.max(0, parseFloat(String(item.current_quantity ?? 0)))
    const cost = parseFloat(String(item.cost_per_unit ?? 0))
    return sum + qty * cost
  }, 0)

  // Waste in recent movements
  const wasteCount = movements.filter((m) => m.movement_type === "waste").length

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:gap-4">
      {/* 1. Total Ingredients Tracked */}
      <Card className="rounded-2xl border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Ingredients
          </span>
          <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PackageCheck className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#3B2F2A] dark:text-[#FAF5EE] tabular-nums">
            {ingredients.length}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">items</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground truncate">
          Active kitchen &amp; bar supplies
        </p>
      </Card>

      {/* 2. Low Stock Alerts */}
      <Card className="rounded-2xl border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Low Stock Alerts
          </span>
          <div className="flex size-7 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
            {lowStockCount + depletedCount}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            ({depletedCount} empty)
          </span>
        </div>
        <p className="mt-1 text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium truncate">
          {lowStockCount + depletedCount > 0 ? "Requires purchase reorder" : "All levels healthy"}
        </p>
      </Card>

      {/* 3. Estimated Inventory Value */}
      <Card className="rounded-2xl border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Stock Valuation
          </span>
          <div className="flex size-7 items-center justify-center rounded-xl bg-emerald-500/10 text-[#2F5233] dark:text-emerald-400">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-extrabold text-[#3B2F2A] dark:text-[#FAF5EE] tabular-nums">
            {formatCurrency(totalStockValue)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground truncate">
          At standard unit purchase cost
        </p>
      </Card>

      {/* 4. Logged Waste Events */}
      <Card className="rounded-2xl border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Waste Records
          </span>
          <div className="flex size-7 items-center justify-center rounded-xl bg-[#A83232]/10 text-[#A83232]">
            <Trash2 className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#A83232] tabular-nums">
            {wasteCount}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">logged</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground truncate">
          Audited spoilage &amp; drops
        </p>
      </Card>
    </div>
  )
}
