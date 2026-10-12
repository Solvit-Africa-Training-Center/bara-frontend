"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { WeeklyHeroInsight } from "./types"

export interface WeeklySummaryHeroProps {
  insight: WeeklyHeroInsight
}

export function WeeklySummaryHero({ insight }: WeeklySummaryHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[#244830] dark:bg-[#1C3A26] p-6 sm:p-7 md:p-8 text-white shadow-sm border border-[#1E3E28]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-[#E69334] text-[#244830] shadow-2xs">
            <Sparkles className="size-5 fill-[#244830] text-[#244830]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F3B768]">
            {insight.titleTag}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-medium text-white/70 shrink-0">
          {insight.dateRange}
        </span>
      </div>

      <p className="mt-3.5 text-lg sm:text-xl md:text-[22px] font-bold leading-relaxed text-white tracking-tight max-w-5xl">
        {insight.headline}
      </p>

      <p className="mt-3.5 text-xs text-white/65 font-normal">
        {insight.telemetrySummary}
      </p>
    </div>
  )
}
