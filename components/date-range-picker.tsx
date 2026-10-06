"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (start: string, end: string, label: string) => void
  initialStart?: string
  initialEnd?: string
}

export function DateRangePickerModal({
  isOpen,
  onClose,
  onApply,
  initialStart = "2026-10-01",
  initialEnd = "2026-10-06",
}: DateRangePickerProps) {
  const [startDate, setStartDate] = React.useState(initialStart)
  const [endDate, setEndDate] = React.useState(initialEnd)

  if (!isOpen) return null

  const presets = [
    { id: "today", label: "Today", start: "2026-10-06", end: "2026-10-06" },
    { id: "yesterday", label: "Yesterday", start: "2026-10-05", end: "2026-10-05" },
    { id: "last7", label: "Last 7 Days", start: "2026-09-30", end: "2026-10-06" },
    { id: "last30", label: "Last 30 Days", start: "2026-09-07", end: "2026-10-06" },
    { id: "thisMonth", label: "This Month (Oct)", start: "2026-10-01", end: "2026-10-31" },
    { id: "lastMonth", label: "Last Month (Sep)", start: "2026-09-01", end: "2026-09-30" },
  ]

  const handlePresetSelect = (p: typeof presets[0]) => {
    setStartDate(p.start)
    setEndDate(p.end)
  }

  const handleApply = () => {
    let label = `${startDate} – ${endDate}`
    const matchedPreset = presets.find((p) => p.start === startDate && p.end === endDate)
    if (matchedPreset) {
      label = matchedPreset.label
    }
    onApply(startDate, endDate, label)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarIcon className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Select Custom Date Range</h2>
              <p className="text-[11px] text-muted-foreground">
                Filter metrics, ledger shifts, and operational analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <Label className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
            Quick Presets
          </Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer",
                  startDate === p.start && endDate === p.end
                    ? "border-primary bg-primary/10 text-primary shadow-2xs"
                    : "border-border hover:bg-muted/60 text-foreground"
                )}
              >
                <span className="truncate">{p.label}</span>
                {startDate === p.start && endDate === p.end && (
                  <Check className="size-3.5 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Pickers */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/50">
          <div className="space-y-1.5">
            <Label htmlFor="start-date">From Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 rounded-xl bg-background font-medium text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end-date">To Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 rounded-xl bg-background font-medium text-xs"
            />
          </div>
        </div>

        {/* Preview of selected range */}
        <div className="rounded-xl bg-muted/60 px-3.5 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>Active Period:</span>
          <span className="font-bold text-foreground">
            {startDate} &nbsp;➔&nbsp; {endDate}
          </span>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs px-5 shadow-xs"
          >
            Apply Range
          </Button>
        </div>
      </div>
    </div>
  )
}
