export interface WeeklyHeroInsight {
  titleTag: string
  dateRange: string
  headline: string
  telemetrySummary: string
  confidence: "high" | "medium" | "low"
}

export type AnomalySeverity = "needs_attention" | "watch" | "info"

export interface AnomalyItem {
  id: string
  title: string
  severity: AnomalySeverity
  severityLabel: string
  description: string
  actionLabel: string
  iconType: "oil" | "void"
}

export interface PredictedRestockItem {
  id: string
  item: string
  likelyRunOut: string
  suggestedQty: string
  estCostRwf: number
  estCostFormatted: string
  supplier: string
  urgent: boolean
}

export interface LunchOpportunityData {
  title: string
  confidenceLabel: string
  description: string
  actionLabel: string
}

export interface DemandForecastData {
  title: string
  badgeLabel: string
  description: string
  readinessPercentage: number
  daysNeeded: number
}

export interface PresetQuestion {
  question: string
  answer: string
  bullets?: string[]
}

export interface ChatMessage {
  role: "user" | "bara"
  text: string
  bullets?: string[]
}

export interface StockMovementRecord {
  id: string
  timestamp: string
  movementType: string
  quantity: string
  loggedBy: string
  highlight?: boolean
}

export interface VoidIncidentRecord {
  id: string
  time: string
  till: string
  operator: string
  item: string
  amountRwf: number
  amountFormatted: string
  reason: string
}

export interface HourlyDemandSlot {
  time: string
  orders: number
  percentage: number
  note: string
}
