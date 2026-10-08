import {
  AuditEntry,
  ChartDataPoint,
  PeriodReportData,
  ReportPeriod,
} from "./types"

export const AUDIT_ENTRIES: AuditEntry[] = [
  { time: "30 Sep 21:14", type: "Void", reason: "Kitchen ticket duplicate", amt: "RWF 14,000" },
  { time: "28 Sep 19:42", type: "Refund", reason: "Spilled drink replacement", amt: "RWF 8,000" },
  { time: "26 Sep 22:05", type: "Void", reason: "Customer changed mind", amt: "RWF 12,500" },
  { time: "23 Sep 14:18", type: "Refund", reason: "Duplicate card swipe", amt: "RWF 22,000" },
  { time: "19 Sep 20:30", type: "Void", reason: "Cashier keying error", amt: "RWF 9,500" },
  { time: "14 Sep 18:22", type: "Refund", reason: "Incorrect bar item dispensed", amt: "RWF 16,000" },
]

// 30 days data matching the exact trajectory from the Figma screenshot
export const SEPTEMBER_DAILY_SALES: ChartDataPoint[] = [
  { index: 1, label: "1 Sep", sales: 220000 },
  { index: 2, label: "2 Sep", sales: 245000 },
  { index: 3, label: "3 Sep", sales: 165000 },
  { index: 4, label: "4 Sep", sales: 235000 },
  { index: 5, label: "5 Sep", sales: 275000 },
  { index: 6, label: "6 Sep", sales: 305000 },
  { index: 7, label: "7 Sep", sales: 330000 },
  { index: 8, label: "8 Sep", sales: 315000 },
  { index: 9, label: "9 Sep", sales: 220000 },
  { index: 10, label: "10 Sep", sales: 245000 },
  { index: 11, label: "11 Sep", sales: 235000 },
  { index: 12, label: "12 Sep", sales: 275000 },
  { index: 13, label: "13 Sep", sales: 330000 },
  { index: 14, label: "14 Sep", sales: 245000 },
  { index: 15, label: "15 Sep", sales: 270000 },
  { index: 16, label: "16 Sep", sales: 260000 },
  { index: 17, label: "17 Sep", sales: 295000 },
  { index: 18, label: "18 Sep", sales: 310000 },
  { index: 19, label: "19 Sep", sales: 385000 },
  { index: 20, label: "20 Sep", sales: 345000 },
  { index: 21, label: "21 Sep", sales: 260000 },
  { index: 22, label: "22 Sep", sales: 275000 },
  { index: 23, label: "23 Sep", sales: 255000 },
  { index: 24, label: "24 Sep", sales: 295000 },
  { index: 25, label: "25 Sep", sales: 315000 },
  { index: 26, label: "26 Sep", sales: 410000 },
  { index: 27, label: "27 Sep", sales: 360000 },
  { index: 28, label: "28 Sep", sales: 295000 },
  { index: 29, label: "29 Sep", sales: 285000 },
  { index: 30, label: "30 Sep", sales: 314000 },
]

