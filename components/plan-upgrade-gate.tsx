"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRestaurant } from "@/components/restaurant-provider"

export interface PlanUpgradeGateProps {
  requiredPlan: "pro" | "premium"
  featureName: string
  title: string
  description: string
  features: string[]
  priceRwf?: number
}

export function PlanUpgradeGate({
  requiredPlan,
  featureName,
  title,
  description,
  features,
  priceRwf = requiredPlan === "premium" ? 49000 : 32000,
}: PlanUpgradeGateProps) {
  const { restaurant, updateRestaurant } = useRestaurant()
  const [upgrading, setUpgrading] = React.useState(false)
  const [successNotice, setSuccessNotice] = React.useState(false)

  const currentPlan = restaurant.plan || "pro"
  const planLabel = requiredPlan === "premium" ? "Bara Premium" : "Bara Pro"

  const handleInstantUpgrade = () => {
    setUpgrading(true)
    setTimeout(() => {
      updateRestaurant({ plan: requiredPlan })
      setUpgrading(false)
      setSuccessNotice(true)
    }, 500)
  }

  if (successNotice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <ShieldCheck className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Upgraded to {planLabel}!
        </h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-md">
          {featureName} is now active for {restaurant.name}. Your workspace has been unlocked.
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto my-6 p-1">
      {/* Container Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-lg">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C1440E] via-[#EA982C] to-[#234D3A]" />

        {/* Top Badges & Lock Icon */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-2xl bg-[#C1440E]/10 border border-[#C1440E]/20 text-[#C1440E] flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="warning"
                  className="font-bold text-[11px] uppercase tracking-wider px-2 py-0.5"
                >
                  {requiredPlan} Plan Required
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Current plan: <strong className="text-foreground capitalize">{currentPlan}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-[#EA982C]" />
            <span>Operational Upgrade</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: Copy & Benefits */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-[#75665E] dark:text-[#BAACA1] mt-2 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Included in {planLabel}:
              </span>
              <ul className="space-y-2 text-xs">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-foreground font-medium">
                    <span className="size-4.5 rounded-full bg-[#234D3A]/10 dark:bg-emerald-950/50 text-[#234D3A] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="size-3 stroke-[2.5]" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Pricing & Call to Action Box */}
          <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/30 dark:bg-muted/10 p-5 sm:p-6 flex flex-col justify-between space-y-5">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Subscription Investment
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#2C221E] dark:text-[#FAF5EE]">
                  RWF {priceRwf.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">/ month</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Billed monthly or save 10% annually with mobile money (MTN / Airtel).
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border/50">
              <Button
                onClick={handleInstantUpgrade}
                disabled={upgrading}
                className="w-full h-10 rounded-xl bg-[#C1440E] hover:bg-[#A8380A] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {upgrading ? (
                  <span>Upgrading your workspace...</span>
                ) : (
                  <>
                    <span>Upgrade to {planLabel}</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/settings?tab=billing"
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Compare all plans in Settings &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
