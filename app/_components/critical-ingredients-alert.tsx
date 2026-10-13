"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface CriticalIngredientsAlertProps {
  message?: string
  badgeLabel?: string
  actionLabel?: string
  href?: string
  onActionClick?: () => void
}

export function CriticalIngredientsAlert({
  message = "3 Critical Ingredients Below Threshold: Cassava Flour, Cooking Oil, Goat Meat",
  badgeLabel = "ALERT",
  actionLabel = "Restock in Inventory",
  href = "/inventory",
  onActionClick,
}: CriticalIngredientsAlertProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#E05252]/15 dark:bg-[#E05252]/20 border border-[#E05252]/40 p-3 sm:p-4 text-foreground shadow-xs w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#C53030] text-white shadow-2xs">
            <AlertCircle className="size-5 text-white" />
          </div>

          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="shrink-0 rounded-full bg-[#C53030] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
              {badgeLabel}
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE] break-words">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <Button
            size="sm"
            render={<Link href={href} />}
            className="w-full sm:w-auto h-8 rounded-xl bg-[#C53030] hover:bg-[#A82828] text-white text-xs font-bold px-3.5 gap-1.5 shadow-xs justify-center"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