export const MONTH_REPORT_DATA: PeriodReportData = {
  period: "month",
  dateLabel: "1–30 September 2026",
  durationBadge: "30 days",
  kpis: {
    totalSales: 8640000,
    totalSalesFormatted: "RWF 8,640,000",
    salesGrowthPct: 8.0,
    previousPeriodName: "August",
    previousPeriodSalesFormatted: "RWF 8,000,000",
    completedOrders: 1080,
    completedOrdersFormatted: "1,080",
    averageOrderValueFormatted: "RWF 8,000",
    consumablesSpendingFormatted: "RWF 432,000",
    consumablesPct: 5.0,
  },
  chartData: SEPTEMBER_DAILY_SALES,
  chartTicks: [1, 7, 14, 21, 30],
  chartTickFormatter: (val: number) => {
    if (val === 1) return "1 Sep"
    if (val === 7) return "7 Sep"
    if (val === 14) return "14 Sep"
    if (val === 21) return "21 Sep"
    if (val === 30) return "30 Sep"
    return ""
  },
  chartDomain: [0, 450000],
  chartYTicks: [0, 150000, 300000, 450000],
  consumables: [
    { name: "Gas", amount: 180000, percentage: 75 },
    { name: "Packaging", amount: 126000, percentage: 53 },
    { name: "Cleaning supplies", amount: 84000, percentage: 35 },
    { name: "Other consumables", amount: 42000, percentage: 18 },
  ],
  consumablesTotalFormatted: "RWF 432,000",
  consumablesPct: 5.0,
  topMenuItems: [
    { name: "Grilled tilapia", qty: 120, sales: "1,440,000" },
    { name: "Beef brochettes", qty: 155, sales: "1,240,000" },
    { name: "Chicken & chips", qty: 132, sales: "1,188,000" },
    { name: "Beef tenderloin", qty: 80, sales: "1,120,000" },
    { name: "Vegetable curry", qty: 110, sales: "660,000" },
  ],
  bottomMenuItems: [
    { name: "Fruit salad", qty: 12, sales: "36,000" },
    { name: "Tomato soup", qty: 14, sales: "56,000" },
    { name: "Vanilla ice cream", qty: 18, sales: "63,000" },
    { name: "Garden salad", qty: 16, sales: "64,000" },
    { name: "Mushroom pasta", qty: 11, sales: "77,000" },
  ],
  staffPerformance: [
    { name: "Jean Niyonzima", orders: 340, sales: "2,720,000" },
    { name: "Grace Uwase", orders: 290, sales: "2,320,000" },
    { name: "Eric Habimana", orders: 250, sales: "2,000,000" },
    { name: "Diane Keza", orders: 200, sales: "1,600,000" },
  ],
  totalStaffOrdersFormatted: "1,080",
  totalStaffSalesFormatted: "8,640,000",
  voidedCount: 12,
  voidedAmountFormatted: "RWF 96,000",
  refundedCount: 8,
  refundedAmountFormatted: "RWF 64,000",
  auditEntries: AUDIT_ENTRIES,
}

export const TODAY_REPORT_DATA: PeriodReportData = {
  period: "today",
  dateLabel: "Today · 6 Oct 2026",
  durationBadge: "Today",
  kpis: {
    totalSales: 288000,
    totalSalesFormatted: "RWF 288,000",
    salesGrowthPct: 12.5,
    previousPeriodName: "Yesterday",
    previousPeriodSalesFormatted: "RWF 256,000",
    completedOrders: 36,
    completedOrdersFormatted: "36",
    averageOrderValueFormatted: "RWF 8,000",
    consumablesSpendingFormatted: "RWF 14,400",
    consumablesPct: 5.0,
  },
  chartData: [
    { index: 1, label: "08:00", sales: 18000 },
    { index: 2, label: "10:00", sales: 26000 },
    { index: 3, label: "12:00", sales: 74000 },
    { index: 4, label: "14:00", sales: 86000 },
    { index: 5, label: "17:00", sales: 32000 },
    { index: 6, label: "20:00", sales: 52000 },
  ],
  chartTicks: [1, 2, 3, 4, 5, 6],
  chartTickFormatter: (val: number) => {
    const labels = ["", "08:00", "10:00", "12:00", "14:00", "17:00", "20:00"]
    return labels[val] || ""
  },
  chartDomain: [0, 100000],
  chartYTicks: [0, 25000, 50000, 100000],
  consumables: [
    { name: "Gas", amount: 6000, percentage: 75 },
    { name: "Packaging", amount: 4200, percentage: 53 },
    { name: "Cleaning supplies", amount: 2800, percentage: 35 },
    { name: "Other consumables", amount: 1400, percentage: 18 },
  ],
  consumablesTotalFormatted: "RWF 14,400",
  consumablesPct: 5.0,
  topMenuItems: [
    { name: "Grilled tilapia", qty: 6, sales: "72,000" },
    { name: "Beef brochettes", qty: 8, sales: "64,000" },
    { name: "Chicken & chips", qty: 5, sales: "45,000" },
    { name: "Beef tenderloin", qty: 3, sales: "42,000" },
    { name: "Vegetable curry", qty: 4, sales: "24,000" },
  ],
  bottomMenuItems: [
    { name: "Fruit salad", qty: 1, sales: "3,000" },
    { name: "Tomato soup", qty: 1, sales: "4,000" },
    { name: "Vanilla ice cream", qty: 2, sales: "7,000" },
    { name: "Garden salad", qty: 1, sales: "4,000" },
    { name: "Mushroom pasta", qty: 1, sales: "7,000" },
  ],
  staffPerformance: [
    { name: "Jean Niyonzima", orders: 12, sales: "96,000" },
    { name: "Grace Uwase", orders: 10, sales: "80,000" },
    { name: "Eric Habimana", orders: 8, sales: "64,000" },
    { name: "Diane Keza", orders: 6, sales: "48,000" },
  ],
  totalStaffOrdersFormatted: "36",
  totalStaffSalesFormatted: "288,000",
  voidedCount: 1,
  voidedAmountFormatted: "RWF 8,000",
  refundedCount: 0,
  refundedAmountFormatted: "RWF 0",
  auditEntries: [
    { time: "Today 13:42", type: "Void", reason: "Customer changed mind", amt: "RWF 8,000" },
  ],
}

