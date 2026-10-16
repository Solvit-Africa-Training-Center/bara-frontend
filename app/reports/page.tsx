"use client"

import * as React from "react"
import { useRestaurant } from "@/components/restaurant-provider"
import { DateRangePickerModal } from "@/components/date-range-picker"
import {
  ConsumablesBreakdownCard,
  MenuItemsCard,
  PeriodReportData,
  ReportPeriod,
  ReportsAuditBanner,
  ReportsAuditModal,
  ReportsFilterBar,
  ReportsHeader,
  ReportsHelpModal,
  ReportsKPICards,
  ReportsSkeleton,
  SalesTrendCard,
  StaffPerformanceCard,
  getReportDataForPeriod,
  LogConsumableModal,
} from "./_components"
import { PlanUpgradeGate } from "@/components/plan-upgrade-gate"
import { fetchDynamicReportData } from "./reports-api"

export default function ReportsPage() {
  const { restaurant } = useRestaurant()
  const [period, setPeriod] = React.useState<ReportPeriod>("month")
  const [dateLabel, setDateLabel] = React.useState("1–30 September 2026")
  const [customRange, setCustomRange] = React.useState<{ start: string; end: string } | undefined>(undefined)
  const [data, setData] = React.useState<PeriodReportData>(() =>
    getReportDataForPeriod("month")
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showHelpModal, setShowHelpModal] = React.useState(false)
  const [showAuditModal, setShowAuditModal] = React.useState(false)
  const [showConsumableModal, setShowConsumableModal] = React.useState(false)
  const [notice, setNotice] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(null), 3500)
  }

  // Load real data from backend API endpoints
  const loadReportData = React.useCallback(
    async (
      selectedPeriod: ReportPeriod,
      labelToUse?: string,
      customRangeParam?: { start: string; end: string }
    ) => {
      setIsLoading(true)
      try {
        const liveData = await fetchDynamicReportData(selectedPeriod, labelToUse, customRangeParam)
        setData(liveData)
      } catch (err) {
        console.error("Failed to fetch live report data from API:", err)
        setData(getReportDataForPeriod(selectedPeriod, labelToUse, customRangeParam))
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Fetch real data on initial mount
  React.useEffect(() => {
    loadReportData(period, dateLabel, customRange)
  }, [loadReportData])

  // Range filter handler using real API endpoints
  const handlePeriodChange = React.useCallback(
    (
      selectedPeriod: ReportPeriod,
      customLabel?: string,
      newCustomRange?: { start: string; end: string }
    ) => {
      setPeriod(selectedPeriod)

      let newLabel = dateLabel
      if (selectedPeriod === "today") {
        newLabel = "Today · 6 Oct 2026"
        setCustomRange(undefined)
      } else if (selectedPeriod === "week") {
        newLabel = "This Week (28 Sep – 4 Oct 2026)"
        setCustomRange(undefined)
      } else if (selectedPeriod === "month") {
        newLabel = "1–30 September 2026"
        setCustomRange(undefined)
      } else if (selectedPeriod === "custom" && customLabel) {
        newLabel = customLabel
        if (newCustomRange) {
          setCustomRange(newCustomRange)
        }
      } else if (selectedPeriod === "custom") {
        setShowDatePicker(true)
        return
      }

      setDateLabel(newLabel)
      loadReportData(
        selectedPeriod,
        newLabel,
        newCustomRange ?? (selectedPeriod === "custom" ? customRange : undefined)
      )
    },
    [dateLabel, customRange, loadReportData]
  )

  if (!restaurant.features?.canAccessReports && restaurant.plan === "basic") {
    return (
      <div className="flex flex-col gap-5 max-w-[1400px] mx-auto pb-10">
        <ReportsHeader
          onExport={() => {}}
          onOpenHelp={() => setShowHelpModal(true)}
        />
        <PlanUpgradeGate
          requiredPlan="pro"
          featureName="Financial & Operational Reports"
          title="Unlock Daily Sales Trends & Consumables Breakdown"
          description="Track daily revenue trajectories, monthly consumables spending, top/bottom menu items, and audited void/refund logs with Bara Pro."
          features={[
            "Daily completed sales linear area chart & trajectory analysis",
            "Monthly consumables breakdown (Gas, Packaging, Supplies)",
            "Top 5 & Bottom 5 menu item sales performance",
            "Staff completed orders & revenue attribution",
            "Full audited voids and refunds compliance trail",
          ]}
          priceRwf={32000}
        />
        <ReportsHelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
      </div>
    )
  }

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `BARA POS & RESTAURANT REPORT - ${data.dateLabel}`,
        `Restaurant,${restaurant.name}`,
        `Branch,${restaurant.activeBranch}`,
        `Timezone,Africa/Kigali`,
        "",
        "SUMMARY METRICS",
        "Metric,Value",
        `Total Sales,${data.kpis.totalSalesFormatted}`,
        `Completed Orders,${data.kpis.completedOrdersFormatted}`,
        `Average Order Value,${data.kpis.averageOrderValueFormatted}`,
        `Consumables Spending,${data.kpis.consumablesSpendingFormatted}`,
        "",
        `SALES TREND (${data.dateLabel})`,
        "Index,Interval,Sales (RWF)",
        ...data.chartData.map((d) => `${d.index},${d.label},${d.sales}`),
        "",
        "CONSUMABLES SPENDING",
        "Category,Amount (RWF),% of Sales",
        ...data.consumables.map(
          (c) =>
            `${c.name},${c.amount},${((c.amount / data.kpis.totalSales) * 100).toFixed(1)}%`
        ),
        "",
        "TOP 5 MENU ITEMS",
        "Menu Item,Quantity,Sales (RWF)",
        ...data.topMenuItems.map(
          (item) => `"${item.name}",${item.qty},${item.sales.replace(/,/g, "")}`
        ),
        "",
        "BOTTOM 5 MENU ITEMS",
        "Menu Item,Quantity,Sales (RWF)",
        ...data.bottomMenuItems.map(
          (item) => `"${item.name}",${item.qty},${item.sales.replace(/,/g, "")}`
        ),
        "",
        "STAFF PERFORMANCE",
        "Staff Member,Orders,Sales (RWF)",
        ...data.staffPerformance.map(
          (s) => `"${s.name}",${s.orders},${s.sales.replace(/,/g, "")}`
        ),
        `Total,${data.totalStaffOrdersFormatted},${data.totalStaffSalesFormatted}`,
        "",
        "EXCLUSIONS & AUDIT",
        `Voided Orders,${data.voidedCount},${data.voidedAmountFormatted}`,
        `Refunded Orders,${data.refundedCount},${data.refundedAmountFormatted}`,
      ].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `Bara_Report_${period}_${data.dateLabel.replace(/\s+/g, "_")}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5 pb-10">
      {/* 1. Header Row */}
      <ReportsHeader
        onExport={handleExportCSV}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* 2. Filter Bar */}
      <ReportsFilterBar
        period={period}
        onPeriodChange={handlePeriodChange}
        dateLabel={dateLabel}
        onOpenDatePicker={() => setShowDatePicker(true)}
        isLoading={isLoading}
      />

      {/* Dynamic Content or Skeleton Loading State */}
      {isLoading ? (
        <ReportsSkeleton />
      ) : (
        <>
          {/* 3. 4 Top KPI Cards */}
          <ReportsKPICards kpis={data.kpis} />

          {/* 4. Middle Row: Sales Trend (Linear Area Chart) & Monthly Consumables */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <SalesTrendCard
              data={data.chartData}
              durationBadge={data.durationBadge}
              subtitle={`Daily completed sales · ${data.dateLabel} · RWF`}
              ticks={data.chartTicks}
              tickFormatter={data.chartTickFormatter}
              domain={data.chartDomain}
              yTicks={data.chartYTicks}
            />
            <ConsumablesBreakdownCard
              items={data.consumables}
              totalFormatted={data.consumablesTotalFormatted}
              percentageOfSales={data.consumablesPct}
              comparisonSalesFormatted={data.kpis.totalSalesFormatted}
              footnoteRange={data.dateLabel.split(" ")[0]}
              onLogPurchase={() => setShowConsumableModal(true)}
            />
          </div>

          {/* 5. Bottom Row: 3 Equal-Width Columns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MenuItemsCard
              title="Top 5 menu items"
              subtitle={`Highest sales revenue · ${data.dateLabel}`}
              items={data.topMenuItems}
            />
            <MenuItemsCard
              title="Bottom 5 menu items"
              subtitle="Lowest sales revenue · Items with sales"
              items={data.bottomMenuItems}
            />
            <StaffPerformanceCard
              staffList={data.staffPerformance}
              totalOrdersFormatted={data.totalStaffOrdersFormatted}
              totalSalesFormatted={data.totalStaffSalesFormatted}
            />
          </div>

          {/* 6. Footer Audit Banner */}
          <ReportsAuditBanner
            onViewAuditTrail={() => setShowAuditModal(true)}
            voidedCount={data.voidedCount}
            voidedAmountFormatted={data.voidedAmountFormatted}
            refundedCount={data.refundedCount}
            refundedAmountFormatted={data.refundedAmountFormatted}
          />
        </>
      )}

      {/* Modals */}
      <DateRangePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        initialStart="2026-09-01"
        initialEnd="2026-09-30"
        maxDate="2026-10-06"
        onApply={(start, end, label) => {
          handlePeriodChange("custom", label, { start, end })
        }}
      />

      <ReportsHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <ReportsAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        entries={data.auditEntries}
        voidedOrdersCount={data.voidedCount}
        voidedAmountFormatted={data.voidedAmountFormatted}
        refundedOrdersCount={data.refundedCount}
        refundedAmountFormatted={data.refundedAmountFormatted}
      />

      <LogConsumableModal
        isOpen={showConsumableModal}
        onClose={() => setShowConsumableModal(false)}
        onSuccess={(msg) => {
          showToast(msg)
          loadReportData(period, dateLabel, customRange)
        }}
      />

      {notice && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          <span>{notice}</span>
        </div>
      )}
    </div>
  )
}
