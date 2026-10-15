"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { WeeklyHeroInsight } from "./types"

export interface WeeklySummaryHeroProps {
  insight: WeeklyHeroInsight
}

export function WeeklySummaryHero({ insight }: WeeklySummaryHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-primary p-6 sm:p-7 md:p-8 text-primary-foreground shadow-sm border border-primary/25">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-2xs">
            <Sparkles className="size-5 fill-white text-white" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
            {insight.titleTag}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-medium text-primary-foreground/75 shrink-0">
          {insight.dateRange}
        </span>
      </div>

      <p className="mt-3.5 text-lg sm:text-xl md:text-[22px] font-bold leading-relaxed text-primary-foreground tracking-tight max-w-5xl">
        {insight.headline}
      </p>

      <p className="mt-3.5 text-xs text-primary-foreground/70 font-normal">
        {insight.telemetrySummary}
      </p>
    </div>
  )
}
