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
  DashboardSkeleton,
  DEFAULT_KPI_DATA,
  DEFAULT_RECENT_TRANSACTIONS,
  ALL_MODAL_TRANSACTIONS,
  DEFAULT_TOP_PERFORMERS,
  DEFAULT_WASTE_ALERTS,
  DEFAULT_CONSUMABLES_CATEGORIES,
  DEFAULT_CRITICAL_ALERT,
  WasteAlertItem,
} from "./_components"
import { ingredientsApi } from "@/lib/api-client"

export default function DashboardPage() {
  const { restaurant } = useRestaurant()

  // Period filter states
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "today" | "yesterday" | "week" | "custom"
  >("today")
  const [customLabel, setCustomLabel] = React.useState("Custom")
  const [showPickerModal, setShowPickerModal] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [lowStockAlert, setLowStockAlert] = React.useState<{ message: string; count: number }>({
    message: DEFAULT_CRITICAL_ALERT.message,
    count: 3,
  })
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    ingredientsApi.list().then((list) => {
      if (!list || list.length === 0) return
      const critical = list.filter((i) => {
        const q = parseFloat(String(i.current_quantity ?? 0))
        const th = parseFloat(String(i.low_stock_threshold ?? 0))
        return q <= th
      })
      if (critical.length > 0) {
        const names = critical.slice(0, 3).map((i) => i.name).join(", ")
        const more = critical.length > 3 ? ` and ${critical.length - 3} more` : ""
        setLowStockAlert({
          count: critical.length,
          message: `${critical.length} Critical Ingredient${critical.length > 1 ? "s" : ""} Below Threshold: ${names}${more}`,
        })
      } else {
        setLowStockAlert({
          count: 0,
          message: "All kitchen ingredients are currently at healthy stock levels.",
        })
      }
    })
  }, [])

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handlePeriodChange = (period: "today" | "yesterday" | "week" | "custom") => {
    setSelectedPeriod(period)
    setIsLoading(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 280)
  }

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
    <div className="flex flex-col gap-4 sm:gap-5 max-w-7xl mx-auto pb-10 w-full min-w-0">
      {/* Toast Feedback */}
      {notification && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 left-3 sm:left-auto z-50 flex items-center justify-between sm:justify-start gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="size-4 shrink-0 text-white" />
            <span className="truncate">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white/80 hover:text-white shrink-0 cursor-pointer"
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
        onSelectPeriod={handlePeriodChange}
        customLabel={customLabel}
        onOpenDatePicker={() => setShowPickerModal(true)}
      />

      <DateRangePickerModal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onApply={(_start, _end, label) => {
          handlePeriodChange("custom")
          setCustomLabel(label)
          showToast(`Dashboard filtered for ${label}`)
        }}
      />

      {isLoading ? (
        <DashboardSkeleton hideOperationsBar={true} />
      ) : (
        <>
          {/* 2. Critical Ingredients Below Threshold Alert */}
          <CriticalIngredientsAlert
            message={lowStockAlert.message}
            badgeLabel={lowStockAlert.count > 0 ? "STOCK ALERT" : "OPTIMAL"}
            href="/inventory"
            actionLabel="Manage Inventory"
          />

          {/* 3. Top Three Metric KPI Cards */}
          <DashboardKpiCards data={DEFAULT_KPI_DATA} />

          {/* 4. Recent Transaction Feed */}
          <RecentTransactionsFeed
            transactions={DEFAULT_RECENT_TRANSACTIONS}
            onViewAll={() => setShowTransactionsModal(true)}
          />

          {/* 5. Top Menu Performers */}
          <TopMenuPerformers performers={DEFAULT_TOP_PERFORMERS} />

          {/* 6. Middle Grid: Kitchen Waste Alerts + Consumables Spend */}
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
        </>
      )}

      {/* 7. Transactions Drilldown Modal */}
      <TransactionsModal
        open={showTransactionsModal}
        onOpenChange={setShowTransactionsModal}
        transactions={ALL_MODAL_TRANSACTIONS}
      />
    </div>
  )
}
