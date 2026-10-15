"use client"

import * as React from "react"
import { ArrowUpRight, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardKpiData } from "./types"

export interface DashboardKpiCardsProps {
  data: DashboardKpiData
}

export function DashboardKpiCards({ data }: DashboardKpiCardsProps) {
  const { totalSales, consumables, profitMargin } = data

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* KPI 1: TOTAL SALES */}
      <Card className="relative overflow-hidden rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md min-w-0">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground gap-2">
          <span className="truncate">TOTAL SALES</span>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ArrowUpRight className="size-3" />
            {totalSales.changePercentage}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2 min-w-0">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE] truncate">
            {totalSales.amountFormatted}
          </span>
          <span className="text-xs font-bold text-muted-foreground shrink-0">
            RWF
          </span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground truncate">
          {totalSales.subtitle}
        </p>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${totalSales.progressPercent}%` }}
          />
        </div>
      </Card>

      {/* KPI 2: CONSUMABLES */}
      <Card className="relative overflow-hidden rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md min-w-0">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground gap-2">
          <span className="truncate">CONSUMABLES</span>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="size-3.5" />
            {consumables.healthBadge}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2 min-w-0">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE] truncate">
            {consumables.amountFormatted}
          </span>
          <span className="text-xs font-bold text-muted-foreground shrink-0">
            RWF
          </span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground truncate">
          {consumables.targetSubtitle}
        </p>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[#9E8A24]"
            style={{ width: `${consumables.progressPercent}%` }}
          />
        </div>
      </Card>

      {/* KPI 3: PROFIT MARGIN */}
      <Card className="relative overflow-hidden rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md min-w-0 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground gap-2">
          <span className="truncate">PROFIT MARGIN</span>
          <span className="shrink-0 inline-flex items-center rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-bold text-foreground">
            {profitMargin.marginBadge}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2 min-w-0">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE] truncate">
            {profitMargin.amountFormatted}
          </span>
          <span className="text-xs font-bold text-muted-foreground shrink-0">
            RWF
          </span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground truncate">
          {profitMargin.subtitle}
        </p>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${profitMargin.progressPercent}%` }}
          />
        </div>
      </Card>
    </div>
  )
}
