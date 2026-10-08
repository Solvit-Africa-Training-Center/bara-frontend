"use client"

import * as React from "react"
import { ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AuditEntry } from "./types"

interface ReportsAuditModalProps {
  isOpen: boolean
  onClose: () => void
  entries: AuditEntry[]
  voidedOrdersCount?: number
  voidedAmountFormatted?: string
  refundedOrdersCount?: number
  refundedAmountFormatted?: string
}

export function ReportsAuditModal({
  isOpen,
  onClose,
  entries,
  voidedOrdersCount = 12,
  voidedAmountFormatted = "RWF 96,000",
  refundedOrdersCount = 8,
  refundedAmountFormatted = "RWF 64,000",
}: ReportsAuditModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Audit Trail &amp; Exclusions</h3>
              <p className="text-[11px] text-muted-foreground">Detailed log of voided and refunded transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <span className="text-[11px] text-muted-foreground">Voided Transactions</span>
              <div className="text-lg font-bold text-foreground mt-0.5">{voidedOrdersCount} orders</div>
              <span className="text-xs text-[#C85A24] font-semibold">{voidedAmountFormatted} excluded</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <span className="text-[11px] text-muted-foreground">Refunded Transactions</span>
              <div className="text-lg font-bold text-foreground mt-0.5">{refundedOrdersCount} orders</div>
              <span className="text-xs text-[#C85A24] font-semibold">{refundedAmountFormatted} excluded</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-foreground mb-2">Recent Void / Refund Events</h4>
            <div className="rounded-xl border border-border/60 overflow-hidden text-xs">
              <div className="bg-muted/40 p-2.5 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground grid grid-cols-12">
                <span className="col-span-3">TIMESTAMP</span>
                <span className="col-span-2">TYPE</span>
                <span className="col-span-4">REASON</span>
                <span className="col-span-3 text-right">AMOUNT</span>
              </div>
              <div className="divide-y divide-border/40">
                {entries.map((row, idx) => (
                  <div key={idx} className="p-2.5 grid grid-cols-12 items-center">
                    <span className="col-span-3 text-muted-foreground font-mono text-[11px]">{row.time}</span>
                    <span className="col-span-2">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                          row.type === "Void"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                        )}
                      >
                        {row.type}
                      </span>
                    </span>
                    <span className="col-span-4 text-foreground truncate">{row.reason}</span>
                    <span className="col-span-3 text-right font-bold text-foreground">{row.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            size="sm"
            className="rounded-xl bg-[#234D3A] text-white text-xs cursor-pointer hover:bg-[#1A3B2C]"
            onClick={onClose}
          >
            Close Audit View
          </Button>
        </div>
      </div>
    </div>
  )
}
