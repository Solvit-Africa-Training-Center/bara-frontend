"use client"

import * as React from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  ref: string
  time: string
  description: string
  category: string
  paymentMethod: string
  type: "sale" | "expense"
  amount: number
  verified: boolean
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    ref: "TRX-8821",
    time: "14:32",
    description: "Lunch Service Cash & POS Station 1",
    category: "Food Sales",
    paymentMethod: "MTN MoMo",
    type: "sale",
    amount: 840000,
    verified: true,
  },
  {
    id: "2",
    ref: "TRX-8820",
    time: "13:15",
    description: "Kigali Fresh Market (Vegetables & Herbs)",
    category: "COGS - Produce",
    paymentMethod: "Cash",
    type: "expense",
    amount: 65000,
    verified: true,
  },
  {
    id: "3",
    ref: "TRX-8819",
    time: "11:45",
    description: "Prime Butcher Delivery (Tenderloin & Ribs)",
    category: "COGS - Meat",
    paymentMethod: "Bank Transfer",
    type: "expense",
    amount: 320000,
    verified: true,
  },
  {
    id: "4",
    ref: "TRX-8818",
    time: "10:30",
    description: "Bar Opening Restock (Spirits, Wine & Mixers)",
    category: "Bar Expenses",
    paymentMethod: "Card / POS",
    type: "expense",
    amount: 180000,
    verified: true,
  },
  {
    id: "5",
    ref: "TRX-8817",
    time: "09:15",
    description: "Morning Breakfast & Coffee Service",
    category: "Beverage Sales",
    paymentMethod: "MTN MoMo",
    type: "sale",
    amount: 210000,
    verified: true,
  },
  {
    id: "6",
    ref: "TRX-8816",
    time: "08:30",
    description: "Kitchen Cooking Gas (2 x 50kg Refill)",
    category: "Utilities & Gas",
    paymentMethod: "Cash",
    type: "expense",
    amount: 45000,
    verified: true,
  },
]

