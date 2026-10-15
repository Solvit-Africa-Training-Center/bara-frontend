"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface InsightsHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InsightsHelpDialog({
  open,
  onOpenChange,
}: InsightsHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-foreground">
            <HelpCircle className="size-5 text-primary" />
            <DialogTitle className="text-base font-bold text-foreground">
              How Bara AI Insights Works
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Operational machine intelligence designed for Rwandan restaurant kitchens &amp; bars.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-muted-foreground leading-relaxed">
          <div>
            <p className="font-bold text-foreground text-xs">
              1. Continuous Telemetry
            </p>
            <p className="mt-0.5">
              Every ticket, refund, discount, and inventory deduction is aggregated in real time across all tills and prep stations.
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground text-xs">
              2. Statistical Anomaly Baselines
            </p>
            <p className="mt-0.5">
              The engine evaluates rolling 30-day patterns. If ingredient usage deviates by more than 15% from sales volume, an anomaly flag is created.
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground text-xs">
              3. Depletion &amp; Run-out Projections
            </p>
            <p className="mt-0.5">
              By combining average day-of-week sales with recipe portions, Bara forecasts exact run-out times (e.g. Tomorrow at 14:00) so you never run out during prime dinner rush.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-border/60">
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
