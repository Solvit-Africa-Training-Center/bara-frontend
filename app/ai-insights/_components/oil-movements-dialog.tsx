"use client"

import * as React from "react"
import { Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { StockMovementRecord } from "./types"

export interface OilMovementsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: StockMovementRecord[]
  onAcknowledge: () => void
  isAcknowledged: boolean
}

export function OilMovementsDialog({
  open,
  onOpenChange,
  records,
  onAcknowledge,
  isAcknowledged,
}: OilMovementsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-[#C53030]">
            <Droplets className="size-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Stock Movements: Cooking Oil
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Audit for Week 24–30 September. Baseline expectation: 7.5 L · Actual used: 9.8 L (+31%).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 dark:bg-rose-950/20 p-3">
            <p className="font-semibold text-rose-900 dark:text-rose-200">
              Root Cause Identified:
            </p>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">
              Deep Fryer #1 oil was completely discarded and refilled on Wednesday evening (3.2 L), 2 days before the standard Friday cycle. Thermostat logs recorded prolonged 205°C frying during fish rush.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-muted-foreground">
                  <th className="pb-2">Date &amp; Time</th>
                  <th className="pb-2">Movement Type</th>
                  <th className="pb-2">Quantity</th>
                  <th className="pb-2 text-right">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="py-2 font-medium">{rec.timestamp}</td>
                    <td
                      className={`py-2 ${
                        rec.highlight
                          ? "text-rose-600 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {rec.movementType}
                    </td>
                    <td
                      className={`py-2 font-bold ${
                        rec.highlight ? "text-rose-600" : "text-foreground"
                      }`}
                    >
                      {rec.quantity}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {rec.loggedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground">
            Variance Impact: ~18,240 RWF excess cost
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isAcknowledged ? "outline" : "default"}
              onClick={onAcknowledge}
              className={cn(
                "h-8 rounded-xl text-xs font-semibold",
                isAcknowledged
                  ? "text-emerald-700"
                  : "bg-[#244830] hover:bg-[#1E3B27] text-white"
              )}
            >
              {isAcknowledged ? "Acknowledged" : "Acknowledge Variance"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
