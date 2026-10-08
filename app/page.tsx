"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Flame,
  Plus,
  Sparkles,
  Store,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { DateRangePickerModal } from "@/components/date-range-picker"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"

export default function DashboardPage() {
  const { restaurant } = useRestaurant()
  const [selectedPeriod, setSelectedPeriod] = React.useState<"today" | "yesterday" | "week" | "custom">("today")
  const [customLabel, setCustomLabel] = React.useState("Custom")
  const [showPickerModal, setShowPickerModal] = React.useState(false)

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">
      {/* 1. Operations Bar Card matching Figma Frame 5 */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                {restaurant.name} Operations
              </h1>
              <Badge variant="success" className="gap-1 rounded-full text-[10px] font-bold py-0.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live POS Connected
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Know your daily numbers. Real-time overview for {restaurant.name} ({restaurant.activeBranch}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-2xs">
            <button
              onClick={() => setSelectedPeriod("today")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                selectedPeriod === "today"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedPeriod("yesterday")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                selectedPeriod === "yesterday"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yesterday
            </button>
            <button
              onClick={() => setSelectedPeriod("week")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                selectedPeriod === "week"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              This Week
            </button>
            <button
              onClick={() => setShowPickerModal(true)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer",
                selectedPeriod === "custom"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Calendar className="size-3.5" />
              <span>{selectedPeriod === "custom" ? customLabel : "Custom"}</span>
            </button>
          </div>

          <Button
            render={<Link href="/menu" />}
            size="sm"
            className="h-8.5 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-bold px-3.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>New Order</span>
          </Button>
        </div>
      </div>

      <DateRangePickerModal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onApply={(_start, _end, label) => {
          setSelectedPeriod("custom")
          setCustomLabel(label)
        }}
      />

      {/* 2. Crimson AI Anomaly Alert Banner matching Figma Top Placement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8C1D24] via-[#BD3A42] to-[#7A151C] p-3.5 text-white shadow-sm">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Sparkles className="size-4.5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
                  AI Anomaly Alert
                </span>
                <span className="size-1.5 rounded-full bg-amber-300 animate-ping" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 mt-0.5">
                Unusual spike in vegetable oil consumption detected today (+45% vs daily baseline).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Button
              render={<Link href="/ai-insights" />}
              size="sm"
              className="h-7.5 rounded-xl bg-white text-[#8C1D24] hover:bg-white/90 text-xs font-bold px-3.5 shadow-xs"
            >
              Investigate Now
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Three Main KPI Metrics matching Figma Frame 5 */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* KPI 1: Revenue */}
        <Card className="relative overflow-hidden rounded-2xl border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#E07A3E] to-[#C85A24]" />
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>
              {selectedPeriod === "today"
                ? "Today's Revenue"
                : selectedPeriod === "yesterday"
                ? "Yesterday's Revenue"
                : selectedPeriod === "week"
                ? "This Week's Revenue"
                : `${customLabel} Revenue`}
            </span>
            <Badge variant="success" className="gap-0.5 font-bold text-[11px] py-0.5">
              <ArrowUpRight className="size-3" />
              +12.5%
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              1,450,000
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              RWF
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Target: 1,700,000 RWF</span>
            <span className="font-semibold text-foreground">85.3% met</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#C85A24]"
              style={{ width: "85.3%" }}
            />
          </div>
        </Card>

        {/* KPI 2: Cost of Goods Sold (COGS) */}
        <Card className="relative overflow-hidden rounded-2xl border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Cost of Goods (COGS)</span>
            <Badge variant="success" className="gap-0.5 font-bold text-[11px] py-0.5">
              <ArrowDownRight className="size-3" />
              -3.8%
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              720,000
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              RWF
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Food cost target: &le; 50%</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              49.6% (Optimal)
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: "49.6%" }}
            />
          </div>
        </Card>

        {/* KPI 3: Gross Operating Profit */}
        <Card className="relative overflow-hidden rounded-2xl border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 to-[#234D3A]" />
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Gross Operating Profit</span>
            <Badge variant="success" className="gap-0.5 font-bold text-[11px] py-0.5">
              <ArrowUpRight className="size-3" />
              +8.4%
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              730,000
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              RWF
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Net Operating Margin</span>
            <span className="font-semibold text-[#234D3A] dark:text-emerald-400">
              50.4%
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#234D3A]"
              style={{ width: "50.4%" }}
            />
          </div>
        </Card>
      </div>

      {/* 4. Middle Section: Top Dishes Today (Left) + Donut Category Breakdown (Right) */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Top Dishes Today (3 cols) */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-orange-500" />
              <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Top Dishes Today
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Menu Performance Audit</span>
          </div>

          <div className="mt-3 divide-y divide-border/60">
            {[
              {
                rank: 1,
                name: "Grilled Tenderloin AAA",
                category: "Main Kitchen",
                price: "10,000 RWF / dish",
                sold: "42 sold",
                revenue: "420,000 RWF",
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80",
              },
              {
                rank: 2,
                name: "Mushroom Risotto with Truffle",
                category: "Main Kitchen",
                price: "8,000 RWF / dish",
                sold: "36 sold",
                revenue: "288,000 RWF",
                image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=120&auto=format&fit=crop&q=80",
              },
              {
                rank: 3,
                name: "Hibiscus Citrus Spritz",
                category: "Bar Signature",
                price: "3,000 RWF / glass",
                sold: "58 sold",
                revenue: "174,000 RWF",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=120&auto=format&fit=crop&q=80",
              },
              {
                rank: 4,
                name: "Garlic Butter Prawns",
                category: "Specials",
                price: "8,000 RWF / dish",
                sold: "28 sold",
                revenue: "224,000 RWF",
                image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=120&auto=format&fit=crop&q=80",
              },
            ].map((dish) => (
              <div key={dish.name} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {dish.rank}
                  </span>
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="size-10 rounded-full object-cover border border-border shadow-2xs"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {dish.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {dish.category} • {dish.price}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-foreground">
                    {dish.sold}
                  </span>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {dish.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Breakdown with Donut Chart matching Figma (2 cols) */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Category Breakdown
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Revenue split across departments
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold">
                242 Sold
              </Badge>
            </div>

            {/* Donut Chart Visualization */}
            <div className="my-4 flex items-center justify-center">
              <div className="relative size-40">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                  {/* Segment 1: Main Kitchen (67.6%) -> stroke-dasharray = 67.6 * 2.512 = 170, offset = 0 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#C85A24"
                    strokeWidth="16"
                    strokeDasharray="170 251.2"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Bar & Cocktails (24.1%) -> stroke-dasharray = 24.1 * 2.512 = 60.5, offset = -170 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#234D3A"
                    strokeWidth="16"
                    strokeDasharray="60.5 251.2"
                    strokeDashoffset="-170"
                  />
                  {/* Segment 3: Specials (8.3%) -> stroke-dasharray = 8.3 * 2.512 = 20.8, offset = -230.5 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EA982C"
                    strokeWidth="16"
                    strokeDasharray="20.8 251.2"
                    strokeDashoffset="-230.5"
                  />
                </svg>
                {/* Donut Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-muted-foreground">Total</span>
                  <span className="text-base font-extrabold text-foreground leading-none">1.45M</span>
                  <span className="text-[10px] text-muted-foreground">RWF</span>
                </div>
              </div>
            </div>

            {/* Legend & Breakdown stats */}
            <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#C85A24]" />
                  <span className="font-semibold text-foreground">Main Kitchen &amp; Grills</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">980,000 RWF</span>
                  <span className="text-muted-foreground ml-1.5">(67.6%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#234D3A]" />
                  <span className="font-semibold text-foreground">Bar &amp; Cocktails</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">350,000 RWF</span>
                  <span className="text-muted-foreground ml-1.5">(24.1%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#EA982C]" />
                  <span className="font-semibold text-foreground">Specials &amp; Desserts</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">120,000 RWF</span>
                  <span className="text-muted-foreground ml-1.5">(8.3%)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Lower Grid: Critical Stock Alerts (2 cols) + Hourly Sales Rhythm (3 cols) */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Critical Stock Alerts (2 cols) */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
                <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Critical Stock Alerts
                </CardTitle>
              </div>
              <Badge variant="destructive" className="rounded-full text-[10px] font-bold">
                2 items low
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              {/* Alert 1 */}
              <div className="rounded-xl border border-rose-500/30 bg-rose-50/50 p-3.5 dark:bg-rose-950/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                    Fresh Cooking Cream 1L
                  </p>
                  <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Critical
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>1.5 L remaining</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Min: 5.0 L
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-rose-200/60 dark:bg-rose-900/40 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-600" style={{ width: "30%" }} />
                </div>
              </div>

              {/* Alert 2 */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 p-3.5 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                    Prime Ribs Beef
                  </p>
                  <span className="rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Low Stock
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>4.2 kg remaining</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    Min: 10.0 kg
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-amber-200/60 dark:bg-amber-900/40 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-600" style={{ width: "42%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            <Button
              variant="outline"
              render={<Link href="/inventory" />}
              size="sm"
              className="w-full justify-center text-xs h-8 rounded-xl font-semibold border-rose-500/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Order Stock Restock
            </Button>
          </div>
        </Card>

        {/* Hourly Sales Rhythm (3 cols) */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Hourly Sales Rhythm
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Today&apos;s revenue distribution across service shifts
                </p>
              </div>
              <Badge variant="success" className="font-semibold text-xs py-1">
                Peak: 13:00 - 14:00
              </Badge>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { time: "12:00 - 13:00", amount: "240,000 RWF", width: "58%", count: "18 orders", peak: false },
                { time: "13:00 - 14:00", amount: "410,000 RWF", width: "100%", count: "34 orders", peak: true },
                { time: "14:00 - 15:00", amount: "190,000 RWF", width: "46%", count: "14 orders", peak: false },
                { time: "19:00 - 20:00 (Est)", amount: "380,000 RWF", width: "92%", count: "29 orders", peak: false },
                { time: "20:00 - 21:00 (Est)", amount: "230,000 RWF", width: "56%", count: "19 orders", peak: false },
              ].map((hour) => (
                <div key={hour.time} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-muted-foreground font-medium shrink-0">
                    {hour.time}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-muted/60 overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        hour.peak ? "bg-[#C85A24]" : "bg-[#234D3A]/70"
                      )}
                      style={{ width: hour.width }}
                    />
                  </div>
                  <span className="w-24 text-right font-bold text-foreground shrink-0">
                    {hour.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Average Ticket: <strong className="text-foreground">18,500 RWF</strong></span>
            <span>Table Turnover: <strong className="text-foreground">42 mins</strong></span>
          </div>
        </Card>
      </div>
    </div>
  )
}
