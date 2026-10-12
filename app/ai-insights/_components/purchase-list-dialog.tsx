"use client"

import * as React from "react"
import { ClipboardList, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PredictedRestockItem } from "./types"

export interface PurchaseListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: PredictedRestockItem[]
  onCopyWhatsApp: () => void
  onApprove: () => void
  isCopied: boolean
}

export function PurchaseListDialog({
  open,
  onOpenChange,
  items,
  onCopyWhatsApp,
  onApprove,
  isCopied,
}: PurchaseListDialogProps) {
  const totalCost = items.reduce((sum, item) => sum + item.estCostRwf, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-[#244830]">
            <ClipboardList className="size-5" />
            <DialogTitle className="text-base font-bold text-foreground">
              Generated Restock Purchase List
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Suggested quantities based on recipe requirements and 7-day run-out speed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="space-y-2">
            {items.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground text-xs">{row.item}</p>
                    {row.urgent && (
                      <span className="rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.2">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Depletion: {row.likelyRunOut} · {row.supplier}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-xs">{row.suggestedQty}</p>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {row.estCostFormatted}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 font-semibold text-xs">
            <span>Total Estimated Restock Spend</span>
            <span className="text-sm font-bold text-foreground">
              RWF {totalCost.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <Button
            size="sm"
            variant="outline"
            onClick={onCopyWhatsApp}
            className="h-8 rounded-xl text-xs font-semibold gap-1.5"
          >
            <Copy className="size-3.5" />
            <span>{isCopied ? "Copied!" : "Copy WhatsApp Order"}</span>
          </Button>
          <Button
            size="sm"
            onClick={onApprove}
            className="h-8 rounded-xl bg-[#244830] hover:bg-[#1E3B27] text-white text-xs font-semibold"
          >
            Approve Purchase List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
