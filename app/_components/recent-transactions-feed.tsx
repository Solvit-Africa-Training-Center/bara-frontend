"use client"

import * as React from "react"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransactionItem } from "./types"

export interface RecentTransactionsFeedProps {
  transactions: TransactionItem[]
  onViewAll: () => void
}

export function RecentTransactionsFeed({
  transactions,
  onViewAll,
}: RecentTransactionsFeedProps) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs w-full min-w-0">
      <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2">
        <div className="min-w-0">
          <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE] truncate">
            Recent Transaction Feed
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Instant electronic billing log
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 text-xs font-bold text-[#C85A24] hover:text-[#B34D1C] hover:underline cursor-pointer transition-colors"
        >
          View All Transactions
        </button>
      </div>

      <div className="mt-3 divide-y divide-border/50">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/30 px-1 rounded-xl min-w-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-foreground">
                  {tx.title}
                </span>
                <span className="shrink-0 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-1.5 py-0.2 text-[10px] font-bold">
                  {tx.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {tx.time} • Server: {tx.server} • Receipt {tx.receiptNo}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-sm font-bold text-foreground">
                {tx.amountFormatted}
              </span>
              <div className="flex items-center gap-1.5 sm:justify-end text-xs text-muted-foreground mt-0.5">
                <span className={`size-2 rounded-full ${tx.dotColor}`} />
                <span>{tx.paymentMethod}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
