"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartDataPoint } from "./types"

const chartConfig = {
  sales: {
    label: "Completed Sales",
    color: "#234D3A",
  },
} satisfies ChartConfig

interface SalesTrendCardProps {
  data: ChartDataPoint[]
  durationBadge?: string
  subtitle?: string
  ticks?: number[]
  tickFormatter?: (val: number) => string
  domain?: [number, number]
  yTicks?: number[]
}

export function SalesTrendCard({
  data,
  durationBadge = "30 days",
  subtitle = "Daily completed sales · September 2026 · RWF",
  ticks = [1, 7, 14, 21, 30],
  tickFormatter = (val: number) => {
    if (val === 1) return "1 Sep"
    if (val === 7) return "7 Sep"
    if (val === 14) return "14 Sep"
    if (val === 21) return "21 Sep"
    if (val === 30) return "30 Sep"
    return ""
  },
  domain = [0, 450000],
  yTicks = [0, 150000, 300000, 450000],
}: SalesTrendCardProps) {
  return (
    <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              Sales trend
            </h2>
            <p className="text-xs text-[#8C7D73] dark:text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
          <span className="rounded-full bg-muted/70 border border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-[#8C7D73] dark:text-muted-foreground">
            {durationBadge}
          </span>
        </div>

        {/* shadcn Linear Area Chart */}
        <div className="mt-4 w-full">
          <ChartContainer config={chartConfig} className="aspect-auto h-[230px] w-full">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary, #234D3A)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--primary, #234D3A)" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="0"
                stroke="currentColor"
                className="text-border/40"
              />

              <XAxis
                dataKey="index"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                ticks={ticks}
                tickFormatter={tickFormatter}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-[#8C7D73] dark:text-muted-foreground"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                ticks={yTicks}
                domain={domain}
                tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}k`)}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-[#8C7D73] dark:text-muted-foreground"
              />

              <ChartTooltip
                cursor={{ strokeDasharray: "3 3", opacity: 0.5 }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(_label, payload) => {
                      if (payload && payload[0]?.payload) {
                        return payload[0].payload.label
                      }
                      return _label
                    }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString()} RWF`,
                      "Completed sales",
                    ]}
                  />
                }
              />

              <Area
                dataKey="sales"
                type="linear"
                fill="url(#salesTrendGradient)"
                fillOpacity={1}
                stroke="var(--primary, #234D3A)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--primary, #234D3A)" }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Footer legend */}
      <div className="mt-3 pt-2 flex items-center gap-2 text-xs text-[#8C7D73] dark:text-muted-foreground">
        <span className="h-0.5 w-3.5 rounded-full bg-primary" />
        <span>Sales exclude voided and refunded orders</span>
      </div>
    </div>
  )
}