export default function DailyTransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions)
  const [typeFilter, setTypeFilter] = React.useState<"all" | "sale" | "expense">("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [entryType, setEntryType] = React.useState<"sale" | "expense">("sale")
  const [description, setDescription] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [category, setCategory] = React.useState("Food Sales")
  const [paymentMethod, setPaymentMethod] = React.useState("MTN MoMo")
  const [isVerified, setIsVerified] = React.useState(true)
  const [successNotice, setSuccessNotice] = React.useState("")

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = typeFilter === "all" || t.type === typeFilter
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const totalInflow = transactions
    .filter((t) => t.type === "sale")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalOutflow = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const netCashFlow = totalInflow - totalOutflow

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const numAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0
    if (numAmount <= 0) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    const newRef = `TRX-${Math.floor(1000 + Math.random() * 9000)}`

    const newTrx: Transaction = {
      id: String(Date.now()),
      ref: newRef,
      time: timeStr,
      description,
      category,
      paymentMethod,
      type: entryType,
      amount: numAmount,
      verified: isVerified,
    }

    setTransactions([newTrx, ...transactions])
    setDescription("")
    setAmount("")
    setSuccessNotice(`Recorded ${newRef} successfully!`)
    setTimeout(() => setSuccessNotice(""), 3500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar matching Figma Frame 7 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Daily Transactions
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Record sales, manage shift expenses &amp; keep an accurate daily ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs">
            <Calendar className="size-3.5 text-primary" />
            <span>Today • Oct 5, 2026</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["Ref,Time,Description,Category,Type,Amount (RWF),Payment"]
                  .concat(
                    transactions.map(
                      (t) =>
                        `${t.ref},${t.time},"${t.description}",${t.category},${t.type},${t.amount},${t.paymentMethod}`
                    )
                  )
                  .join("\n")
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", "bara_daily_transactions.csv")
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Form: Quick Entry */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Quick Entry
              </h2>
              <p className="text-xs text-muted-foreground">
                Log receipts, pos end-of-shift sales or cash payments
              </p>
            </div>

            {/* Type Toggle Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => {
                  setEntryType("sale")
                  setCategory("Food Sales")
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all",
                  entryType === "sale"
                    ? "bg-card text-emerald-600 shadow-xs dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ArrowUpRight className="size-4" />
                <span>Sale (Revenue)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEntryType("expense")
                  setCategory("COGS - Meat")
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all",
                  entryType === "expense"
                    ? "bg-card text-rose-600 shadow-xs dark:text-rose-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ArrowDownLeft className="size-4" />
                <span>Expense (COGS / Ops)</span>
              </button>
            </div>

            {successNotice && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Description / Item Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    entryType === "sale"
                      ? "e.g. Dinner POS Cash Register 1"
                      : "e.g. Kigali Butchery delivery (Beef)"
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Amount (RWF)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="350,000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {entryType === "sale" ? (
                      <>
                        <option value="Food Sales">Main Kitchen &amp; Grills</option>
                        <option value="Beverage Sales">Bar &amp; Cocktails</option>
                        <option value="Desserts & Specials">Desserts &amp; Specials</option>
                        <option value="Catering & Events">Catering &amp; Events</option>
                      </>
                    ) : (
                      <>
                        <option value="COGS - Meat">COGS - Meat &amp; Poultry</option>
                        <option value="COGS - Produce">COGS - Fresh Produce</option>
                        <option value="COGS - Dairy">COGS - Dairy &amp; Cream</option>
                        <option value="Bar Expenses">Bar &amp; Spirits Stock</option>
                        <option value="Utilities & Gas">Gas &amp; Utilities</option>
                        <option value="Packaging & Consumables">Consumables &amp; Pack</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Payment Channel
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="MTN MoMo">MTN MoMo (Mobile Money)</option>
                    <option value="Card / POS">POS / Credit Card</option>
                    <option value="Cash">Physical Cash</option>
                    <option value="Bank Transfer">Bank Wire / Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Shift Period
                  </label>
                  <select
                    defaultValue="Lunch Service"
                    className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Breakfast">Morning / Breakfast</option>
                    <option value="Lunch Service">Lunch Rush (12:00 - 15:00)</option>
                    <option value="Dinner Service">Dinner Rush (18:00 - 22:00)</option>
                    <option value="Late Bar">Late Bar Service</option>
                  </select>
                </div>
              </div>

              {/* Verified Toggle */}
              <div className="flex items-center justify-between rounded-xl bg-background/70 border border-border p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Verified by Manager
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Logged by Alex Rivera (Floor Manager)
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDescription("")
                    setAmount("")
                  }}
                  className="h-9 flex-1 rounded-xl text-xs font-semibold"
                >
                  Clear Fields
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "h-9 flex-1 rounded-xl text-xs font-bold text-white shadow-xs transition-colors",
                    entryType === "sale"
                      ? "bg-[#234D3A] hover:bg-[#1A3B2C]"
                      : "bg-[#C85A24] hover:bg-[#B34D1C]"
                  )}
                >
                  <Plus className="mr-1 size-3.5" />
                  {entryType === "sale" ? "Save Sale" : "Save Expense"}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-5 rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground flex items-center justify-between border border-border/50">
            <span>Last transaction recorded: <strong>TRX-8821 (14:32)</strong></span>
            <span className="text-emerald-600 font-semibold">POS Synced</span>
          </div>
        </div>

        {/* Right Table: Today's Ledger */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Today&apos;s Ledger
                </h2>
                <p className="text-xs text-muted-foreground">
                  Audited timeline of cash flow and operational line items
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 rounded-xl bg-muted/70 p-1">
                <button
                  type="button"
                  onClick={() => setTypeFilter("all")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                    typeFilter === "all"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All ({transactions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("sale")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                    typeFilter === "sale"
                      ? "bg-card text-emerald-600 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sales
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("expense")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                    typeFilter === "expense"
                      ? "bg-card text-rose-600 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Expenses
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by description, reference, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8.5 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="pb-2.5 pl-1">Ref &amp; Time</th>
                    <th className="pb-2.5">Description</th>
                    <th className="pb-2.5">Category</th>
                    <th className="pb-2.5">Method</th>
                    <th className="pb-2.5 text-right pr-1">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredTransactions.map((trx) => (
                    <tr
                      key={trx.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="py-2.5 pl-1 font-mono text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{trx.time}</span>
                          <span className="text-[10px] opacity-70">{trx.ref}</span>
                        </div>
                      </td>
                      <td className="py-2.5 font-medium text-foreground max-w-[200px] truncate">
                        {trx.description}
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                          {trx.category}
                        </span>
                      </td>
                      <td className="py-2.5 text-muted-foreground text-[11px]">
                        {trx.paymentMethod}
                      </td>
                      <td className="py-2.5 text-right pr-1 font-bold whitespace-nowrap">
                        <span
                          className={cn(
                            "rounded-lg px-2 py-0.5 text-[11px]",
                            trx.type === "sale"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          )}
                        >
                          {trx.type === "sale" ? "+" : "-"}
                          {trx.amount.toLocaleString()} RWF
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-xs text-muted-foreground"
                      >
                        No transactions found matching &quot;{searchQuery}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Financial Summary Strip matching Figma */}
          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
            <div className="grid grid-cols-3 gap-2 text-center sm:text-left">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Total Inflow
                </p>
                <p className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  +{totalInflow.toLocaleString()} RWF
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Total Outflow
                </p>
                <p className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400">
                  -{totalOutflow.toLocaleString()} RWF
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Net Balance
                </p>
                <p className="text-sm sm:text-base font-extrabold text-[#234D3A] dark:text-emerald-300">
                  +{netCashFlow.toLocaleString()} RWF
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
