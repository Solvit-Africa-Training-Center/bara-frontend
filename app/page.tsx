"use client"

import * as React from "react"
import { CheckCircle2, X } from "lucide-react"
import { useRestaurant } from "@/components/restaurant-provider"
import { DateRangePickerModal } from "@/components/date-range-picker"
import {
  DashboardOperationsBar,
  DashboardKpiCards,
  RecentTransactionsFeed,
  TopMenuPerformers,
  KitchenWasteAlerts,
  ConsumablesSpendCard,
  CriticalIngredientsAlert,
  TransactionsModal,
  DEFAULT_KPI_DATA,
  DEFAULT_RECENT_TRANSACTIONS,
  ALL_MODAL_TRANSACTIONS,
  DEFAULT_TOP_PERFORMERS,
  DEFAULT_WASTE_ALERTS,
  DEFAULT_CONSUMABLES_CATEGORIES,
  DEFAULT_CRITICAL_ALERT,
  WasteAlertItem,
} from "./_components"

export default function DashboardPage() {
  const { restaurant } = useRestaurant()

  // Period filter states
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "today" | "yesterday" | "week" | "custom"
  >("today")
  const [customLabel, setCustomLabel] = React.useState("Custom")
  const [showPickerModal, setShowPickerModal] = React.useState(false)

  // Transaction modal state
  const [showTransactionsModal, setShowTransactionsModal] = React.useState(false)

  // Interactive feedback states
  const [notification, setNotification] = React.useState<string | null>(null)
  const [completedActions, setCompletedActions] = React.useState<
    Record<string, boolean>
  >({})

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  const handleWasteAction = (alert: WasteAlertItem) => {
    setCompletedActions((prev) => ({ ...prev, [alert.id]: true }))
    if (alert.actionType === "promo") {
      showToast(
        "2-for-1 Happy Hour Promo activated for Passion Fruit Panna Cotta to accelerate sell-through!"
      )
    } else {
      showToast(
        "De-listed Roast Duck Special from POS. Duck carcasses shifted to weekend skewers."
      )
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-10">
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

      {/* 1. Operations Bar */}
      <DashboardOperationsBar
        restaurantName={restaurant.name}
        activeBranch={restaurant.activeBranch}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        customLabel={customLabel}
        onOpenDatePicker={() => setShowPickerModal(true)}
      />

      <DateRangePickerModal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onApply={(_start, _end, label) => {
          setSelectedPeriod("custom")
          setCustomLabel(label)
          showToast(`Dashboard filtered for ${label}`)
        }}
      />

      {/* 2. Top Three Metric KPI Cards */}
      <DashboardKpiCards data={DEFAULT_KPI_DATA} />

      {/* 3. Recent Transaction Feed */}
      <RecentTransactionsFeed
        transactions={DEFAULT_RECENT_TRANSACTIONS}
        onViewAll={() => setShowTransactionsModal(true)}
      />

      {/* 4. Top Menu Performers */}
      <TopMenuPerformers performers={DEFAULT_TOP_PERFORMERS} />

      {/* 5. Middle Grid: Kitchen Waste Alerts + Consumables Spend */}
      <div className="grid gap-5 lg:grid-cols-2 items-stretch">
        <KitchenWasteAlerts
          alerts={DEFAULT_WASTE_ALERTS}
          onActionClick={handleWasteAction}
          completedActions={completedActions}
        />
        <ConsumablesSpendCard
          categories={DEFAULT_CONSUMABLES_CATEGORIES}
          totalSpendFormatted="3,180,000 RWF COGS"
          sourcingEfficiency="88.4% Rwandan Farm Sourced"
        />
      </div>

      {/* 6. Critical Ingredients Below Threshold Alert */}
      <CriticalIngredientsAlert
        message={DEFAULT_CRITICAL_ALERT.message}
        badgeLabel={DEFAULT_CRITICAL_ALERT.titleBadge}
      />

      {/* 7. Transactions Drilldown Modal */}
      <TransactionsModal
        open={showTransactionsModal}
        onOpenChange={setShowTransactionsModal}
        transactions={ALL_MODAL_TRANSACTIONS}
      />
    </div>
  )
}
