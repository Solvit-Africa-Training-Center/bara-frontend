"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { LunchOpportunityData } from "./types"

export interface LunchOpportunityCardProps {
  data: LunchOpportunityData
  onViewDemand: () => void
}

export function LunchOpportunityCard({
  data,
  onViewDemand,
}: LunchOpportunityCardProps) {
  return (
    <div className="rounded-[22px] border border-[#D5EAD9] dark:border-emerald-800/40 bg-[#EAF5EC] dark:bg-[#1A3324]/50 p-5.5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#2E7D32] dark:text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-[#1E3B27] dark:text-emerald-100">
              {data.title}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DBEEDD] dark:bg-emerald-950/70 px-2.5 py-0.5 text-xs font-semibold text-[#245938] dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-[#2E7D32]" />
            {data.confidenceLabel}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[#3D5A46] dark:text-emerald-200/80">
          {data.description}
        </p>
      </div>

      <button
        type="button"
        onClick={onViewDemand}
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
      >
        <span>{data.actionLabel}</span>
        <span>→</span>
      </button>
    </div>
  )
}
