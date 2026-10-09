"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Percent,
  Save,
  Sparkles,
  Store,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRestaurant } from "@/components/restaurant-provider"
import { cn } from "@/lib/utils"

interface ProfileFormProps {
  restaurant: ReturnType<typeof useRestaurant>["restaurant"]
  onSave: (patch: Partial<ReturnType<typeof useRestaurant>["restaurant"]>) => void
  onNotice: (msg: string) => void
}

function ProfileTabForm({ restaurant, onSave, onNotice }: ProfileFormProps) {
  const [restaurantName, setRestaurantName] = React.useState(restaurant.name)
  const [address, setAddress] = React.useState(restaurant.address)
  const [currency, setCurrency] = React.useState(restaurant.currency)
  const [kitchenTarget, setKitchenTarget] = React.useState(String(restaurant.kitchenTarget))
  const [barTarget, setBarTarget] = React.useState(String(restaurant.barTarget))
  const [aiAlerts, setAiAlerts] = React.useState(restaurant.aiAlerts)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: restaurantName.trim() || restaurant.name,
      address: address.trim(),
      currency,
      kitchenTarget: Number(kitchenTarget) || restaurant.kitchenTarget,
      barTarget: Number(barTarget) || restaurant.barTarget,
      aiAlerts,
    })
    onNotice("Settings saved and synced across system!")
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-8.5 gap-1.5 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] text-xs font-bold shadow-xs px-4"
        >
          <Save className="size-3.5" />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Branch & General Profile */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Store className="size-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Branch &amp; Profile Details
            </CardTitle>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Restaurant Branch Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Location &amp; Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="RWF">RWF (Rwandan Franc)</option>
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (Kenyan Shilling)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Time Zone</label>
                <input
                  type="text"
                  disabled
                  defaultValue="Africa/Kigali (GMT+2)"
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-muted/50 px-3 text-xs text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Food Cost & Operational Margins */}
        <Card className="rounded-2xl border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Percent className="size-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-foreground">
              Food Cost &amp; Margin Targets
            </CardTitle>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Kitchen Food Cost Target (% of sales)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  value={kitchenTarget}
                  onChange={(e) => setKitchenTarget(e.target.value)}
                  className="h-9 w-24 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <span className="text-xs text-muted-foreground">
                  Benchmark: 28% – 34%
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Bar &amp; Beverage Cost Target (% of sales)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  value={barTarget}
                  onChange={(e) => setBarTarget(e.target.value)}
                  className="h-9 w-24 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <span className="text-xs text-muted-foreground">
                  Benchmark: 18% – 24%
                </span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiAlerts}
                  onChange={(e) => setAiAlerts(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-xs font-medium text-foreground">
                  Enable AI variance alerts when cost exceeds target by &gt; 5%
                </span>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </form>
  )
}

