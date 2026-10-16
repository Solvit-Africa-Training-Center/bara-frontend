"use client"

import * as React from "react"
import { Layers, ShieldCheck } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { ConsumableCategory } from "./types"

export interface ConsumablesSpendCardProps {
  categories: ConsumableCategory[]
  totalSpendFormatted?: string
  sourcingEfficiency?: string
}

export function ConsumablesSpendCard({
  categories,
  totalSpendFormatted = "3,180,000 RWF COGS",
  sourcingEfficiency = "88.4% Rwandan Farm Sourced",
}: ConsumablesSpendCardProps) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between w-full min-w-0">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE] truncate">
                Consumables Spend
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Breakdown of {totalSpendFormatted}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-muted/80 text-foreground px-2.5 py-0.5 text-[11px] font-bold">
            {categories.length} Categories
          </span>
        </div>

        <div className="mt-4 space-y-3.5">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`size-2.5 rounded-full shrink-0 ${cat.dotColor}`} />
                    <span className="font-semibold text-foreground truncate">
                      {cat.name}
                    </span>
                  </div>
                  <div className="text-right text-xs shrink-0 whitespace-nowrap">
                    <span className="font-bold text-foreground">
                      {cat.percentage}%
                    </span>
                    <span className="text-muted-foreground ml-1 font-medium">
                      ({cat.amountFormatted})
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${cat.barColor}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">No Consumables Logged</p>
              <p className="mt-1">Log non-food operational purchases to track ongoing supplies spend.</p>
            </div>
          )}
        </div>
      </div>

      {/* Local sourcing efficiency banner */}
      <div className="mt-5 rounded-xl border border-emerald-200/60 bg-[#EEF7EF] dark:bg-emerald-950/20 dark:border-emerald-900/40 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-xs text-[#245938] dark:text-emerald-300">
        <div className="flex items-center gap-2 font-medium min-w-0">
          <ShieldCheck className="size-4 text-[#2E7D32] dark:text-emerald-400 shrink-0" />
          <span className="truncate">Local sourcing efficiency</span>
        </div>
        <span className="font-bold shrink-0">{sourcingEfficiency}</span>
      </div>
    </Card>
  )
}
