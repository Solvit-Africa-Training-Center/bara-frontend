"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Lightbulb,
  RefreshCw,
  Scale,
  Sparkles,
  Users,
  Wine,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AIInsightsPage() {
  const [actionDone1, setActionDone1] = React.useState(false)
  const [actionDone2, setActionDone2] = React.useState(false)
  const [dismissedSummary, setDismissedSummary] = React.useState(false)
  const [showRoster, setShowRoster] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState("")

  const handleApplyAll = () => {
    setActionDone1(true)
    setActionDone2(true)
    setStatusMessage("Applied all AI recommendations: Portion audit scheduled & Happy Hour special activated.")
    setTimeout(() => setStatusMessage(""), 4000)
  }

  const handleExport = () => {
    const brief = `BARA AI OPERATIONAL BRIEF
Date: Today, Oct 5, 2026
Restaurant: Bara Bistro & Grill

1. SUMMARY
Revenue up +12.5%. Beef tenderloin food cost surged to 42.1% (target: 32.0%). Bar spend down 14.0%.

2. ACTION ITEMS
- Portion Control Audit: Beef Tenderloin (Food cost 42.1%, potential leakage: ~180,000 RWF/wk)
- Bar Promo: 2-for-1 Hibiscus Citrus Spritz 5:00-7:00 PM (Projected upside: +95,000 RWF)

3. WATCHLIST
- Beef Tenderloin: 14,500 RWF/kg (+18.2% vs avg) [HIGH RISK]
- Fresh Salmon: 18,200 RWF/kg (+6.5% vs avg) [MEDIUM RISK]
- Cooking Cream: 4,200 RWF/L (+12.0% vs avg) [MEDIUM RISK]`

    const blob = new Blob([brief], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bara_ai_operational_brief.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setStatusMessage("Exported Bara AI Operational Brief!")
    setTimeout(() => setStatusMessage(""), 3500)
  }

  const handleGeneratePDF = () => {
    setStatusMessage("Generating Week 40 Comprehensive Operations Audit PDF...")
    setTimeout(() => {
      setStatusMessage("Week 40 Operations Audit PDF compiled and downloaded!")
      setTimeout(() => setStatusMessage(""), 3500)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar matching Figma Frame 6 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
              AI Insights
            </h1>
            <span className="rounded-full bg-[#234D3A] px-2.5 py-0.5 text-xs font-bold text-white">
              Bara Intelligence
            </span>
          </div>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Daily operational intelligence and automated cost variance recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-xl text-xs font-medium"
            onClick={() => {
              setStatusMessage("Re-analyzing pos shift tickets and supplier invoices...")
              setTimeout(() => {
                setStatusMessage("Analysis updated with latest live service logs.")
                setTimeout(() => setStatusMessage(""), 3500)
              }, 600)
            }}
          >
            <RefreshCw className="size-3.5" />
            <span>Re-analyze</span>
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            className="h-8 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-medium"
          >
            <Download className="size-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Emerald AI Summary Banner */}
      {!dismissedSummary && (
        <div className="relative overflow-hidden rounded-2xl border border-[#234D3A]/20 bg-gradient-to-r from-[#234D3A] via-[#1E4332] to-[#163628] p-5 text-white shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                <Sparkles className="size-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    AI Analysis • Today&apos;s Operations
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-white/95 max-w-3xl">
                  While revenue is up for the weekend (+12.5%), beef prices have surged
                  18% and bar spend is down 14%. Take immediate portion control steps
                  on grilled tenderloin before dinner rush and consider a happy hour
                  promotion to drive evening beverage sales.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissedSummary(true)}
                className="h-8 rounded-xl text-xs text-white/80 hover:bg-white/10 hover:text-white"
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                onClick={handleApplyAll}
                className="h-8 rounded-xl bg-white text-[#234D3A] hover:bg-white/90 text-xs font-bold px-4 shadow-sm"
              >
                Apply Recommendations
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Middle Two-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Action Items for Today */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Action Items for Today
                </h2>
                <p className="text-xs text-muted-foreground">
                  High-priority steps to prevent margin leakage
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                2 Actions
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {/* Action 1: Portion Control */}
              <div
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  actionDone1
                    ? "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-75"
                    : "border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg text-white",
                        actionDone1 ? "bg-emerald-600" : "bg-rose-600"
                      )}
                    >
                      {actionDone1 ? (
                        <Check className="size-4" />
                      ) : (
                        <Scale className="size-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          Review beef portion sizes with kitchen staff
                        </p>
                        <span className="rounded-md bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                          Critical
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Beef Tenderloin food cost is currently at <strong>42.1%</strong>,
                        exceeding your target of 32.0%. Re-calibrate portion scales before
                        the 6:00 PM dinner rush.
                      </p>
                      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-rose-600 dark:text-rose-400">
                          Potential Leakage: ~180,000 RWF / wk
                        </span>
                        <span>•</span>
                        <span>Assigned to: Head Chef</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={actionDone1 ? "outline" : "default"}
                    onClick={() => {
                      setActionDone1(!actionDone1)
                      setStatusMessage(
                        !actionDone1
                          ? "Marked beef portion size audit as completed!"
                          : "Re-opened portion audit action item."
                      )
                      setTimeout(() => setStatusMessage(""), 3500)
                    }}
                    className={cn(
                      "h-8 rounded-lg text-xs font-bold shrink-0",
                      actionDone1
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "bg-rose-600 hover:bg-rose-700 text-white"
                    )}
                  >
                    {actionDone1 ? "Completed" : "Mark Done"}
                  </Button>
                </div>
              </div>

              {/* Action 2: Bar Promo */}
              <div
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  actionDone2
                    ? "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-75"
                    : "border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg text-white",
                        actionDone2 ? "bg-emerald-600" : "bg-amber-600"
                      )}
                    >
                      {actionDone2 ? (
                        <Check className="size-4" />
                      ) : (
                        <Wine className="size-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          Launch Happy Hour cocktail special
                        </p>
                        <span className="rounded-md bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                          Revenue Opportunity
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Bar revenue dipped <strong>14.0%</strong> compared to last Tuesday.
                        Offer 2-for-1 on signature Hibiscus Citrus Spritz from 5:00 PM to
                        7:00 PM to drive early covers.
                      </p>
                      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Projected Upside: +95,000 RWF
                        </span>
                        <span>•</span>
                        <span>Assigned to: Lead Bartender</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={actionDone2 ? "outline" : "default"}
                    onClick={() => {
                      setActionDone2(!actionDone2)
                      setStatusMessage(
                        !actionDone2
                          ? "Happy Hour special scheduled for 5:00 PM - 7:00 PM!"
                          : "Cancelled Happy Hour schedule."
                      )
                      setTimeout(() => setStatusMessage(""), 3500)
                    }}
                    className={cn(
                      "h-8 rounded-lg text-xs font-bold shrink-0",
                      actionDone2
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    )}
                  >
                    {actionDone2 ? "Completed" : "Schedule"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Audit status: <strong>Live tracking enabled</strong></span>
            <span className="text-emerald-600 font-semibold">2 AI checks active</span>
          </div>
        </div>

        {/* Right Column: Top Risk Items to Watch */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Top Risk Items to Watch
                </h2>
                <p className="text-xs text-muted-foreground">
                  Ingredients with notable cost fluctuation vs 30-day baseline
                </p>
              </div>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                Updated 1 hr ago
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="pb-2.5 pl-1">Ingredient / Item</th>
                    <th className="pb-2.5">Current Cost</th>
                    <th className="pb-2.5">7-Day Variance</th>
                    <th className="pb-2.5 text-right pr-1">Risk Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    {
                      name: "Beef Tenderloin",
                      category: "Main Kitchen",
                      cost: "14,500 RWF / kg",
                      change: "+18.2%",
                      up: true,
                      risk: "High Risk",
                      riskClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                    },
                    {
                      name: "Fresh Salmon Fillet",
                      category: "Specials",
                      cost: "18,200 RWF / kg",
                      change: "+6.5%",
                      up: true,
                      risk: "Medium Risk",
                      riskClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    },
                    {
                      name: "Cooking Cream 1L",
                      category: "Dairy & Kitchen",
                      cost: "4,200 RWF / L",
                      change: "+12.0%",
                      up: true,
                      risk: "Medium Risk",
                      riskClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    },
                    {
                      name: "Irish Potatoes",
                      category: "Produce",
                      cost: "800 RWF / kg",
                      change: "-2.5%",
                      up: false,
                      risk: "Stable",
                      riskClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    },
                    {
                      name: "Hass Avocados",
                      category: "Produce",
                      cost: "1,800 RWF / kg",
                      change: "-4.2%",
                      up: false,
                      risk: "Favorable",
                      riskClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    },
                  ].map((item) => (
                    <tr key={item.name} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pl-1">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.category}</p>
                      </td>
                      <td className="py-3 font-medium text-foreground">{item.cost}</td>
                      <td className="py-3">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 font-bold",
                            item.up
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {item.up ? (
                            <ArrowUpRight className="size-3" />
                          ) : (
                            <ArrowDownRight className="size-3" />
                          )}
                          <span>{item.change}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right pr-1">
                        <span
                          className={cn(
                            "rounded-lg px-2 py-0.5 text-[10px] font-bold",
                            item.riskClass
                          )}
                        >
                          {item.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            <Button
              variant="outline"
              render={<Link href="/settings" />}
              size="sm"
              className="w-full justify-center text-xs h-8 rounded-xl font-medium"
            >
              Configure Threshold Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Roster Modal / Expandable View */}
      {showRoster && (
        <div className="rounded-2xl border border-[#234D3A]/30 bg-card p-5 shadow-md">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-[#234D3A]" />
              <h3 className="text-sm font-bold text-foreground">
                Friday Dinner Service Shift Roster (18:00 - 23:00)
              </h3>
            </div>
            <button
              onClick={() => setShowRoster(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-border p-3 bg-background">
              <p className="font-bold text-foreground">Line Cook (Grills)</p>
              <p className="text-muted-foreground mt-0.5">Assigned: Fabrice M.</p>
              <span className="inline-block mt-2 rounded-md bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold">
                Confirmed
              </span>
            </div>
            <div className="rounded-xl border border-border p-3 bg-background">
              <p className="font-bold text-foreground">Service Runner 1</p>
              <p className="text-muted-foreground mt-0.5">Assigned: Diane K.</p>
              <span className="inline-block mt-2 rounded-md bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold">
                Confirmed
              </span>
            </div>
            <div className="rounded-xl border border-border p-3 bg-background">
              <p className="font-bold text-foreground">Service Runner 2</p>
              <p className="text-muted-foreground mt-0.5">Assigned: Eric T.</p>
              <span className="inline-block mt-2 rounded-md bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold">
                Confirmed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Three Cards matching Figma Frame 6 */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Supplier Renegotiation */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 p-5 shadow-xs dark:bg-emerald-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Lightbulb className="size-4" />
              </span>
              <h3 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Cost Reduction Tip
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Switching cooking oil supplier from Kigali Wholesalers to Gisozi Agro
              could save approximately <strong>140,000 RWF weekly</strong> based on
              current 35L volume.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20">
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/inventory" />}
              className="w-full text-xs font-semibold h-8 rounded-xl border-emerald-600/30 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-950"
            >
              Compare Suppliers
            </Button>
          </div>
        </div>

        {/* Card 2: Staffing Recommendation */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#234D3A] text-white">
                <Users className="size-4" />
              </span>
              <h3 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Staffing Recommendation
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Friday dinner service is projected at <strong>120+ covers</strong>.
              Schedule 1 additional line cook and 2 service runners to maintain
              18-minute ticket times.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/60">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRoster(!showRoster)}
              className="w-full text-xs font-semibold h-8 rounded-xl"
            >
              {showRoster ? "Hide Shift Roster" : "Review Shift Roster"}
            </Button>
          </div>
        </div>

        {/* Card 3: Weekly Summary Report */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-50/40 p-5 shadow-xs dark:bg-amber-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-600 text-white">
                <FileText className="size-4" />
              </span>
              <h3 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Weekly Summary Report
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Full breakdown for week 40 is ready for review. COGS averaged
              <strong> 49.6%</strong> and net operating profit reached
              <strong> 5,120,000 RWF</strong>.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20">
            <Button
              size="sm"
              onClick={handleGeneratePDF}
              className="w-full text-xs font-bold h-8 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] shadow-xs"
            >
              Generate PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
