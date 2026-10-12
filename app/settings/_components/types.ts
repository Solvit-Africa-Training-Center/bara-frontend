export interface SubscriptionPlanItem {
  id: "basic" | "pro" | "premium"
  name: string
  tierLabel: string
  badge: string
  priceMonthly: number
  priceAnnual: number
  blurb: string
  features: string[]
  highlight?: boolean
}

export interface InvoiceRecord {
  ref: string
  date: string
  amount: string
  status: "Paid" | "Pending"
  planName: string
}
