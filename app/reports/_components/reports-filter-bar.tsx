"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReportPeriod } from "./types"

interface ReportsFilterBarProps {
  period: ReportPeriod
  onPeriodChange: (period: ReportPeriod) => void
  dateLabel: string
  onOpenDatePicker: () => void
  isLoading?: boolean
}

export function ReportsFilterBar({
  period,
  onPeriodChange,
  dateLabel,
  onOpenDatePicker,
  isLoading = false,
}: ReportsFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left: Period pill selector */}
      <div className="inline-flex items-center gap-1 rounded-xl bg-[#F0ECE4] dark:bg-muted/50 p-1 self-start shadow-2xs">
        <button
          onClick={() => onPeriodChange("today")}
          disabled={isLoading && period === "today"}
          className={cn(
            "rounded-lg px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
            period === "today"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-[#6B5E55] dark:text-muted-foreground hover:text-foreground"
          )}
        >
          Today
        </button>
        <button
          onClick={() => onPeriodChange("week")}
          disabled={isLoading && period === "week"}
          className={cn(
            "rounded-lg px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
            period === "week"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-[#6B5E55] dark:text-muted-foreground hover:text-foreground"
          )}
        >
          Week
        </button>
        <button
          onClick={() => onPeriodChange("month")}
          disabled={isLoading && period === "month"}
          className={cn(
            "rounded-lg px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
            period === "month"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-[#6B5E55] dark:text-muted-foreground hover:text-foreground"
          )}
        >
          Month
        </button>
        <button
          onClick={() => onPeriodChange("custom")}
          className={cn(
            "rounded-lg px-3.5 py-1 text-xs font-medium transition-all cursor-pointer",
            period === "custom"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-[#6B5E55] dark:text-muted-foreground hover:text-foreground"
          )}
        >
          Custom
        </button>
      </div>

      {/* Right: Pro report badge, Timezone, Date range dropdown */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Pro report badge */}
        <span className="rounded-md bg-[#FFF8E6] dark:bg-amber-950/40 border border-[#FFE299] dark:border-amber-800/40 px-2 py-0.5 text-[11px] font-semibold text-[#A26D00] dark:text-amber-400">
          Pro report
        </span>

        {/* Timezone */}
        <span className="text-xs text-[#8C7D73] dark:text-[#A89A90]">
          Africa/Kigali
        </span>

        {/* Date range picker trigger */}
        <button
          onClick={onOpenDatePicker}
          className="flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 transition-colors shadow-2xs cursor-pointer"
        >
          <CalendarIcon className="size-3.5 text-[#8C7D73]" />
          <span>{dateLabel}</span>
          <ChevronDown className="size-3.5 text-[#8C7D73]" />
        </button>
      </div>
    </div>
  )
}
