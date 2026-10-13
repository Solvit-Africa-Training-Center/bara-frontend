"use client"

import * as React from "react"
import { AlertCircle, Calendar as CalendarIcon, Check, X } from "lucide-react"
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
  minDate?: string
  maxDate?: string
}

function DateRangePickerContent({
  onClose,
  onApply,
  initialStart = "2026-09-01",
  initialEnd = "2026-09-30",
  minDate = "2024-01-01",
  maxDate = "2026-10-06",
}: Omit<DateRangePickerProps, "isOpen">) {
  const [startDate, setStartDate] = React.useState(initialStart)
  const [endDate, setEndDate] = React.useState(initialEnd)

  // Calculate day difference & validation
  const getDaysDifference = (start: string, end: string): number => {
    if (!start || !end) return 0
    const s = new Date(start)
    const e = new Date(end)
    const diffTime = e.getTime() - s.getTime()
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const daysCount = getDaysDifference(startDate, endDate)
  const isStartValid = Boolean(startDate && startDate.length === 10)
  const isEndValid = Boolean(endDate && endDate.length === 10)
  const isChronological = isStartValid && isEndValid && startDate <= endDate
  const isStartAfterMin = !minDate || (startDate && startDate >= minDate)
  const isEndBeforeMax = !maxDate || (endDate && endDate <= maxDate)
  const isStartBeforeMax = !maxDate || (startDate && startDate <= maxDate)

  let errorMessage: string | null = null
  if (!isStartValid || !isEndValid) {
    errorMessage = "Please enter both a start date and an end date."
  } else if (!isChronological) {
    errorMessage = "Start date must be before or equal to the end date."
  } else if (!isStartBeforeMax || !isEndBeforeMax) {
    errorMessage = `Future dates are not allowed. Max date is ${maxDate}.`
  } else if (!isStartAfterMin) {
    errorMessage = `Dates before ${minDate} are outside the historical audit retention.`
  }

  const isValidRange = !errorMessage

  const presets = [
    { id: "today", label: "Today", start: "2026-10-06", end: "2026-10-06" },
    { id: "yesterday", label: "Yesterday", start: "2026-10-05", end: "2026-10-05" },
    { id: "last7", label: "Last 7 Days", start: "2026-09-30", end: "2026-10-06" },
    { id: "last30", label: "Last 30 Days", start: "2026-09-07", end: "2026-10-06" },
    { id: "thisMonth", label: "This Month (Oct)", start: "2026-10-01", end: "2026-10-06" },
    { id: "lastMonth", label: "Last Month (Sep)", start: "2026-09-01", end: "2026-09-30" },
  ]

  const handlePresetSelect = (p: typeof presets[0]) => {
    setStartDate(p.start)
    setEndDate(p.end)
  }

  const handleStartDateChange = (val: string) => {
    setStartDate(val)
    if (val && endDate && val > endDate) {
      setEndDate(val)
    }
  }

  const handleEndDateChange = (val: string) => {
    setEndDate(val)
    if (val && startDate && val < startDate) {
      setStartDate(val)
    }
  }

  const handleApply = () => {
    if (!isValidRange) return

    let label = `${startDate} – ${endDate}`
    const matchedPreset = presets.find((p) => p.start === startDate && p.end === endDate)
    if (matchedPreset) {
      label = matchedPreset.label
    } else {
      try {
        const sDate = new Date(startDate)
        const eDate = new Date(endDate)
        const sMonth = sDate.toLocaleString("default", { month: "short" })
        const eMonth = eDate.toLocaleString("default", { month: "short" })
        const sDay = sDate.getDate()
        const eDay = eDate.getDate()
        const year = eDate.getFullYear()

        if (sMonth === eMonth) {
          label = `${sDay}–${eDay} ${sMonth} ${year}`
        } else {
          label = `${sDay} ${sMonth} – ${eDay} ${eMonth} ${year}`
        }
      } catch {
        label = `${startDate} – ${endDate}`
      }
    }

    onApply(startDate, endDate, label)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-foreground truncate">Select Custom Date Range</h2>
              <p className="text-[11px] text-muted-foreground truncate">
                Filter metrics, ledger shifts, and operational analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <Label className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
            Quick Presets
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
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

        {/* Custom Date Pickers with Strict Bounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
          <div className="space-y-1.5">
            <Label htmlFor="start-date" className="text-xs">
              From Date
            </Label>
            <Input
              id="start-date"
              type="date"
              min={minDate}
              max={maxDate}
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className={cn(
                "h-10 rounded-xl bg-background font-medium text-xs",
                !isChronological && "border-destructive focus-visible:ring-destructive"
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end-date" className="text-xs">
              To Date
            </Label>
            <Input
              id="end-date"
              type="date"
              min={startDate || minDate}
              max={maxDate}
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className={cn(
                "h-10 rounded-xl bg-background font-medium text-xs",
                !isChronological && "border-destructive focus-visible:ring-destructive"
              )}
            />
          </div>
        </div>

        {/* Validation Feedback & Range Summary */}
        <div className="space-y-2">
          {errorMessage ? (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <div className="rounded-xl bg-muted/60 px-3.5 py-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>Selected Period:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {startDate} &nbsp;➔&nbsp; {endDate}
                </span>
                <span className="rounded-md bg-primary/10 text-primary font-semibold px-2 py-0.5 text-[11px]">
                  {daysCount} {daysCount === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-xs cursor-pointer">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!isValidRange}
            className={cn(
              "rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs px-5 shadow-xs cursor-pointer",
              !isValidRange && "opacity-50 cursor-not-allowed"
            )}
          >
            Apply Range
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DateRangePickerModal(props: DateRangePickerProps) {
  if (!props.isOpen) return null
  return <DateRangePickerContent {...props} />
}
