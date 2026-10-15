"use client"

import * as React from "react"
import { AlertTriangle, Lightbulb } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WasteAlertItem } from "./types"
import { CHEF_RECOMMENDATION_NOTE } from "./dashboard-data"

export interface KitchenWasteAlertsProps {
  alerts: WasteAlertItem[]
  onActionClick: (alert: WasteAlertItem) => void
  completedActions: Record<string, boolean>
}

export function KitchenWasteAlerts({
  alerts,
  onActionClick,
  completedActions,
}: KitchenWasteAlertsProps) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between w-full min-w-0">
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE] truncate">
                Kitchen Waste Alerts
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Underperforming stock requiring manager intervention
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50 px-2.5 py-0.5 text-[11px] font-bold">
            Action Needed
          </span>
        </div>

        <div className="mt-4 space-y-3.5">
          {alerts.map((item) => {
            const isPromo = item.actionType === "promo"
            const isDone = completedActions[item.id]

            return (
              <div
                key={item.id}
                className={
                  isPromo
                    ? "rounded-xl border border-rose-200/60 bg-rose-50/40 dark:bg-rose-950/20 p-3.5"
                    : "rounded-xl border border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 p-3.5"
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-[#2C221E] dark:text-foreground">
                    {item.title}
                  </h4>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isPromo
                        ? "bg-[#C53030] text-white"
                        : "bg-[#7A6126] text-white"
                    }`}
                  >
                    {item.wasteBadge}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.meta}
                </p>

                <div className="mt-2.5 flex items-center justify-between gap-2 pt-1">
                  <span
                    className={`text-xs font-semibold ${
                      isPromo
                        ? "text-[#C53030] dark:text-rose-400"
                        : "text-[#8C7D73] dark:text-muted-foreground"
                    }`}
                  >
                    {item.callout}
                  </span>

                  <Button
                    size="sm"
                    variant={isPromo ? "default" : "outline"}
                    disabled={isDone}
                    onClick={() => onActionClick(item)}
                    className={
                      isPromo
                        ? "h-7.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 shadow-2xs"
                        : "h-7.5 rounded-lg text-xs font-semibold px-3 border-border"
                    }
                  >
                    {isDone ? "Applied" : item.actionLabel}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chef recommendation footnote */}
      <div className="mt-4 rounded-xl bg-muted/50 p-3 flex items-start gap-2 text-xs text-muted-foreground leading-relaxed border border-border/50">
        <Lightbulb className="size-4 shrink-0 text-amber-500 mt-0.5" />
        <span>{CHEF_RECOMMENDATION_NOTE}</span>
      </div>
    </Card>
  )
}
