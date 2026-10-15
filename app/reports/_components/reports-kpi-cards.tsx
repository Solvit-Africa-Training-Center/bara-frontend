"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { ReportSummaryKPIs } from "./types"

interface ReportsKPICardsProps {
  kpis: ReportSummaryKPIs
}

export function ReportsKPICards({ kpis }: ReportsKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total sales (Dynamic Theme Brand Color) */}
      <div className="rounded-2xl bg-primary p-5 shadow-xs text-primary-foreground flex flex-col justify-between">
        <span className="text-xs font-medium text-primary-foreground/80">Total sales</span>
        <div className="mt-2 text-2xl font-bold tracking-tight text-primary-foreground">
          {kpis.totalSalesFormatted}
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-primary-foreground/80">
          <ArrowUp className="size-3 shrink-0" />
          <span>
            {kpis.salesGrowthPct.toFixed(1)}% vs {kpis.previousPeriodName} · {kpis.previousPeriodSalesFormatted}
          </span>
        </div>
      </div>

      {/* Card 2: Completed orders */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
        <span className="text-xs font-medium text-[#8C7D73] dark:text-muted-foreground">
          Completed orders
        </span>
        <div className="mt-2 text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
          {kpis.completedOrdersFormatted}
        </div>
        <div className="mt-2 text-[11px] text-[#8C7D73] dark:text-muted-foreground">
          Paid, non-refunded orders only
        </div>
      </div>

      {/* Card 3: Average order value */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
        <span className="text-xs font-medium text-[#8C7D73] dark:text-muted-foreground">
          Average order value
        </span>
        <div className="mt-2 text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
          {kpis.averageOrderValueFormatted}
        </div>
        <div className="mt-2 text-[11px] text-[#8C7D73] dark:text-muted-foreground">
          Total sales ÷ completed orders
        </div>
      </div>

      {/* Card 4: Consumables spending */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
        <span className="text-xs font-medium text-[#8C7D73] dark:text-muted-foreground">
          Consumables spending
        </span>
        <div className="mt-2 text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
          {kpis.consumablesSpendingFormatted}
        </div>
        <div className="mt-2 text-[11px] text-[#8C7D73] dark:text-muted-foreground">
          September purchases · {kpis.consumablesPct.toFixed(1)}% of sales
        </div>
      </div>
    </div>
  )
}
