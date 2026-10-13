"use client"

import * as React from "react"
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  XCircle,
} from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"
import {
  subscriptionApi,
  paymentConfirmationsApi,
  PaymentConfirmation,
} from "@/lib/api-client"
import { SubscriptionPlanItem } from "./types"
import { PaymentConfirmationModal } from "./payment-confirmation-modal"

export const PLANS_CATALOG: SubscriptionPlanItem[] = [
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

export interface BillingPlansTabProps {
  onSavedNotice: (msg: string) => void
}

export function BillingPlansTab({ onSavedNotice }: BillingPlansTabProps) {
  const { restaurant, updateRestaurant } = useRestaurant()
  const [isChangingPlan, setIsChangingPlan] = React.useState(false)
  const [paymentConfirmations, setPaymentConfirmations] = React.useState<PaymentConfirmation[]>([])
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)

  const currentPlanId = restaurant.plan || "pro"
  const isAnnual = restaurant.billing === "annual"
  const accountStatus = restaurant.status || "active"

  const activePlanDetails =
    PLANS_CATALOG.find((p) => p.id === currentPlanId) || PLANS_CATALOG[1]
  const currentPlanPrice = isAnnual
    ? activePlanDetails.priceAnnual
    : activePlanDetails.priceMonthly

  // Load payment confirmations
  const loadConfirmations = React.useCallback(async () => {
    try {
      const list = await paymentConfirmationsApi.list()
      setPaymentConfirmations(list)
    } catch {
      /* ignore */
    }
  }, [])

  React.useEffect(() => {
    loadConfirmations()
  }, [loadConfirmations])

  const handlePlanSelect = async (tier: "basic" | "pro" | "premium") => {
    setIsChangingPlan(true)
    try {
      await subscriptionApi.selectPlan(tier)
    } catch {
      // Offline fallback
    }
    updateRestaurant({ plan: tier })
    setIsChangingPlan(false)
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)
    onSavedNotice(`Switched subscription to Bara ${tierName}! Workspace features updated.`)
  }

  const handleBillingCycleToggle = (annual: boolean) => {
    const cycle = annual ? "annual" : "monthly"
    updateRestaurant({ billing: cycle })
    onSavedNotice(
      annual
        ? "Switched to Annual Billing (10% discount applied)!"
        : "Switched to Monthly Billing!"
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Current Active Plan & Account Status Card */}
      <Card className="relative overflow-hidden rounded-[22px] border-border/70 bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Current Active Plan
              </span>

              {accountStatus === "active" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              )}
              {accountStatus === "grace" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="size-3" />
                  Grace Period (5 days left)
                </span>
              )}
              {accountStatus === "restricted" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#A83232]/10 border border-[#A83232]/30 px-2.5 py-0.5 text-xs font-bold text-[#A83232]">
                  <ShieldAlert className="size-3" />
                  Restricted (Read-Only)
                </span>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C221E] dark:text-[#FAF5EE]">
                {activePlanDetails.name}
              </h2>
              <span className="text-xs font-semibold text-muted-foreground">
                ({currentPlanPrice.toLocaleString()} RWF / month)
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {activePlanDetails.blurb}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="inline-flex items-center gap-1 p-1 bg-muted/80 rounded-xl border border-border/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleBillingCycleToggle(false)}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all cursor-pointer",
                  !isAnnual
                    ? "bg-card text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleBillingCycleToggle(true)}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                  isAnnual
                    ? "bg-card text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Annual</span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[10px] font-extrabold">
                  -10%
                </span>
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              className="h-8.5 rounded-xl text-xs font-bold bg-[#C1440E] hover:bg-[#A8390B] text-white shadow-xs"
            >
              <Smartphone className="size-3.5 mr-1.5" />
              <span>Submit MoMo Receipt</span>
            </Button>
          </div>
        </div>

        {/* Section 4.3 Account Status Information */}
        <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {accountStatus === "active" ? (
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-4" />
                <span>Account in good standing. All subscribed tier features are fully active.</span>
              </span>
            ) : accountStatus === "grace" ? (
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                <AlertTriangle className="size-4" />
                <span>
                  Grace period active ({restaurant.graceDaysLeft || 5} days remaining). Full access continues; submit payment to avoid service restrictions.
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#A83232] font-medium">
                <ShieldAlert className="size-4" />
                <span>
                  Account restricted (read-only mode). Data viewing is preserved; submit payment to restore editing.
                </span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Tenant: {restaurant.name}
          </span>
        </div>
      </Card>

      {/* 2. 3-Card Subscription Comparison Section */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Available Subscription Tiers
          </h3>
          <p className="text-xs text-muted-foreground">
            Select the tier that fits your kitchen operations. Feature gating adapts server-side and client-side.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 items-stretch">
          {PLANS_CATALOG.map((plan) => {
            const isCurrent = currentPlanId === plan.id
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-[22px] p-5.5 shadow-xs transition-all",
                  plan.highlight
                    ? "border-[#C85A24] dark:border-[#C85A24]/60 bg-gradient-to-b from-[#C85A24]/5 to-transparent"
                    : "border-border/70 bg-card",
                  isCurrent && "ring-2 ring-primary/40"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#C85A24] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-foreground">
                      {plan.name}
                    </h4>
                    {isCurrent && (
                      <span className="rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-foreground tabular-nums">
                      {price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      RWF / mo
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {plan.blurb}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-border/60 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Included Capabilities:
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-foreground">
                          <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight font-medium">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Button
                    size="sm"
                    disabled={isCurrent || isChangingPlan}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={cn(
                      "w-full h-8.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer",
                      isCurrent
                        ? "bg-muted text-muted-foreground cursor-default border border-border"
                        : plan.highlight
                        ? "bg-[#C85A24] hover:bg-[#B34D1C] text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {isCurrent ? (
                      "Active Plan"
                    ) : plan.id === "premium" ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Sparkles className="size-3.5 fill-current" />
                        Upgrade to Premium
                      </span>
                    ) : (
                      `Switch to ${plan.name}`
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 3. Mobile Money Payment Confirmations (OpenAPI /api/payment-confirmations/) */}
      <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-foreground">
                Payment Confirmations &amp; MoMo Verifications
              </CardTitle>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-primary">
                /api/payment-confirmations/
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track submitted external payments (MTN MoMo, Airtel Money, Bank transfer)
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setShowConfirmModal(true)}
            className="h-8 rounded-xl text-xs font-bold bg-[#C1440E] hover:bg-[#A8390B] text-white self-start sm:self-auto shadow-2xs"
          >
            <Smartphone className="size-3.5 mr-1.5" />
            <span>Submit Payment Confirmation</span>
          </Button>
        </div>

        <div className="mt-3 divide-y divide-border/50 text-xs">
          {paymentConfirmations.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No payment confirmations submitted yet.
            </p>
          ) : (
            paymentConfirmations.map((conf) => {
              const isPaid = conf.status === "paid"
              const isRejected = conf.status === "rejected"

              return (
                <div
                  key={conf.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 hover:bg-muted/20 px-1 rounded-xl transition-colors gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{conf.payer_name}</span>
                      <span className="text-muted-foreground font-mono">({conf.payer_phone})</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Submitted on {new Date(conf.submitted_at).toLocaleDateString()} at{" "}
                      {new Date(conf.submitted_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {conf.rejection_reason && (
                        <span className="text-[#A83232] ml-1 font-semibold">
                          • Reason: {conf.rejection_reason}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-bold">
                        <CheckCircle2 className="size-3" />
                        <span>Approved &amp; Active</span>
                      </span>
                    ) : isRejected ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#A83232]/10 text-[#A83232] px-2.5 py-0.5 text-[11px] font-bold">
                          <XCircle className="size-3" />
                          <span>Rejected</span>
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowConfirmModal(true)}
                          className="h-6 px-2 text-[10px] font-bold border-[#A83232]/30 text-[#A83232] hover:bg-[#A83232]/10"
                        >
                          Resubmit
                        </Button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-bold">
                        <Clock className="size-3" />
                        <span>Pending Verification</span>
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* 4. Billing History Card */}
      <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              Billing History &amp; Receipts
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Electronic invoices for restaurant tax accounting
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Payment: MTN MoMo Business •••• 9821
          </span>
        </div>

        <div className="mt-3 divide-y divide-border/50 text-xs">
          {[
            {
              ref: "INV-2026-09",
              date: "Oct 5, 2026",
              amount: `${currentPlanPrice.toLocaleString()} RWF`,
              status: "Paid",
            },
            {
              ref: "INV-2026-08",
              date: "Sep 5, 2026",
              amount: `${currentPlanPrice.toLocaleString()} RWF`,
              status: "Paid",
            },
            {
              ref: "INV-2026-07",
              date: "Aug 5, 2026",
              amount: `${currentPlanPrice.toLocaleString()} RWF`,
              status: "Paid",
            },
          ].map((inv) => (
            <div
              key={inv.ref}
              className="flex items-center justify-between py-3 hover:bg-muted/20 px-1 rounded-xl transition-colors"
            >
              <div>
                <p className="font-bold text-foreground">{inv.ref}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {inv.date} • {activePlanDetails.name} Subscription
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground">{inv.amount}</span>
                <span className="rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                  {inv.status}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSavedNotice(`Downloaded invoice PDF for ${inv.ref}!`)}
                  className="h-7 px-2.5 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Download className="size-3.5" />
                  <span>PDF</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        subscriptionId={`sub-${currentPlanId}`}
        defaultPayerName="Alex Rivera"
        defaultPhone="0788123456"
        onSuccess={(msg) => {
          onSavedNotice(msg)
          loadConfirmations()
        }}
      />
    </div>
  )
}
