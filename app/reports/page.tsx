"use client"

import * as React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  Printer,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { DateRangePickerModal } from "@/components/date-range-picker"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = React.useState<"week" | "month" | "quarter" | "custom">("week")
  const [customLabel, setCustomLabel] = React.useState("Custom")
  const [showPickerModal, setShowPickerModal] = React.useState(false)

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Financial &amp; Operational Reports
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Profit &amp; Loss statements, margin trends, and category performance audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-xs">
            <button
              onClick={() => setTimeRange("week")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                timeRange === "week"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                timeRange === "month"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                timeRange === "quarter"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Q3 2026
            </button>
            <button
              onClick={() => setShowPickerModal(true)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer",
                timeRange === "custom"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Calendar className="size-3.5" />
              <span>{timeRange === "custom" ? customLabel : "Custom"}</span>
            </button>
          </div>

          <DateRangePickerModal
            isOpen={showPickerModal}
            onClose={() => setShowPickerModal(false)}
            onApply={(_s, _e, label) => {
              setTimeRange("custom")
              setCustomLabel(label)
            }}
          />

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => window.print()}
          >
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                [
                  "Date,Orders,Gross Revenue (RWF),COGS (RWF),Gross Profit (RWF),Margin",
                  "Sun Oct 4,242,1450000,720000,730000,50.3%",
                  "Sat Oct 3,288,1820000,890000,930000,51.1%",
                  "Fri Oct 2,274,1750000,860000,890000,50.9%",
                  "Thu Oct 1,195,1210000,595000,615000,50.8%",
                  "Wed Sep 30,182,1140000,560000,580000,50.9%",
                  "Tue Sep 29,176,1080000,545000,535000,49.5%",
                  "Mon Sep 28,201,1390000,650000,740000,53.2%",
                ].join("\n")
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", `bara_reports_${timeRange}.csv`)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            className="h-8 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-medium"
          >
            <Download className="size-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              9,840,000
            </span>
            <span className="text-xs font-semibold text-muted-foreground">RWF</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="size-3.5" />
            <span>+14.2% vs previous period</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Cost of Goods (COGS)</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              4,820,000
            </span>
            <span className="text-xs font-semibold text-muted-foreground">RWF</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Food cost ratio:</span>
            <span className="font-bold text-foreground">49.0% (Target: &le; 50%)</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Gross Operating Profit</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              5,020,000
            </span>
            <span className="text-xs font-semibold text-muted-foreground">RWF</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#234D3A] dark:text-emerald-400 font-bold">
            <TrendingUp className="size-3.5" />
            <span>51.0% Gross Margin</span>
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs">
          <span className="text-xs font-medium text-muted-foreground">Wastage &amp; Shrinkage</span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              118,500
            </span>
            <span className="text-xs font-semibold text-muted-foreground">RWF</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <ArrowDownRight className="size-3.5" />
            <span>1.2% (Safely below 2.5% ceiling)</span>
          </div>
        </Card>
      </div>

      {/* Category Breakdown & Daily Audited Table */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Category Contribution */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-border/60 pb-3">
              <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Category Margin Breakdown
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Revenue vs Food/Beverage Cost per department
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {[
                {
                  title: "Main Kitchen & Grills",
                  sales: "6,450,000 RWF",
                  cogs: "3,110,000 RWF (48.2%)",
                  margin: "51.8%",
                  color: "bg-[#C85A24]",
                },
                {
                  title: "Bar & Cocktails",
                  sales: "2,420,000 RWF",
                  cogs: "690,000 RWF (28.5%)",
                  margin: "71.5%",
                  color: "bg-[#234D3A]",
                },
                {
                  title: "Desserts & Specials",
                  sales: "970,000 RWF",
                  cogs: "368,000 RWF (37.9%)",
                  margin: "62.1%",
                  color: "bg-amber-500",
                },
              ].map((cat) => (
                <div key={cat.title} className="rounded-xl border border-border/60 p-3.5 bg-background/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{cat.title}</span>
                    <Badge variant="success" className="font-semibold text-xs py-0">
                      {cat.margin} Margin
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Revenue: {cat.sales}</span>
                    <span>COGS: {cat.cogs}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", cat.color)} style={{ width: cat.margin }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
            <span>Highest Margin: <strong>Bar &amp; Cocktails (71.5%)</strong></span>
            <span>Target: &gt; 65%</span>
          </div>
        </Card>

        {/* 7-Day Performance Table */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="border-b border-border/60 pb-3 flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Daily P&amp;L Log
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Day-by-day revenue, cost and net operating profit
                </p>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                Week 40
              </Badge>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="pb-2.5 pl-1">Date</th>
                    <th className="pb-2.5">Orders</th>
                    <th className="pb-2.5">Revenue</th>
                    <th className="pb-2.5">COGS</th>
                    <th className="pb-2.5 text-right pr-1">Gross Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    { date: "Sun, Oct 4", orders: 242, rev: "1,450,000", cogs: "720,000", profit: "730,000", margin: "50.3%" },
                    { date: "Sat, Oct 3", orders: 288, rev: "1,820,000", cogs: "890,000", profit: "930,000", margin: "51.1%" },
                    { date: "Fri, Oct 2", orders: 274, rev: "1,750,000", cogs: "860,000", profit: "890,000", margin: "50.9%" },
                    { date: "Thu, Oct 1", orders: 195, rev: "1,210,000", cogs: "595,000", profit: "615,000", margin: "50.8%" },
                    { date: "Wed, Sep 30", orders: 182, rev: "1,140,000", cogs: "560,000", profit: "580,000", margin: "50.9%" },
                    { date: "Tue, Sep 29", orders: 176, rev: "1,080,000", cogs: "545,000", profit: "535,000", margin: "49.5%" },
                    { date: "Mon, Sep 28", orders: 201, rev: "1,390,000", cogs: "650,000", profit: "740,000", margin: "53.2%" },
                  ].map((row) => (
                    <tr key={row.date} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 pl-1 font-semibold text-foreground">{row.date}</td>
                      <td className="py-2.5 text-muted-foreground">{row.orders}</td>
                      <td className="py-2.5 font-bold text-foreground">{row.rev} RWF</td>
                      <td className="py-2.5 text-muted-foreground">{row.cogs} RWF</td>
                      <td className="py-2.5 text-right pr-1 font-bold text-emerald-600 dark:text-emerald-400">
                        +{row.profit} RWF ({row.margin})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Weekly Average Margin: <strong className="text-foreground">50.9%</strong></span>
            <span className="font-bold text-[#234D3A] dark:text-emerald-300">Audited by Bara Engine</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
