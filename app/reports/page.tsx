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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePickerModal } from "@/components/date-range-picker"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const performanceData = [
  { day: "Mon", fullDay: "Mon, Sep 28", revenue: 1390000, cogs: 650000, profit: 740000, margin: 53.2 },
  { day: "Tue", fullDay: "Tue, Sep 29", revenue: 1080000, cogs: 545000, profit: 535000, margin: 49.5 },
  { day: "Wed", fullDay: "Wed, Sep 30", revenue: 1140000, cogs: 560000, profit: 580000, margin: 50.9 },
  { day: "Thu", fullDay: "Thu, Oct 1", revenue: 1210000, cogs: 595000, profit: 615000, margin: 50.8 },
  { day: "Fri", fullDay: "Fri, Oct 2", revenue: 1750000, cogs: 860000, profit: 890000, margin: 50.9 },
  { day: "Sat", fullDay: "Sat, Oct 3", revenue: 1820000, cogs: 890000, profit: 930000, margin: 51.1 },
  { day: "Sun", fullDay: "Sun, Oct 4", revenue: 1450000, cogs: 720000, profit: 730000, margin: 50.3 },
]

const chartConfig = {
  revenue: {
    label: "Gross Revenue",
    color: "#C85A24",
  },
  profit: {
    label: "Gross Profit",
    color: "#234D3A",
  },
  cogs: {
    label: "Food & Bar COGS",
    color: "#E8A33D",
  },
} satisfies ChartConfig

export default function ReportsPage() {
  const { restaurant } = useRestaurant()
  const [timeRange, setTimeRange] = React.useState<"week" | "month" | "quarter" | "custom">("week")
  const [customLabel, setCustomLabel] = React.useState("Custom")
  const [showPickerModal, setShowPickerModal] = React.useState(false)
  const [activeSeries, setActiveSeries] = React.useState<"all" | "revenue" | "profit">("all")

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Financial &amp; Operational Reports
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Profit &amp; Loss statements, margin trends, and category performance audits for {restaurant.name} ({restaurant.activeBranch}).
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
                  `Date,Orders,Gross Revenue (${restaurant.currency}),COGS (${restaurant.currency}),Gross Profit (${restaurant.currency}),Margin`,
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
            <span className="text-xs font-semibold text-muted-foreground">{restaurant.currency}</span>
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
            <span className="text-xs font-semibold text-muted-foreground">{restaurant.currency}</span>
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
            <span className="text-xs font-semibold text-muted-foreground">{restaurant.currency}</span>
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
            <span className="text-xs font-semibold text-muted-foreground">{restaurant.currency}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <ArrowDownRight className="size-3.5" />
            <span>1.2% (Safely below 2.5% ceiling)</span>
          </div>
        </Card>
      </div>

      {/* shadcn: Area Chart - Linear */}
      <Card className="rounded-3xl border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-foreground">
                Revenue &amp; Gross Margin Trajectory
              </CardTitle>
              <Badge variant="accent" className="font-bold text-[10px]">
                Area Chart - Linear
              </Badge>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Daily revenue versus gross profit performance across the active 7-day operational cycle.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setActiveSeries("all")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                activeSeries === "all"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Streams
            </button>
            <button
              onClick={() => setActiveSeries("revenue")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                activeSeries === "revenue"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Revenue Only
            </button>
            <button
              onClick={() => setActiveSeries("profit")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                activeSeries === "profit"
                  ? "bg-[#234D3A] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Profit Only
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-4">
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart
              accessibilityLayer
              data={performanceData}
              margin={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C85A24" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C85A24" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#234D3A" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#234D3A" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />

              <ChartTooltip
                cursor={{ strokeDasharray: "3 3", opacity: 0.5 }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(_label, payload) => {
                      if (payload && payload[0]?.payload) {
                        return payload[0].payload.fullDay
                      }
                      return _label
                    }}
                  />
                }
              />

              {(activeSeries === "all" || activeSeries === "revenue") && (
                <Area
                  dataKey="revenue"
                  type="linear"
                  fill="url(#fillRevenue)"
                  fillOpacity={0.4}
                  stroke="#C85A24"
                  strokeWidth={2.5}
                  name="Gross Revenue"
                />
              )}

              {(activeSeries === "all" || activeSeries === "profit") && (
                <Area
                  dataKey="profit"
                  type="linear"
                  fill="url(#fillProfit)"
                  fillOpacity={0.4}
                  stroke="#234D3A"
                  strokeWidth={2.5}
                  name="Gross Profit"
                />
              )}

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="border-t border-border/50 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-muted/20">
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <TrendingUp className="size-4 shrink-0" />
            <span>Trending up by 14.2% in net restaurant profitability this week</span>
          </div>
          <span className="text-muted-foreground text-[11px]">
            Peak day: <strong>Saturday (1.82M {restaurant.currency})</strong> with 51.1% operating margin
          </span>
        </CardFooter>
      </Card>

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
                      <td className="py-2.5 font-bold text-foreground">{row.rev} {restaurant.currency}</td>
                      <td className="py-2.5 text-muted-foreground">{row.cogs} {restaurant.currency}</td>
                      <td className="py-2.5 text-right pr-1 font-bold text-emerald-600 dark:text-emerald-400">
                        +{row.profit} {restaurant.currency} ({row.margin})
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
