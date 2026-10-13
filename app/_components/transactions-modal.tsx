"use client"

import * as React from "react"
import { ReceiptText, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TransactionItem, PaymentMethodType } from "./types"

export interface TransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: TransactionItem[]
}

export function TransactionsModal({
  open,
  onOpenChange,
  transactions,
}: TransactionsModalProps) {
  const [filterMethod, setFilterMethod] = React.useState<string>("All")
  const [search, setSearch] = React.useState("")

  const filtered = transactions.filter((tx) => {
    const matchesMethod =
      filterMethod === "All" || tx.paymentMethod === filterMethod
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
      tx.server.toLowerCase().includes(search.toLowerCase())
    return matchesMethod && matchesSearch
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-4 sm:p-6">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ReceiptText className="size-4.5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-foreground truncate">
                All Live Shift Transactions
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 truncate">
                Instant electronic POS billing journal &amp; receipt audit.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="relative flex-1">
            <Search className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table, item, or receipt #..."
              className="w-full rounded-xl border border-border bg-background pl-8.5 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
            {["All", "MTN MoMo", "Cash", "Visa Card"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFilterMethod(method)}
                className={`shrink-0 rounded-lg px-2.5 py-1 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  filterMethod === method
                    ? "bg-[#C85A24] text-white"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-3 divide-y divide-border/50 max-h-[380px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No transactions match your search filter.
            </p>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 hover:bg-muted/30 px-1 rounded-xl transition-colors gap-1 sm:gap-2 min-w-0"
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
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
