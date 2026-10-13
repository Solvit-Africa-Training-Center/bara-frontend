"use client"

import * as React from "react"
import { Database } from "lucide-react"
import { DemandForecastData } from "./types"

export interface DessertForecastCardProps {
  data: DemandForecastData
}

export function DessertForecastCard({ data }: DessertForecastCardProps) {
  return (
    <div className="rounded-[22px] border border-border/70 bg-card p-5.5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-[#8C7D73] dark:text-muted-foreground" />
            <h3 className="text-sm sm:text-base font-bold text-[#2C221E] dark:text-foreground">
              {data.title}
            </h3>
          </div>
          <span className="rounded-full bg-[#F0EBE5] dark:bg-muted px-2.5 py-0.5 text-xs font-medium text-[#736B63] dark:text-muted-foreground">
            {data.badgeLabel}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[#736B63] dark:text-muted-foreground">
          {data.description}
        </p>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#8C7D73] dark:text-muted-foreground">
            Data readiness
          </span>
          <span className="font-bold text-[#2C221E] dark:text-foreground">
            {data.readinessPercentage}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAE5DE] dark:bg-muted">
          <div
            className="h-full rounded-full bg-[#DF8D27]"
            style={{ width: `${data.readinessPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
