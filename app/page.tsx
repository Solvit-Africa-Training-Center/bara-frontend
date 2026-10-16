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
  DEFAULT_CRITICAL_ALERT,
  type WasteAlertItem,
  type DashboardKpiData,
  type TransactionItem,
  type TopPerformerItem,
  type ConsumableCategory,
  type PaymentMethodType,
} from "./_components"
import { ingredientsApi } from "@/lib/api-client"
import { stockMovementsApi } from "@/app/inventory/inventory-api"
import { consumablePurchasesApi, ordersApi } from "@/app/reports/reports-api"
import { menuApi } from "@/app/menu/menu-api"

function normalizePaymentMethod(method?: string): PaymentMethodType {
  if (!method) return "Cash"
  const m = method.toLowerCase()
  if (m.includes("momo") || m.includes("mtn")) return "MTN MoMo"
  if (m.includes("airtel")) return "Airtel Money"
  if (m.includes("visa") || m.includes("card")) return "Visa Card"
  return "Cash"
}

const INITIAL_EMPTY_KPI: DashboardKpiData = {
  totalSales: {
    amount: 0,
    amountFormatted: "0",
    changePercentage: "0 orders",
    isPositive: true,
    subtitle: "vs previous period",
    progressPercent: 0,
  },
  consumables: {
    amount: 0,
    amountFormatted: "0",
    healthBadge: "0% Spend",
    targetSubtitle: "Target: ≤ 32.5%",
    progressPercent: 0,
  },
  profitMargin: {
    amount: 0,
    amountFormatted: "0",
    marginBadge: "0%",
    subtitle: "Profit post-Consumables",
    progressPercent: 0,
  },
}

