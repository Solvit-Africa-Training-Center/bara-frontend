"use client"

import * as React from "react"
import { Download, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportsHeaderProps {
  onExport: () => void
  onOpenHelp: () => void
}

export function ReportsHeader({ onExport, onOpenHelp }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
          Reports
        </h1>
        <p className="text-xs sm:text-sm text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
          Sales, menu performance and spending at a glance.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Online Synced pill */}
        <div className="flex items-center gap-1.5 rounded-full bg-[#EAF5EC] dark:bg-emerald-950/40 border border-[#C8E6C9] dark:border-emerald-800/40 px-3 py-1 text-xs font-medium text-[#2E7D32] dark:text-emerald-400">
          <span className="size-2 rounded-full bg-[#2E7D32] dark:bg-emerald-400" />
          <span>Online · Synced now</span>
        </div>

        {/* Export report button */}
        <Button
          size="sm"
          onClick={onExport}
          className="h-8 gap-1.5 rounded-xl bg-[#C85A24] hover:bg-[#B24515] text-white text-xs font-semibold px-3.5 shadow-xs cursor-pointer"
        >
          <Download className="size-3.5" />
          <span>Export report</span>
        </Button>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          aria-label="Help & Documentation"
          className="size-8 rounded-xl border border-border/80 bg-card flex items-center justify-center text-[#8C7D73] hover:text-[#2C221E] dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
        >
          <HelpCircle className="size-4" />
        </button>
      </div>
    </div>
  )
}
