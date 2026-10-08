export type ReportPeriod = "today" | "week" | "month" | "custom"

export interface ReportSummaryKPIs {
  totalSales: number
  totalSalesFormatted: string
  salesGrowthPct: number
  previousPeriodName: string
  previousPeriodSalesFormatted: string
  completedOrders: number
  completedOrdersFormatted: string
  averageOrderValueFormatted: string
  consumablesSpendingFormatted: string
  consumablesPct: number
}

export interface ChartDataPoint {
  index: number
  label: string
  sales: number
}

export interface ConsumableItem {
  name: string
  amount: number
  percentage: number
}

export interface MenuItemStat {
  name: string
  qty: number
  sales: string
}

export interface StaffStat {
  name: string
  orders: number
  sales: string
}

export interface AuditEntry {
  time: string
  type: "Void" | "Refund"
  reason: string
  amt: string
}

export interface PeriodReportData {
  period: ReportPeriod
  dateLabel: string
  durationBadge: string
  kpis: ReportSummaryKPIs
  chartData: ChartDataPoint[]
  chartTicks: number[]
  chartTickFormatter: (val: number) => string
  chartDomain: [number, number]
  chartYTicks: number[]
  consumables: ConsumableItem[]
  consumablesTotalFormatted: string
  consumablesPct: number
  topMenuItems: MenuItemStat[]
  bottomMenuItems: MenuItemStat[]
  staffPerformance: StaffStat[]
  totalStaffOrdersFormatted: string
  totalStaffSalesFormatted: string
  voidedCount: number
  voidedAmountFormatted: string
  refundedCount: number
  refundedAmountFormatted: string
  auditEntries: AuditEntry[]
}
