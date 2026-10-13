"use client"

import * as React from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TopPerformerItem } from "./types"

export interface TopMenuPerformersProps {
  performers: TopPerformerItem[]
}

export function TopMenuPerformers({ performers }: TopMenuPerformersProps) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs w-full min-w-0">
      <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Star className="size-4" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE] truncate">
              Top Menu Performers
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Top contributors
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#245938] dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
          BEST RETURN
        </span>
      </div>

      <div className="mt-3 divide-y divide-border/50">
        {performers.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 hover:bg-muted/30 px-1 rounded-xl transition-colors gap-2 min-w-0"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Image
                src={item.image}
                alt={item.name}
                width={48}
                height={48}
                unoptimized
                className="size-11 sm:size-12 rounded-xl object-cover border border-border/80 shadow-2xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {item.name}
                  </h3>
                  <span
                    className={`rounded-md border px-1.5 py-0.2 text-[10px] font-bold shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {item.orders} {item.ordersUnit || "orders"} • Avg prep: {item.avgPrep}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-sm font-extrabold text-[#C85A24] whitespace-nowrap">
                {item.revenueFormatted}
              </span>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 whitespace-nowrap">
                ↑ {item.profitPercent}% Profit
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
