"use client"

import * as React from "react"
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ingredient } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface IngredientsTableProps {
  ingredients: Ingredient[]
  formatCurrency: (amount: number) => string
  onAdjustStock: (ingredient: Ingredient) => void
  onDeleteIngredient: (id: string) => void
}

export function IngredientsTable({
  ingredients,
  formatCurrency,
  onAdjustStock,
  onDeleteIngredient,
}: IngredientsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterMode, setFilterMode] = React.useState<"all" | "low_stock" | "depleted">("all")

  const filtered = ingredients.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase())

    const qty = parseFloat(String(item.current_quantity ?? 0))
    const threshold = parseFloat(String(item.low_stock_threshold ?? 0))

    if (!matchesSearch) return false

    if (filterMode === "low_stock") {
      return qty <= threshold && qty > 0
    }
    if (filterMode === "depleted") {
      return qty <= 0
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ingredients by name or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto p-1 bg-muted/70 rounded-xl border border-border/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all cursor-pointer",
              filterMode === "all"
                ? "bg-card text-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Items ({ingredients.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("low_stock")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              filterMode === "low_stock"
                ? "bg-card text-amber-700 dark:text-amber-400 font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="size-1.5 rounded-full bg-amber-500" />
            <span>Low Stock</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("depleted")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              filterMode === "depleted"
                ? "bg-card text-[#A83232] font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="size-1.5 rounded-full bg-[#A83232]" />
            <span>Depleted / Empty</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/70 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Ingredient</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 text-right">In Stock</th>
                <th className="py-3 px-4 text-right">Reorder Threshold</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-[#3B2F2A] dark:text-[#FAF5EE]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No ingredients found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const qty = parseFloat(String(item.current_quantity ?? 0))
                  const threshold = parseFloat(String(item.low_stock_threshold ?? 0))
                  const cost = parseFloat(String(item.cost_per_unit ?? 0))

                  const isNegative = qty < 0
                  const isDepleted = qty === 0
                  const isLow = qty <= threshold && qty > 0

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#3B2F2A] dark:text-[#FAF5EE]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          ID: {item.id.slice(0, 12)}
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground uppercase">
                          {item.unit}
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4 text-right font-extrabold tabular-nums text-sm">
                        <span
                          className={cn(
                            isNegative && "text-[#A83232] font-black",
                            isDepleted && "text-muted-foreground",
                            isLow && "text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {qty.toFixed(2)}
                        </span>
                        <span className="ml-1 text-[11px] font-semibold text-muted-foreground uppercase">
                          {item.unit}
                        </span>
                      </td>

                      {/* Threshold */}
                      <td className="py-3 px-4 text-right text-muted-foreground font-semibold tabular-nums">
                        {threshold.toFixed(2)} {item.unit}
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3 px-4 text-right font-semibold tabular-nums text-muted-foreground">
                        {formatCurrency(cost)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isNegative ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A83232]/10 border border-[#A83232]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#A83232]">
                            <AlertTriangle className="size-3" />
                            <span>Oversold / Negative</span>
                          </span>
                        ) : isDepleted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-500/10 border border-neutral-500/20 px-2.5 py-0.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
                            <span className="size-1.5 rounded-full bg-neutral-400" />
                            <span>Empty (0 {item.unit})</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                            <AlertCircle className="size-3" />
                            <span>Low Stock Alert</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2F5233]/10 border border-[#2F5233]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#2F5233] dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Healthy</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAdjustStock(item)}
                            className="h-7.5 px-2.5 text-xs font-bold rounded-lg border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                          >
                            <span>Adjust</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeleteIngredient(item.id)}
                            className="size-7.5 text-muted-foreground hover:text-[#A83232] rounded-lg"
                            title="Delete ingredient"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
