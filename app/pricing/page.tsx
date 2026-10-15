"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("monthly")

  return (
    <div className="flex flex-col items-center gap-8 py-4 max-w-5xl mx-auto">
      {/* Header matching Figma Frame 4 */}
      <div className="text-center space-y-2 max-w-xl">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          Simple, Transparent Plans
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
          Choose the tools your restaurant needs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Start with daily sales ledgers, or unlock automated AI margin auditing
          and multi-branch inventory tracking.
        </p>

        {/* Billing Switcher */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-xl bg-card border border-border p-1 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                billingCycle === "monthly"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                billingCycle === "annual"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Billed Annually <span className="text-[10px] text-amber-300 font-bold ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3 w-full items-stretch">
        {/* Tier 1: Starter */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Starter</h2>
              <p className="text-xs text-muted-foreground">
                For independent cafes and quick-service spots.
              </p>
            </div>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
                {billingCycle === "monthly" ? "19,000" : "15,200"}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">RWF / mo</span>
            </div>

            <div className="mt-6 space-y-3 text-xs text-muted-foreground border-t border-border/60 pt-5">
              {[
                "Daily Sales & Shift Expense Ledger",
                "Basic Category Breakdown",
                "Up to 2 Manager Logins",
                "Export Daily CSV",
                "Standard Email Support",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              render={<Link href="/" />}
              className="w-full h-10 rounded-xl text-xs font-bold"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Tier 2: Growth */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Growth</h2>
              <p className="text-xs text-muted-foreground">
                For busy dining restaurants and bars.
              </p>
            </div>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
                {billingCycle === "monthly" ? "39,000" : "31,200"}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">RWF / mo</span>
            </div>

            <div className="mt-6 space-y-3 text-xs text-muted-foreground border-t border-border/60 pt-5">
              {[
                "Everything in Starter",
                "Live COGS & Food Cost Ratio Tracking",
                "Inventory Par Levels & Reorder Alerts",
                "Hourly Sales Rhythm Analytics",
                "Up to 6 Staff Roles (Chefs, Managers)",
                "Full P&L and Margin PDF Reports",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              render={<Link href="/" />}
              className="w-full h-10 rounded-xl text-xs font-bold"
            >
              Start 14-Day Trial
            </Button>
          </div>
        </div>

        {/* Tier 3: Bara Pro + AI (Featured) */}
        <div className="relative rounded-3xl border-2 border-primary bg-card p-6 shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="size-3 text-amber-200" />
            Most Popular
          </div>

          <div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-primary">Bara Pro + AI</h2>
              <p className="text-xs text-muted-foreground">
                Complete operational intelligence suite.
              </p>
            </div>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
                {billingCycle === "monthly" ? "69,000" : "55,200"}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">RWF / mo</span>
            </div>

            <div className="mt-6 space-y-3 text-xs text-foreground font-medium border-t border-border/60 pt-5">
              {[
                "Everything in Growth",
                "Automated AI Margin Leakage Alerts",
                "Recipe Portion Costing & Volatility Watch",
                "Supplier Price Benchmarking Engine",
                "Unlimited Staff Logins & Branch Permissions",
                "Dedicated Operations Account Manager",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#234D3A] text-white shrink-0">
                    <Check className="size-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              render={<Link href="/" />}
              className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
