"use client"

import * as React from "react"
import { Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VoidIncidentRecord } from "./types"

export interface VoidDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: VoidIncidentRecord[]
  onFlagSupervisor: () => void
  isFlagged: boolean
}

export function VoidDetailsDialog({
  open,
  onOpenChange,
  records,
  onFlagSupervisor,
  isFlagged,
}: VoidDetailsDialogProps) {
  const totalValue = records.reduce((sum, r) => sum + r.amountRwf, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-[#D97706]">
            <Ban className="size-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Evening Void Incident Breakdown
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            7 items voided after 20:00 (Normal weekly average: 2). 5 entered at Till #2.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-muted-foreground">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Till / Operator</th>
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Value</th>
                  <th className="pb-2 text-right">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-[11px]">
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="py-2">{rec.time}</td>
                    <td className="py-2 font-medium">
                      {rec.till} ({rec.operator})
                    </td>
                    <td className="py-2 font-semibold">{rec.item}</td>
                    <td className="py-2">{rec.amountFormatted}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {rec.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 p-3">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Pattern Note:
            </p>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">
              Till #2 showed repeated manual item cancellations after orders were sent to the kitchen KDS. A manager authorization prompt is recommended for post-send cancellations.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground">
            Total Voided Value: RWF {totalValue.toLocaleString()}
          </span>
          <Button
            size="sm"
            onClick={onFlagSupervisor}
            className="h-8 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold"
          >
            {isFlagged ? "Flagged for Supervisor" : "Require Manager PIN"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
