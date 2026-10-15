"use client"

import * as React from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"

interface ReportsAuditBannerProps {
  onViewAuditTrail: () => void
  voidedCount?: number
  voidedAmountFormatted?: string
  refundedCount?: number
  refundedAmountFormatted?: string
}

export function ReportsAuditBanner({
  onViewAuditTrail,
  voidedCount = 12,
  voidedAmountFormatted = "RWF 96,000",
  refundedCount = 8,
  refundedAmountFormatted = "RWF 64,000",
}: ReportsAuditBannerProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs shadow-2xs">
      <div className="flex items-center gap-2 text-[#8C7D73] dark:text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-[#8C7D73] dark:text-muted-foreground" />
        <span>
          Excluded from revenue: {voidedCount} voided orders ({voidedAmountFormatted}) and {refundedCount} refunded orders ({refundedAmountFormatted}).
        </span>
      </div>
      <button
        onClick={onViewAuditTrail}
        className="text-primary font-semibold hover:underline cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1"
      >
        <span>View audit trail</span>
        <ArrowRight className="size-3" />
      </button>
    </div>
  )
}
