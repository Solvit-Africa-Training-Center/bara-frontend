"use client"

import * as React from "react"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportsHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportsHelpModal({ isOpen, onClose }: ReportsHelpModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Reports &amp; Accounting Guide</h3>
              <p className="text-[11px] text-muted-foreground">How metrics and exclusions are calculated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="font-semibold text-foreground">Completed Sales Revenue</p>
            <p className="mt-1">
              Includes only fully settled and paid orders. Tax (18% VAT) is included in gross totals. Voids, complimentary orders, and chargebacks are excluded automatically.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="font-semibold text-foreground">Monthly Consumables</p>
            <p className="mt-1">
              Tracked by recorded purchase invoices rather than kitchen estimations. In September, consumables accounted for exactly 5.0% of total revenue.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="font-semibold text-foreground">Real-time Cloud Sync</p>
            <p className="mt-1">
              POS orders sync over encrypted WebSocket connection with the central Bara cloud. Offline sales buffer locally and reconcile automatically upon reconnecting.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            size="sm"
            className="rounded-xl bg-primary text-white text-xs cursor-pointer"
            onClick={onClose}
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}
