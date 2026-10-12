export interface DashboardKpiData {
  totalSales: {
    amount: number
    amountFormatted: string
    changePercentage: string
    isPositive: boolean
    subtitle: string
    progressPercent: number
  }
  consumables: {
    amount: number
    amountFormatted: string
    healthBadge: string
    targetSubtitle: string
    progressPercent: number
  }
  profitMargin: {
    amount: number
    amountFormatted: string
    marginBadge: string
    subtitle: string
    progressPercent: number
  }
}

export type PaymentMethodType = "MTN MoMo" | "Cash" | "Visa Card" | "Airtel Money"

export interface TransactionItem {
  id: string
  title: string
  status: "Paid" | "Pending" | "Void"
  time: string
  server: string
  receiptNo: string
  amount: number
  amountFormatted: string
  paymentMethod: PaymentMethodType
  dotColor: string
}

export interface TopPerformerItem {
  id: string
  name: string
  badge: string
  badgeColor: string
  orders: number
  ordersUnit?: string
  avgPrep: string
  revenue: number
  revenueFormatted: string
  profitPercent: number
  image: string
}

export interface WasteAlertItem {
  id: string
  title: string
  wasteBadge: string
  meta: string
  callout: string
  actionLabel: string
  actionType: "promo" | "delist"
}

export interface ConsumableCategory {
  id: string
  name: string
  percentage: number
  amountRwf: number
  amountFormatted: string
  dotColor: string
  barColor: string
}

export interface CriticalIngredientsAlertData {
  titleBadge: string
  message: string
  ingredients: string[]
}
