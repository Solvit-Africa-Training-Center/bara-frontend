"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowDownRight,
  ArrowUpRight,
  ChefHat,
  Flame,
  Plus,
  Sparkles,
  Store,
  Utensils,
  Wine,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<"today" | "yesterday" | "week">("today")

  return (
    <div className="flex flex-col gap-6">
      {/* Operations Bar Card matching Figma Frame 5 */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-foreground">
                Bara Bistro &amp; Grill Operations
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live POS Connected
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Know your daily numbers. Real-time overview for Bara Bistro &amp; Grill.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-2xs">
            <button
              onClick={() => setSelectedPeriod("today")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
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
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
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
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                selectedPeriod === "week"
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              This Week
            </button>
          </div>

          <Button
            render={<Link href="/transactions" />}
            size="sm"
            className="h-8 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-bold px-3.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Record Sale</span>
          </Button>
        </div>
      </div>

      {/* 3 Main KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* KPI 1: Today's Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#E07A3E] to-[#C85A24]" />
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Today&apos;s Revenue</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              +12.5%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
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
        </div>

        {/* KPI 2: Cost of Goods Sold (COGS) */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600" />
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Cost of Goods (COGS)</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="size-3" />
              -3.8%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
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
        </div>

        {/* KPI 3: Net Profit / Margin */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 to-[#234D3A]" />
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Gross Operating Profit</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3" />
              +8.4%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
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
        </div>
      </div>

      {/* Today's Category Breakdown - Full Width Card matching Frame 5 */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              Today&apos;s Category Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Revenue streams across kitchen and bar operations
            </p>
          </div>
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
            242 Total Items Sold
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Category 1 */}
          <div className="flex flex-col gap-2 rounded-xl bg-background/60 p-4 border border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                  <Utensils className="size-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Main Kitchen &amp; Grills
                  </p>
                  <p className="text-xs text-muted-foreground">
                    124 orders • 67.6% of sales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">980,000 RWF</p>
                <p className="text-xs text-emerald-600 font-medium">+14.2%</p>
              </div>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C85A24]"
                style={{ width: "67.6%" }}
              />
            </div>
          </div>

          {/* Category 2 */}
          <div className="flex flex-col gap-2 rounded-xl bg-background/60 p-4 border border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Wine className="size-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Bar &amp; Cocktails
                  </p>
                  <p className="text-xs text-muted-foreground">
                    86 orders • 24.1% of sales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">350,000 RWF</p>
                <p className="text-xs text-emerald-600 font-medium">+9.0%</p>
              </div>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-[#234D3A]"
                style={{ width: "24.1%" }}
              />
            </div>
          </div>

          {/* Category 3 */}
          <div className="flex flex-col gap-2 rounded-xl bg-background/60 p-4 border border-border/50 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <ChefHat className="size-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Specials &amp; Desserts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    32 orders • 8.3% of sales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">120,000 RWF</p>
                <p className="text-xs text-muted-foreground font-medium">
                  +2.1%
                </p>
              </div>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: "8.3%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Dishes Today - Full Width Card matching Frame 5 */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-orange-500" />
            <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              Top Dishes Today
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">Menu Performance Audit</span>
        </div>

        <div className="mt-4 divide-y divide-border/60">
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
            <div key={dish.name} className="flex items-center justify-between py-3">
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
                  className="size-10 rounded-xl object-cover border border-border"
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
      </div>

      {/* Lower Two-Column Grid matching Figma Frame 5 */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Critical Stock Alerts (2 cols) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-rose-500 animate-ping" />
                <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Critical Stock Alerts
                </h2>
              </div>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                2 items low
              </span>
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
                    Min threshold: 5.0 L
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
                    Min threshold: 10.0 kg
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
        </div>

        {/* Hourly Sales Rhythm (3 cols) */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Hourly Sales Rhythm
                </h2>
                <p className="text-xs text-muted-foreground">
                  Today&apos;s revenue distribution across service shifts
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Peak: 13:00 - 14:00
              </span>
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
        </div>
      </div>

      {/* Crimson AI Anomaly Alert Banner matching Figma Screen 5 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8C1D24] via-[#BD3A42] to-[#7A151C] p-4 text-white shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Sparkles className="size-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
                  AI Anomaly Alert
                </span>
                <span className="size-1.5 rounded-full bg-amber-300 animate-ping" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 mt-0.5">
                Unusual spike in vegetable oil consumption detected today (+45% vs daily baseline).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              render={<Link href="/ai-insights" />}
              size="sm"
              className="h-8 rounded-xl bg-white text-[#8C1D24] hover:bg-white/90 text-xs font-bold px-4 shadow-xs"
            >
              Investigate Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
