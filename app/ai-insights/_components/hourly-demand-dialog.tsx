"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HourlyDemandSlot } from "./types"

export interface HourlyDemandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slots: HourlyDemandSlot[]
  onUpdateSchedule: () => void
}

export function HourlyDemandDialog({
  open,
  onOpenChange,
  slots,
  onUpdateSchedule,
}: HourlyDemandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="size-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Lunch Service Hourly Demand
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Tuesday &amp; Wednesday lunch orders surge 20 minutes earlier than normal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="space-y-2">
            {slots.map((slot) => (
              <div key={slot.time} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground">{slot.time}</span>
                  <span className="text-muted-foreground font-medium">
                    {slot.orders} orders ({slot.note})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              Actionable Recommendation:
            </p>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">
              Fire the charcoal grill at 11:15 AM on Tuesdays and Wednesdays. Pre-skewer 40 goat and chicken brochettes by 11:40 AM to reduce table wait times from 24 mins to under 12 mins.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-border/60">
          <Button
            size="sm"
            onClick={onUpdateSchedule}
            className="h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
          >
            Update Grill Prep Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
