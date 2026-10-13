"use client"

import * as React from "react"
import { ConsumableItem } from "./types"

interface ConsumablesBreakdownCardProps {
  items: ConsumableItem[]
  totalFormatted?: string
  percentageOfSales?: number
  comparisonSalesFormatted?: string
  footnoteRange?: string
  onLogPurchase?: () => void
}

export function ConsumablesBreakdownCard({
  items,
  totalFormatted = "RWF 432,000",
  percentageOfSales = 5.0,
  comparisonSalesFormatted = "RWF 8,640,000",
  footnoteRange = "1–30 Sep",
  onLogPurchase,
}: ConsumablesBreakdownCardProps) {
  return (
    <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
            Monthly consumables
          </h2>
          {onLogPurchase && (
            <button
              type="button"
              onClick={onLogPurchase}
              className="text-xs font-bold text-primary hover:underline"
            >
              + Log Purchase
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            {totalFormatted}
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-[#234D3A] dark:text-emerald-400">
            {percentageOfSales.toFixed(1)}% of sales
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.name} className="flex items-center text-xs">
              <span className="w-28 sm:w-32 truncate text-[#2C221E] dark:text-foreground font-normal">
                {item.name}
              </span>
              <div className="flex-1 mx-3 h-2 rounded-full bg-[#EFE8DF] dark:bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#234D3A]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-16 text-right font-bold text-[#2C221E] dark:text-foreground">
                {item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card footer description */}
      <p className="mt-6 pt-3 border-t border-border/50 text-[11px] text-[#8C7D73] dark:text-muted-foreground leading-relaxed">
        {footnoteRange} · Totals by purchase date, not estimated usage. Compared with {comparisonSalesFormatted} in sales.
      </p>
    </div>
  )
}
