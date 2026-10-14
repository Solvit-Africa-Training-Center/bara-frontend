"use client"

import * as React from "react"
import { CheckCircle2, X } from "lucide-react"
import { useRestaurant } from "@/components/restaurant-provider"
import { PlanUpgradeGate } from "@/components/plan-upgrade-gate"
import {
  AIInsightsHeader,
  WeeklySummaryHero,
  AnomaliesCard,
  PredictedRestockCard,
  LunchOpportunityCard,
  DessertForecastCard,
  PracticalQuestionCard,
  AskBaraDialog,
  OilMovementsDialog,
  VoidDetailsDialog,
  PurchaseListDialog,
  HourlyDemandDialog,
  InsightsHelpDialog,
  DEFAULT_WEEKLY_HERO,
  DEFAULT_ANOMALIES,
  DEFAULT_RESTOCK_ITEMS,
  DEFAULT_LUNCH_OPPORTUNITY,
  DEFAULT_DESSERT_FORECAST,
  DEFAULT_PRESET_QUESTIONS,
  DEFAULT_OIL_MOVEMENTS,
  DEFAULT_VOID_INCIDENTS,
  DEFAULT_HOURLY_SLOTS,
} from "./_components"

export default function AIInsightsPage() {
  const { restaurant } = useRestaurant()

  // Modal dialog states
  const [askBaraOpen, setAskBaraOpen] = React.useState(false)
  const [activeAskPrompt, setActiveAskPrompt] = React.useState<string | undefined>()
  const [oilModalOpen, setOilModalOpen] = React.useState(false)
  const [voidModalOpen, setVoidModalOpen] = React.useState(false)
  const [purchaseModalOpen, setPurchaseModalOpen] = React.useState(false)
  const [hourlyModalOpen, setHourlyModalOpen] = React.useState(false)
  const [helpModalOpen, setHelpModalOpen] = React.useState(false)

  // Interaction feedback states
  const [notification, setNotification] = React.useState<string | null>(null)
  const [copiedOrder, setCopiedOrder] = React.useState(false)
  const [oilAcknowledged, setOilAcknowledged] = React.useState(false)
  const [voidFlagged, setVoidFlagged] = React.useState(false)

  const showToast = (message: string) => {
    setNotification(message)
    setTimeout(() => {
      setNotification((prev) => (prev === message ? null : prev))
    }, 3500)
  }

  const handleOpenAskBara = (initialPrompt?: string) => {
    setActiveAskPrompt(initialPrompt)
    setAskBaraOpen(true)
  }

  const handleCopyPurchaseOrder = () => {
    const text = `BARA RESTOCK ORDER - ${restaurant.name} (${restaurant.activeBranch})
Date: Today, Week 24–30 Sept
Items:
1. Tilapia fillet: 18 kg (Est. RWF 144,000) - Needed: Tomorrow 14:00
2. Cooking oil: 20 L (Est. RWF 76,000) - Needed: Sat 10:00
3. Passion fruit: 80 pcs (Est. RWF 48,000) - Needed: Sun 08:00
4. Beef tenderloin: 12 kg (Est. RWF 132,000) - Needed: Mon 12:00
Total Estimated: RWF 400,000`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedOrder(true)
      showToast("Purchase order copied to clipboard! Ready to send to suppliers.")
      setTimeout(() => setCopiedOrder(false), 2500)
    }
  }

  if (!restaurant.features?.canAccessAiInsights && restaurant.plan !== "premium") {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AI Insights &amp; Operational Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Practical weekly analysis from your sales, menu and inventory data.
          </p>
        </div>
        <PlanUpgradeGate
          requiredPlan="premium"
          featureName="Bara AI Insights"
          title="Unlock Practical Kitchen AI & Operational Intelligence"
          description="Get automated portion leakage alerts, ingredient cost spike notifications, dynamic restock predictions, and weekly operational briefs."
          features={[
            "Weekly operational summary in plain conversational language",
            "Cooking oil, recipe variance & staff void anomaly audits",
            "7-day restock prediction with run-out time & supplier cost estimation",
            "Lunch service hourly rush optimization recommendations",
            "Ask Bara conversational kitchen assistant",
          ]}
          priceRwf={49000}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1360px] mx-auto pb-12">
      {/* Toast Feedback */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-white" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white/80 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header Bar */}
      <AIInsightsHeader
        onOpenAskBara={() => handleOpenAskBara()}
        onOpenHelp={() => setHelpModalOpen(true)}
        isSynced={true}
        planName="Premium"
      />

      {/* 2. Hero Card */}
      <WeeklySummaryHero insight={DEFAULT_WEEKLY_HERO} />

      {/* 3. Middle Section: Anomalies & Restock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <AnomaliesCard
          anomalies={DEFAULT_ANOMALIES}
          onReviewOil={() => setOilModalOpen(true)}
          onReviewVoid={() => setVoidModalOpen(true)}
        />
        <PredictedRestockCard
          items={DEFAULT_RESTOCK_ITEMS}
          onCreatePurchaseList={() => setPurchaseModalOpen(true)}
        />
      </div>

      {/* 4. Bottom Section: Opportunities & Forecasts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <LunchOpportunityCard
          data={DEFAULT_LUNCH_OPPORTUNITY}
          onViewDemand={() => setHourlyModalOpen(true)}
        />
        <DessertForecastCard data={DEFAULT_DESSERT_FORECAST} />
        <PracticalQuestionCard onAskBara={handleOpenAskBara} />
      </div>

      {/* 5. Modals & Dialogs */}
      <AskBaraDialog
        open={askBaraOpen}
        onOpenChange={setAskBaraOpen}
        presets={DEFAULT_PRESET_QUESTIONS}
        initialPrompt={activeAskPrompt}
        restaurantName={restaurant.name}
      />

      <OilMovementsDialog
        open={oilModalOpen}
        onOpenChange={setOilModalOpen}
        records={DEFAULT_OIL_MOVEMENTS}
        onAcknowledge={() => {
          setOilAcknowledged(true)
          showToast("Acknowledged cooking oil variance. Alert logged for Head Chef.")
          setOilModalOpen(false)
        }}
        isAcknowledged={oilAcknowledged}
      />

      <VoidDetailsDialog
        open={voidModalOpen}
        onOpenChange={setVoidModalOpen}
        records={DEFAULT_VOID_INCIDENTS}
        onFlagSupervisor={() => {
          setVoidFlagged(true)
          showToast("Flagged for shift supervisor review and manager PIN requirement.")
          setVoidModalOpen(false)
        }}
        isFlagged={voidFlagged}
      />

      <PurchaseListDialog
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        items={DEFAULT_RESTOCK_ITEMS}
        onCopyWhatsApp={handleCopyPurchaseOrder}
        onApprove={() => {
          showToast("Purchase order marked as approved and sent to Procurement.")
          setPurchaseModalOpen(false)
        }}
        isCopied={copiedOrder}
      />

      <HourlyDemandDialog
        open={hourlyModalOpen}
        onOpenChange={setHourlyModalOpen}
        slots={DEFAULT_HOURLY_SLOTS}
        onUpdateSchedule={() => {
          showToast("Prep schedule adjustment shared with Grill Station.")
          setHourlyModalOpen(false)
        }}
      />

      <InsightsHelpDialog
        open={helpModalOpen}
        onOpenChange={setHelpModalOpen}
      />
    </div>
  )
}
