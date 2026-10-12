"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, Plus, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface DashboardOperationsBarProps {
  restaurantName: string
  activeBranch: string
  selectedPeriod: "today" | "yesterday" | "week" | "custom"
  onSelectPeriod: (p: "today" | "yesterday" | "week" | "custom") => void
  customLabel: string
  onOpenDatePicker: () => void
  onNewMenu?: () => void
  onNewOrder?: () => void
}

export function DashboardOperationsBar({
  restaurantName,
  activeBranch,
  selectedPeriod,
  onSelectPeriod,
  customLabel,
  onOpenDatePicker,
}: DashboardOperationsBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Store className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground">
              {restaurantName} Operations
            </h1>
            <Badge
              variant="success"
              className="gap-1 rounded-full text-[10px] font-bold py-0.5"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live POS Connected
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Know your daily numbers. Real-time overview for {restaurantName} ({activeBranch}).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => onSelectPeriod("today")}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
              selectedPeriod === "today"
                ? "bg-[#C85A24] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onSelectPeriod("yesterday")}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
              selectedPeriod === "yesterday"
                ? "bg-[#C85A24] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => onSelectPeriod("week")}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
              selectedPeriod === "week"
                ? "bg-[#C85A24] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={onOpenDatePicker}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer",
              selectedPeriod === "custom"
                ? "bg-[#C85A24] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="size-3.5" />
            <span>{selectedPeriod === "custom" ? customLabel : "Custom"}</span>
          </button>
        </div>

        <Button
          render={<Link href="/menu" />}
          size="sm"
          className="h-8.5 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-bold px-3.5 shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>New Menu</span>
        </Button>
      </div>
    </div>
  )
}