const PLANS_CATALOG: {
  id: "basic" | "pro" | "premium"
  name: string
  tierLabel: string
  badge: string
  priceMonthly: number
  priceAnnual: number
  blurb: string
  features: string[]
  highlight?: boolean
}[] = [
  {
    id: "basic",
    name: "Bara Basic",
    tierLabel: "Bara Basic Essentials",
    badge: "Essentials",
    priceMonthly: 19000,
    priceAnnual: 17100,
    blurb: "Reliable essentials built for single-operator restaurants and small cafes.",
    features: [
      "Point of Sale (POS) & offline sync",
      "Inventory & stock tracking",
      "Menu management & recipe costing",
      "Single cashier / manager session",
      "Standard digital receipts",
    ],
  },
  {
    id: "pro",
    name: "Bara Pro",
    tierLabel: "Bara Pro Operations",
    badge: "Growing Teams",
    priceMonthly: 32000,
    priceAnnual: 28800,
    blurb: "Full operational visibility and multi-user delegation for growing restaurants.",
    features: [
      "Everything in Basic",
      "Financial & Sales reports with linear area trends",
      "Monthly consumables breakdown (Gas, Packaging, Supplies)",
      "Role-based staff accounts & shift PINs (unlimited)",
      "Audited voids & refund compliance logs",
      "CSV & PDF performance exports",
    ],
  },
  {
    id: "premium",
    name: "Bara Premium",
    tierLabel: "Bara Premium + AI Intelligence",
    badge: "Recommended",
    priceMonthly: 49000,
    priceAnnual: 44100,
    blurb: "Practical AI intelligence and predictive tools for multi-outlet or high-volume dining.",
    features: [
      "Everything in Pro",
      "Automated portion leakage detection & variance audits",
      "Surging ingredient food cost notifications",
      "Dynamic Happy Hour promo suggestions with projected upside",
      "Weekly operational briefs exportable for management",
      "Restock and inventory depletion predictions",
    ],
    highlight: true,
  },
]

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const { restaurant, updateRestaurant } = useRestaurant()

  React.useEffect(() => {
    if (tabParam === "users") {
      router.replace("/users")
    }
  }, [tabParam, router])

  const activeTab = tabParam === "billing" ? "billing" : "profile"

  const handleTabChange = (value: string) => {
    router.replace(`/settings?tab=${value}`, { scroll: false })
  }

  const [savedNotice, setSavedNotice] = React.useState("")
  const handleNotice = React.useCallback((msg: string) => {
    setSavedNotice(msg)
    setTimeout(() => setSavedNotice(""), 3500)
  }, [])

  const currentPlanId = restaurant.plan || "pro"
  const activePlanDetails =
    PLANS_CATALOG.find((p) => p.id === currentPlanId) || PLANS_CATALOG[1]
  const currentPlanPrice =
    restaurant.billing === "annual"
      ? activePlanDetails.priceAnnual
      : activePlanDetails.priceMonthly

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings &amp; Preferences
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your restaurant profile, operational food cost margins, and Bara subscription plan.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <TabsList className="h-11 w-full sm:w-auto p-1 bg-muted/80 rounded-2xl grid grid-cols-2 sm:inline-flex border border-border/60">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
          >
            <User className="size-4" />
            <span className="truncate">Profile &amp; Branch</span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-xl px-5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
          >
            <CreditCard className="size-4" />
            <span className="truncate">Billing &amp; Plan</span>
            <Badge variant="warning" className="hidden sm:inline-flex text-[10px] py-0 font-bold capitalize">
              {currentPlanId}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Profile & Branch */}
        <TabsContent value="profile" className="mt-0">
          <ProfileTabForm
            key={restaurant.name + restaurant.currency + restaurant.activeBranch}
            restaurant={restaurant}
            onSave={updateRestaurant}
            onNotice={handleNotice}
          />
        </TabsContent>

        {/* TAB 2: Billing & Subscription */}
        <TabsContent value="billing" className="mt-0 space-y-6">
          {/* Current Active Plan Card */}
          <Card className="relative overflow-hidden rounded-3xl border-2 border-[#C85A24] bg-card p-6 shadow-md">
            <div className="absolute top-0 right-0 bg-[#C85A24] text-white px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-200" />
              Active Subscription
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="accent" className="font-bold text-xs py-0.5 uppercase tracking-wider">
                  {activePlanDetails.badge} Tier
                </Badge>
                <h2 className="text-2xl font-extrabold text-foreground mt-1">
                  {activePlanDetails.tierLabel}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                  {activePlanDetails.blurb}
                </p>
              </div>

              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <span className="text-3xl font-extrabold text-foreground">
                  {currentPlanPrice.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground font-semibold ml-1">
                  {restaurant.currency || "RWF"} / {restaurant.billing === "annual" ? "month (billed annually)" : "month"}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Next renewal: <strong>{restaurant.billing === "annual" ? "October 5, 2027" : "November 5, 2026"}</strong>
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 border-t border-border/60 pt-5 text-xs">
              {activePlanDetails.features.slice(0, 3).map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-foreground">Change Plan:</span>
                {(["basic", "pro", "premium"] as const).map((tier) => {
                  const isCurrent = currentPlanId === tier
                  const tierLabel =
                    tier === "basic" ? "Basic (19k)" : tier === "pro" ? "Pro (32k)" : "Premium (49k)"
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        updateRestaurant({ plan: tier })
                        setSavedNotice(
                          `Switched plan to Bara ${tier.charAt(0).toUpperCase() + tier.slice(1)}! Workspace permissions updated.`
                        )
                        setTimeout(() => setSavedNotice(""), 3500)
                      }}
                      className={cn(
                        "h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                        isCurrent
                          ? "bg-[#C85A24] text-white shadow-xs"
                          : "bg-muted/80 hover:bg-muted text-foreground border border-border/80"
                      )}
                    >
                      {isCurrent && <Check className="size-3.5 stroke-[2.5]" />}
                      <span>{tierLabel}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const nextBilling = restaurant.billing === "annual" ? "monthly" : "annual"
                    updateRestaurant({ billing: nextBilling })
                    setSavedNotice(
                      nextBilling === "annual"
                        ? "Switched to Annual Billing (Saved 10%)!"
                        : "Switched to Monthly Billing!"
                    )
                    setTimeout(() => setSavedNotice(""), 3500)
                  }}
                  className="h-8 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {restaurant.billing === "annual"
                    ? "Switch to Monthly Plan"
                    : "Switch to Annual Plan (Save 10%)"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const num = prompt("Enter new card or MTN MoMo phone number:", "+250 788 000 000")
                    if (num) {
                      setSavedNotice(`Payment method updated to ${num}!`)
                      setTimeout(() => setSavedNotice(""), 3500)
                    }
                  }}
                  className="h-8 rounded-xl text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Update Payment Method
                </Button>
              </div>
            </div>
          </Card>

          {/* 3-Card Plan Selection Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Available Subscription Plans
                </h3>
                <p className="text-xs text-muted-foreground">
                  Switch your restaurant tier at any time. Features and navigation tabs unlock instantly.
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-muted/80 rounded-xl border border-border/60 self-start sm:self-auto text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => updateRestaurant({ billing: "monthly" })}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all cursor-pointer",
                    restaurant.billing === "monthly"
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => updateRestaurant({ billing: "annual" })}
                  className={cn(
                    "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                    restaurant.billing === "annual"
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>Annual</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">
                    Save 10%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {PLANS_CATALOG.map((plan) => {
                const isCurrent = currentPlanId === plan.id
                const planPrice =
                  restaurant.billing === "annual" ? plan.priceAnnual : plan.priceMonthly
                const isUpgrade =
                  (currentPlanId === "basic" && (plan.id === "pro" || plan.id === "premium")) ||
                  (currentPlanId === "pro" && plan.id === "premium")
                const isDowngrade = !isCurrent && !isUpgrade

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all",
                      isCurrent
                        ? "border-2 border-[#C85A24] bg-card shadow-md ring-1 ring-[#C85A24]/20"
                        : plan.highlight
                        ? "border-[#EA982C]/60 bg-card/90 shadow-xs"
                        : "border-border/80 bg-card/60"
                    )}
                  >
                    {isCurrent ? (
                      <div className="absolute top-0 right-0 bg-[#C85A24] text-white px-3 py-0.5 rounded-bl-lg text-[10px] font-bold">
                        Current Plan
                      </div>
                    ) : plan.highlight ? (
                      <div className="absolute top-0 right-0 bg-[#EA982C] text-white px-3 py-0.5 rounded-bl-lg text-[10px] font-bold">
                        Recommended
                      </div>
                    ) : null}

                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={plan.highlight ? "warning" : "secondary"}
                          className="text-[10px] font-bold py-0"
                        >
                          {plan.badge}
                        </Badge>
                      </div>

                      <h4 className="text-lg font-bold text-foreground mt-2">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {plan.blurb}
                      </p>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-foreground">
                          {planPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {restaurant.currency || "RWF"} / mo
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {restaurant.billing === "annual"
                          ? "Billed annually (10% discount applied)"
                          : "Billed monthly via Mobile Money"}
                      </p>

                      <div className="mt-4 pt-4 border-t border-border/60 space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Included Features:
                        </p>
                        <ul className="space-y-1.5 text-xs">
                          {plan.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2 text-foreground font-medium">
                              <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/60">
                      {isCurrent ? (
                        <Button
                          disabled
                          variant="outline"
                          className="w-full h-10 rounded-xl text-xs font-bold gap-1.5 opacity-90 cursor-default border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        >
                          <Check className="size-4 text-emerald-600" />
                          <span>Active Plan</span>
                        </Button>
                      ) : isUpgrade ? (
                        <Button
                          onClick={() => {
                            updateRestaurant({ plan: plan.id })
                            setSavedNotice(`Upgraded to ${plan.name}! Workspace permissions updated.`)
                            setTimeout(() => setSavedNotice(""), 3500)
                          }}
                          className="w-full h-10 rounded-xl text-xs font-bold shadow-md cursor-pointer bg-[#C85A24] text-white hover:bg-[#B34D1C] flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="size-3.5 text-amber-200" />
                          <span>Upgrade to {plan.name}</span>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            updateRestaurant({ plan: plan.id })
                            setSavedNotice(`Switched back to ${plan.name}! Workspace permissions updated.`)
                            setTimeout(() => setSavedNotice(""), 3500)
                          }}
                          variant="outline"
                          className="w-full h-10 rounded-xl text-xs font-bold shadow-xs cursor-pointer border-[#C85A24]/60 text-[#C85A24] hover:bg-[#C85A24]/10 dark:text-[#E8A33D] dark:border-[#E8A33D]/50 bg-background"
                        >
                          <span>
                            {isDowngrade ? `Downgrade to ${plan.name}` : `Switch to ${plan.name}`}
                          </span>
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Payment Method & Invoices */}
          <Card className="rounded-2xl border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  Billing History &amp; Receipts
                </CardTitle>
                <p className="text-xs text-muted-foreground">Download tax invoices for your restaurant accounting</p>
              </div>
              <span className="text-xs text-muted-foreground">MTN MoMo Business •••• 9821</span>
            </div>

            <div className="mt-3 divide-y divide-border/50">
              {[
                { ref: "INV-2026-09", date: "Oct 5, 2026", amount: `${currentPlanPrice.toLocaleString()} ${restaurant.currency || "RWF"}`, status: "Paid" },
                { ref: "INV-2026-08", date: "Sep 5, 2026", amount: `${currentPlanPrice.toLocaleString()} ${restaurant.currency || "RWF"}`, status: "Paid" },
                { ref: "INV-2026-07", date: "Aug 5, 2026", amount: `${currentPlanPrice.toLocaleString()} ${restaurant.currency || "RWF"}`, status: "Paid" },
              ].map((inv) => (
                <div key={inv.ref} className="flex items-center justify-between py-3 text-xs">
                  <div>
                    <p className="font-bold text-foreground">{inv.ref}</p>
                    <p className="text-[11px] text-muted-foreground">{inv.date} • {activePlanDetails.name} Subscription</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{inv.amount}</span>
                    <Badge variant="success" className="text-[10px] font-bold">
                      {inv.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSavedNotice(`Downloaded receipt for ${inv.ref}!`)
                        setTimeout(() => setSavedNotice(""), 3500)
                      }}
                      className="h-7 text-xs gap-1"
                    >
                      <Download className="size-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading settings...</div>}>
      <SettingsContent />
    </React.Suspense>
  )
}