export const WEEK_REPORT_DATA: PeriodReportData = {
  period: "week",
  dateLabel: "This Week (28 Sep – 4 Oct 2026)",
  durationBadge: "7 days",
  kpis: {
    totalSales: 2016000,
    totalSalesFormatted: "RWF 2,016,000",
    salesGrowthPct: 5.4,
    previousPeriodName: "Last Week",
    previousPeriodSalesFormatted: "RWF 1,912,000",
    completedOrders: 252,
    completedOrdersFormatted: "252",
    averageOrderValueFormatted: "RWF 8,000",
    consumablesSpendingFormatted: "RWF 100,800",
    consumablesPct: 5.0,
  },
  chartData: [
    { index: 1, label: "Mon", sales: 245000 },
    { index: 2, label: "Tue", sales: 230000 },
    { index: 3, label: "Wed", sales: 260000 },
    { index: 4, label: "Thu", sales: 285000 },
    { index: 5, label: "Fri", sales: 345000 },
    { index: 6, label: "Sat", sales: 385000 },
    { index: 7, label: "Sun", sales: 266000 },
  ],
  chartTicks: [1, 2, 3, 4, 5, 6, 7],
  chartTickFormatter: (val: number) => {
    const days = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days[val] || ""
  },
  chartDomain: [0, 400000],
  chartYTicks: [0, 100000, 200000, 300000, 400000],
  consumables: [
    { name: "Gas", amount: 42000, percentage: 75 },
    { name: "Packaging", amount: 29400, percentage: 53 },
    { name: "Cleaning supplies", amount: 19600, percentage: 35 },
    { name: "Other consumables", amount: 9800, percentage: 18 },
  ],
  consumablesTotalFormatted: "RWF 100,800",
  consumablesPct: 5.0,
  topMenuItems: [
    { name: "Grilled tilapia", qty: 28, sales: "336,000" },
    { name: "Beef brochettes", qty: 35, sales: "280,000" },
    { name: "Chicken & chips", qty: 30, sales: "270,000" },
    { name: "Beef tenderloin", qty: 18, sales: "252,000" },
    { name: "Vegetable curry", qty: 25, sales: "150,000" },
  ],
  bottomMenuItems: [
    { name: "Fruit salad", qty: 3, sales: "9,000" },
    { name: "Tomato soup", qty: 4, sales: "16,000" },
    { name: "Vanilla ice cream", qty: 5, sales: "17,500" },
    { name: "Garden salad", qty: 4, sales: "16,000" },
    { name: "Mushroom pasta", qty: 3, sales: "21,000" },
  ],
  staffPerformance: [
    { name: "Jean Niyonzima", orders: 80, sales: "640,000" },
    { name: "Grace Uwase", orders: 70, sales: "560,000" },
    { name: "Eric Habimana", orders: 58, sales: "464,000" },
    { name: "Diane Keza", orders: 44, sales: "352,000" },
  ],
  totalStaffOrdersFormatted: "252",
  totalStaffSalesFormatted: "2,016,000",
  voidedCount: 3,
  voidedAmountFormatted: "RWF 24,000",
  refundedCount: 2,
  refundedAmountFormatted: "RWF 16,000",
  auditEntries: [
    { time: "4 Oct 21:10", type: "Void", reason: "Kitchen ticket duplicate", amt: "RWF 12,000" },
    { time: "2 Oct 20:15", type: "Refund", reason: "Spilled drink replacement", amt: "RWF 8,000" },
    { time: "29 Sep 19:30", type: "Void", reason: "Customer changed mind", amt: "RWF 12,000" },
  ],
}

export function getReportDataForPeriod(
  period: ReportPeriod,
  customLabel?: string
): PeriodReportData {
  if (period === "today") return TODAY_REPORT_DATA
  if (period === "week") return WEEK_REPORT_DATA
  if (period === "custom" && customLabel) {
    return {
      ...MONTH_REPORT_DATA,
      period: "custom",
      dateLabel: customLabel,
      durationBadge: "Custom",
    }
  }
  return MONTH_REPORT_DATA
}
