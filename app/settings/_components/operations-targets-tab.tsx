"use client"

import * as React from "react"
import { AlertCircle, Bell, Percent, Save, Sparkles } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRestaurant } from "@/components/restaurant-provider"

export interface OperationsTargetsTabProps {
  onSavedNotice: (msg: string) => void
}

export function OperationsTargetsTab({ onSavedNotice }: OperationsTargetsTabProps) {
  const { restaurant, updateRestaurant } = useRestaurant()

  const [kitchenTarget, setKitchenTarget] = React.useState(String(restaurant.kitchenTarget))
  const [barTarget, setBarTarget] = React.useState(String(restaurant.barTarget))
  const [aiAlerts, setAiAlerts] = React.useState(restaurant.aiAlerts)
  const [varianceThreshold, setVarianceThreshold] = React.useState("15")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateRestaurant({
      kitchenTarget: Number(kitchenTarget) || restaurant.kitchenTarget,
      barTarget: Number(barTarget) || restaurant.barTarget,
      aiAlerts,
    })
    onSavedNotice("Operational targets and margin benchmarks saved successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Margin & Cost Targets */}
        <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Percent className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                COGS Margin Benchmarks
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Baseline percentage thresholds used for dish cost alerts and reports
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Kitchen Food Cost Target (% of sales)
                </label>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Recommended: 28% – 34%
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="10"
                  max="60"
                  value={kitchenTarget}
                  onChange={(e) => setKitchenTarget(e.target.value)}
                  className="h-9.5 w-28 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  % of total food revenue
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Bar &amp; Beverage Cost Target (% of sales)
                </label>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Recommended: 18% – 24%
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="10"
                  max="50"
                  value={barTarget}
                  onChange={(e) => setBarTarget(e.target.value)}
                  className="h-9.5 w-28 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  % of total bar revenue
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 text-xs text-muted-foreground leading-relaxed">
              When dish recipe costs exceed these thresholds, Bara flags variance audits and suggests pricing or portion adjustments in AI Insights.
            </div>
          </div>
        </Card>

        {/* AI Monitoring & Thresholds */}
        <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#C85A24]/10 text-[#C85A24]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Automated Variance Auditing
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Statistical sensitivity triggers for inventory leakage and void anomalies
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-3.5 bg-background">
              <div>
                <p className="text-xs font-bold text-foreground">
                  Enable AI Portion &amp; Oil Variance Alerts
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Continuously compares ingredient usage against billed POS dish volumes to catch kitchen waste.
                </p>
              </div>
              <input
                type="checkbox"
                checked={aiAlerts}
                onChange={(e) => setAiAlerts(e.target.checked)}
                className="mt-1 size-4 rounded accent-[#C85A24] cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Anomaly Flag Sensitivity Threshold
              </label>
              <select
                value={varianceThreshold}
                onChange={(e) => setVarianceThreshold(e.target.value)}
                className="mt-1.5 h-9.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="10">High Sensitivity (Trigger if &gt;10% variance vs 30-day baseline)</option>
                <option value="15">Balanced (Trigger if &gt;15% variance vs 30-day baseline - Recommended)</option>
                <option value="25">Conservative (Trigger if &gt;25% variance vs 30-day baseline)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200 border border-amber-500/20">
              <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Current anomaly triggers: Cooking oil (+31%), Evening Voids (Till #2).</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-9 gap-1.5 rounded-xl bg-[#C85A24] hover:bg-[#B34D1C] text-white text-xs font-bold px-5 shadow-xs"
        >
          <Save className="size-3.5" />
          <span>Save Margin Targets</span>
        </Button>
      </div>
    </form>
  )
}