export default function DashboardPage() {
  const { restaurant } = useRestaurant()

  // Period filter states
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "today" | "yesterday" | "week" | "custom"
  >("today")
  const [customLabel, setCustomLabel] = React.useState("Custom")
  const [showPickerModal, setShowPickerModal] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [lowStockAlert, setLowStockAlert] = React.useState<{ message: string; count: number }>({
    message: DEFAULT_CRITICAL_ALERT.message,
    count: 0,
  })

  // Dynamic Dashboard States
  const [kpiData, setKpiData] = React.useState<DashboardKpiData>(INITIAL_EMPTY_KPI)
  const [recentTransactions, setRecentTransactions] = React.useState<TransactionItem[]>([])
  const [modalTransactions, setModalTransactions] = React.useState<TransactionItem[]>([])
  const [topPerformers, setTopPerformers] = React.useState<TopPerformerItem[]>([])
  const [wasteAlerts, setWasteAlerts] = React.useState<WasteAlertItem[]>([])
  const [consumablesCategories, setConsumablesCategories] = React.useState<ConsumableCategory[]>([])
  const [totalConsumablesFormatted, setTotalConsumablesFormatted] = React.useState<string>("0 RWF COGS")

  // Transaction modal state
  const [showTransactionsModal, setShowTransactionsModal] = React.useState(false)

  // Interactive feedback states
  const [notification, setNotification] = React.useState<string | null>(null)
  const [completedActions, setCompletedActions] = React.useState<Record<string, boolean>>({})

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Load live data across all services
  React.useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      setIsLoading(true)
      try {
        const [
          ingredientsRes,
          consumablesPurchasesRes,
          movementsRes,
          menuRes,
          ordersRes,
        ] = await Promise.allSettled([
          ingredientsApi.list(),
          consumablePurchasesApi.list(),
          stockMovementsApi.list(),
          menuApi.list(),
          ordersApi.list(),
        ])

        if (!isMounted) return

        // 1. Ingredients Low Stock Alert
        const ingredients = ingredientsRes.status === "fulfilled" ? ingredientsRes.value : []
        if (Array.isArray(ingredients) && ingredients.length > 0) {
          const critical = ingredients.filter((i) => {
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
        } else {
          setLowStockAlert({
            count: 0,
            message: "No ingredients tracked yet. Add inventory ingredients to view real-time stock thresholds.",
          })
        }

        // 2. Consumables Purchases
        const purchases = consumablesPurchasesRes.status === "fulfilled" ? consumablesPurchasesRes.value : []
        let totalConsumablesAmount = 0
        const catMap = new Map<string, number>()

        if (Array.isArray(purchases) && purchases.length > 0) {
          for (const p of purchases) {
            const amt = parseFloat(String(p.cost)) || 0
            totalConsumablesAmount += amt
            const catName = p.consumable_name || "General Supplies"
            catMap.set(catName, (catMap.get(catName) || 0) + amt)
          }

          const dotColors = ["bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-rose-500"]
          let colorIdx = 0
          const dynamicCategories: ConsumableCategory[] = Array.from(catMap.entries()).map(([name, amt]) => {
            const pct = totalConsumablesAmount > 0 ? Math.round((amt / totalConsumablesAmount) * 100) : 0
            const color = dotColors[colorIdx++ % dotColors.length]
            return {
              id: `cat-${name.toLowerCase().replace(/\s+/g, "-")}`,
              name,
              percentage: pct,
              amountRwf: amt,
              amountFormatted: `${Math.round(amt).toLocaleString()} RWF`,
              dotColor: color,
              barColor: color,
            }
          })
          setConsumablesCategories(dynamicCategories)
          setTotalConsumablesFormatted(`${Math.round(totalConsumablesAmount).toLocaleString()} RWF COGS`)
        } else {
          setConsumablesCategories([])
          setTotalConsumablesFormatted("0 RWF COGS")
        }

        // 3. Kitchen Waste Alerts from Stock Movements
        const movements = movementsRes.status === "fulfilled" ? movementsRes.value : []
        if (Array.isArray(movements) && movements.length > 0) {
          const wasteMovements = movements.filter((m) => m.movement_type === "waste")
          if (wasteMovements.length > 0) {
            const mappedWaste: WasteAlertItem[] = wasteMovements.slice(0, 3).map((w, idx) => ({
              id: w.id || `waste-${idx}`,
              title: `${w.ingredient_name || "Ingredient"} Loss Logged`,
              wasteBadge: `${w.quantity} waste`,
              meta: `Logged on ${new Date(w.occurred_at).toLocaleDateString()}`,
              callout: w.note || `Reported by ${w.recorded_by_name || "Kitchen staff"}`,
              actionLabel: "Review Stock Log",
              actionType: "promo",
            }))
            setWasteAlerts(mappedWaste)
          } else {
            setWasteAlerts([])
          }
        } else {
          setWasteAlerts([])
        }

        // 4. Orders & Sales Transactions
        const orders = ordersRes.status === "fulfilled" ? ordersRes.value : []
        const menuItems = menuRes.status === "fulfilled" ? menuRes.value : []

        if (Array.isArray(orders) && orders.length > 0) {
          const completedOrders = orders.filter((o) => o.status === "completed")
          const totalSales = completedOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
          const netProfit = Math.max(0, totalSales - totalConsumablesAmount)
          const profitMarginPct = totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0
          const consumablesPct = totalSales > 0 ? Number(((totalConsumablesAmount / totalSales) * 100).toFixed(1)) : 0

          setKpiData({
            totalSales: {
              amount: totalSales,
              amountFormatted: Math.round(totalSales).toLocaleString(),
              changePercentage: `${completedOrders.length} orders`,
              isPositive: true,
              subtitle: "Live from POS till",
              progressPercent: Math.min(100, Math.round((totalSales / 5000000) * 100)),
            },
            consumables: {
              amount: totalConsumablesAmount,
              amountFormatted: Math.round(totalConsumablesAmount).toLocaleString(),
              healthBadge: `${consumablesPct}% of Sales`,
              targetSubtitle: "Target: ≤ 32.5%",
              progressPercent: Math.min(100, consumablesPct),
            },
            profitMargin: {
              amount: netProfit,
              amountFormatted: Math.round(netProfit).toLocaleString(),
              marginBadge: `${profitMarginPct}%`,
              subtitle: "Profit post-Consumables",
              progressPercent: Math.min(100, profitMarginPct),
            },
          })

          const mappedTx: TransactionItem[] = completedOrders.slice(0, 5).map((o, idx) => ({
            id: o.order_id || `tx-${idx}`,
            title: o.table_number ? `Table ${o.table_number} • Order` : "Walk-in Order",
            status: "Paid",
            time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent",
            server: o.staff_name || "Till Staff",
            receiptNo: `#BARA-${(o.order_id || "").slice(-4).toUpperCase()}`,
            amount: parseFloat(o.total) || 0,
            amountFormatted: `RWF ${Math.round(parseFloat(o.total) || 0).toLocaleString()}`,
            paymentMethod: normalizePaymentMethod(o.payment_method),
            dotColor: "bg-emerald-500",
          }))
          setRecentTransactions(mappedTx)
          setModalTransactions(completedOrders.map((o, idx) => ({
            id: o.order_id || `tx-all-${idx}`,
            title: o.table_number ? `Table ${o.table_number} • Order` : "Walk-in Order",
            status: "Paid",
            time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent",
            server: o.staff_name || "Till Staff",
            receiptNo: `#BARA-${(o.order_id || "").slice(-4).toUpperCase()}`,
            amount: parseFloat(o.total) || 0,
            amountFormatted: `RWF ${Math.round(parseFloat(o.total) || 0).toLocaleString()}`,
            paymentMethod: normalizePaymentMethod(o.payment_method),
            dotColor: "bg-emerald-500",
          })))
        } else {
          setKpiData({
            totalSales: {
              amount: 0,
              amountFormatted: "0",
              changePercentage: "0 orders",
              isPositive: true,
              subtitle: "Awaiting POS till connection",
              progressPercent: 0,
            },
            consumables: {
              amount: totalConsumablesAmount,
              amountFormatted: Math.round(totalConsumablesAmount).toLocaleString(),
              healthBadge: totalConsumablesAmount > 0 ? "Tracked" : "0 RWF",
              targetSubtitle: "Target: ≤ 32.5%",
              progressPercent: 0,
            },
            profitMargin: {
              amount: 0,
              amountFormatted: "0",
              marginBadge: "0%",
              subtitle: "Profit post-Consumables",
              progressPercent: 0,
            },
          })
          setRecentTransactions([])
          setModalTransactions([])
        }

        // 5. Top Performers (from live Menu items)
        if (Array.isArray(menuItems) && menuItems.length > 0) {
          const performers: TopPerformerItem[] = menuItems.slice(0, 4).map((m, idx) => {
            const price = parseFloat(String(m.price)) || 0
            const cost = parseFloat(String(m.cost_per_serving || 0))
            const margin = price > 0 && cost > 0 ? Math.round(((price - cost) / price) * 100) : 65
            return {
              id: m.id || m.menu_id || `perf-${idx}`,
              name: m.name,
              orders: typeof m.available_servings === "number" ? m.available_servings : 0,
              ordersUnit: "servings ready",
              revenue: price,
              revenueFormatted: `RWF ${price.toLocaleString()}`,
              profitPercent: margin,
              badge: m.category || "Main",
              badgeColor: "border-primary/30 text-primary bg-primary/10",
              avgPrep: "15 min",
              image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80",
            }
          })
          setTopPerformers(performers)
        } else {
          setTopPerformers([])
        }
      } catch (err) {
        console.error("Dashboard dynamic load error:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [selectedPeriod])

  const handlePeriodChange = (period: "today" | "yesterday" | "week" | "custom") => {
    setSelectedPeriod(period)
  }

  const handleWasteAction = (alert: WasteAlertItem) => {
    setCompletedActions((prev) => ({ ...prev, [alert.id]: true }))
    showToast(`Reviewed stock log for ${alert.title}.`)
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
            href="/menu"
            actionLabel="View Menu Recipes"
          />

          {/* 3. Top Three Metric KPI Cards */}
          <DashboardKpiCards data={kpiData} />

          {/* 4. Recent Transaction Feed */}
          <RecentTransactionsFeed
            transactions={recentTransactions}
            onViewAll={() => setShowTransactionsModal(true)}
          />

          {/* 5. Top Menu Performers */}
          <TopMenuPerformers performers={topPerformers} />

          {/* 6. Middle Grid: Kitchen Waste Alerts + Consumables Spend */}
          <div className="grid gap-5 lg:grid-cols-2 items-stretch">
            <KitchenWasteAlerts
              alerts={wasteAlerts}
              onActionClick={handleWasteAction}
              completedActions={completedActions}
            />
            <ConsumablesSpendCard
              categories={consumablesCategories}
              totalSpendFormatted={totalConsumablesFormatted}
              sourcingEfficiency="Live Kitchen Supply Attribution"
            />
          </div>
        </>
      )}

      {/* 7. Transactions Drilldown Modal */}
      <TransactionsModal
        open={showTransactionsModal}
        onOpenChange={setShowTransactionsModal}
        transactions={modalTransactions}
      />
    </div>
  )
}
