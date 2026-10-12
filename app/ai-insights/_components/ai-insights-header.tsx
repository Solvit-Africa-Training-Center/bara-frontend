"use client"

import * as React from "react"
import { HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AIInsightsHeaderProps {
  onOpenAskBara: () => void
  onOpenHelp: () => void
  isSynced?: boolean
  planName?: string
}

export function AIInsightsHeader({
  onOpenAskBara,
  onOpenHelp,
  isSynced = true,
  planName = "Premium",
}: AIInsightsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
          AI Insights
        </h1>
        <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#A89A90] mt-1">
          Practical weekly analysis from your sales, menu and inventory data.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Real-time Status Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5EC] px-3 py-1.5 text-xs font-semibold text-[#245938] border border-[#D5EAD9] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 shadow-2xs">
          <span
            className={`size-2 rounded-full bg-[#2E7D32] ${
              isSynced ? "animate-pulse" : ""
            }`}
          />
          <span>Online · Synced now</span>
        </div>

        {/* Subscription Tier Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF0E9] px-3 py-1.5 text-xs font-semibold text-[#C05621] border border-[#F9DACB] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40 shadow-2xs">
          <span className="size-2 rounded-full bg-[#C05621]" />
          <span>{planName}</span>
        </div>

        {/* Ask Bara Trigger */}
        <Button
          size="sm"
          onClick={onOpenAskBara}
          className="h-8.5 rounded-xl bg-[#B84218] hover:bg-[#A03814] text-white px-3.5 text-xs font-semibold gap-1.5 shadow-xs transition-colors"
        >
          <Sparkles className="size-3.5 fill-current" />
          <span>Ask Bara</span>
        </Button>

        {/* Help Info Trigger */}
        <Button
          size="sm"
          variant="outline"
          onClick={onOpenHelp}
          className="size-8.5 p-0 rounded-full border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          title="How AI Insights works"
        >
          <HelpCircle className="size-4" />
        </Button>
      </div>
    </div>
  )
}
