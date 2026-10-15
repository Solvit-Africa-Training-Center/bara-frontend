"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  CloudOff,
  Filter,
  Search,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StockMovement } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface StockMovementsTableProps {
  movements: StockMovement[]
  onDeleteMovement?: (id: string) => void
}

export function StockMovementsTable({ movements }: StockMovementsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<"all" | "in" | "out" | "waste">("all")

  const filtered = movements.filter((m) => {
    const matchesSearch =
      (m.ingredient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.note || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.recorded_by_name || "").toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (typeFilter !== "all" && m.movement_type !== typeFilter) return false
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
            placeholder="Search movements by ingredient, staff, note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto p-1 bg-muted/70 rounded-xl border border-border/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all cursor-pointer",
              typeFilter === "all"
                ? "bg-card text-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Movements
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("in")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              typeFilter === "in"
                ? "bg-card text-[#2F5233] dark:text-emerald-400 font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowUp className="size-3 text-[#2F5233] dark:text-emerald-400" />
            <span>Stock In</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("out")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              typeFilter === "out"
                ? "bg-card text-primary font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowDown className="size-3 text-primary" />
            <span>Stock Out</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("waste")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
              typeFilter === "waste"
                ? "bg-card text-[#A83232] font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Trash2 className="size-3 text-[#A83232]" />
            <span>Waste / Spoilage</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/70 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Date / Time (CAT)</th>
                <th className="py-3 px-4">Ingredient</th>
                <th className="py-3 px-4">Movement Type</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4">Note / Audit Reason</th>
                <th className="py-3 px-4 text-right">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-[#3B2F2A] dark:text-[#FAF5EE]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No stock movement audit records found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const dateObj = new Date(m.occurred_at)
                  const dateStr = dateObj.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  const timeStr = dateObj.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })

                  const isStockIn = m.movement_type === "in"
                  const isWaste = m.movement_type === "waste"

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Date & Time */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">{dateStr}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                          {timeStr} Kigali
                        </div>
                      </td>

                      {/* Ingredient */}
                      <td className="py-3 px-4 font-bold text-foreground">
                        {m.ingredient_name || "Ingredient"}
                      </td>

                      {/* Movement Type */}
                      <td className="py-3 px-4">
                        {isStockIn ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2F5233]/10 border border-[#2F5233]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#2F5233] dark:text-emerald-400">
                            <ArrowUp className="size-3" />
                            <span>Stock In</span>
                          </span>
                        ) : isWaste ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A83232]/10 border border-[#A83232]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#A83232]">
                            <Trash2 className="size-3" />
                            <span>Kitchen Waste</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                            <ArrowDown className="size-3" />
                            <span>Stock Out</span>
                          </span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-3 px-4 text-right font-extrabold tabular-nums text-sm">
                        <span
                          className={cn(
                            isStockIn && "text-[#2F5233] dark:text-emerald-400",
                            isWaste && "text-[#A83232]",
                            !isStockIn && !isWaste && "text-primary"
                          )}
                        >
                          {isStockIn ? `+${m.quantity}` : `-${m.quantity}`}
                        </span>
                      </td>

                      {/* Staff */}
                      <td className="py-3 px-4 font-medium text-foreground">
                        {m.recorded_by_name || "Staff Member"}
                      </td>

                      {/* Note */}
                      <td className="py-3 px-4 max-w-xs truncate text-muted-foreground">
                        {m.note || "—"}
                      </td>

                      {/* Sync */}
                      <td className="py-3 px-4 text-right">
                        {m.synced_at ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Synced</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            <CloudOff className="size-3" />
                            <span>Queued</span>
                          </span>
                        )}
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
