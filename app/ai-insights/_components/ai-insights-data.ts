import {
  WeeklyHeroInsight,
  AnomalyItem,
  PredictedRestockItem,
  LunchOpportunityData,
  DemandForecastData,
  PresetQuestion,
  StockMovementRecord,
  VoidIncidentRecord,
  HourlyDemandSlot,
} from "./types"

export const DEFAULT_WEEKLY_HERO: WeeklyHeroInsight = {
  titleTag: "YOUR WEEK IN PLAIN LANGUAGE",
  dateRange: "24–30 September",
  headline:
    "Sales improved 8% this week, led by lunch service and grilled dishes. Your strongest day was Saturday. Watch tilapia stock and investigate unusually high cooking-oil usage before the weekend.",
  telemetrySummary:
    "Based on 486 orders, 92 stock movements and 7 days of synced data · High confidence",
  confidence: "high",
}

export const DEFAULT_ANOMALIES: AnomalyItem[] = [
  {
    id: "oil-anomaly",
    title: "Cooking oil usage is 31% above normal",
    severity: "needs_attention",
    severityLabel: "Needs attention",
    description:
      "You used 9.8 L while sales volume only rose 8%. The variance began on Tuesday during evening service.",
    actionLabel: "Review stock movements",
    iconType: "oil",
  },
  {
    id: "void-anomaly",
    title: "Voids increased after 8 PM",
    severity: "watch",
    severityLabel: "Watch",
    description:
      "Seven items were voided this week after 8 PM, compared with your usual two. Five were entered by the same till.",
    actionLabel: "Review void details",
    iconType: "void",
  },
]

export const DEFAULT_RESTOCK_ITEMS: PredictedRestockItem[] = [
  {
    id: "restock-1",
    item: "Tilapia fillet",
    likelyRunOut: "Tomorrow · 14:00",
    suggestedQty: "18 kg",
    estCostRwf: 144000,
    estCostFormatted: "RWF 144,000",
    supplier: "Lake Kivu Fisheries",
    urgent: true,
  },
  {
    id: "restock-2",
    item: "Cooking oil",
    likelyRunOut: "Sat · 10:00",
    suggestedQty: "20 L",
    estCostRwf: 76000,
    estCostFormatted: "RWF 76,000",
    supplier: "Kigali Wholesalers",
    urgent: true,
  },
  {
    id: "restock-3",
    item: "Passion fruit",
    likelyRunOut: "Sun · 08:00",
    suggestedQty: "80 pcs",
    estCostRwf: 48000,
    estCostFormatted: "RWF 48,000",
    supplier: "Gisozi Fresh Produce",
    urgent: false,
  },
  {
    id: "restock-4",
    item: "Beef tenderloin",
    likelyRunOut: "Mon · 12:00",
    suggestedQty: "12 kg",
    estCostRwf: 132000,
    estCostFormatted: "RWF 132,000",
    supplier: "Nyabugogo Meat Supplies",
    urgent: false,
  },
]

export const DEFAULT_LUNCH_OPPORTUNITY: LunchOpportunityData = {
  title: "Lunch opportunity",
  confidenceLabel: "High confidence",
  description:
    "Tuesday and Wednesday lunch orders peak 20 minutes earlier than other days. Preparing brochettes by 11:40 could reduce wait times.",
  actionLabel: "View hourly demand",
}

export const DEFAULT_DESSERT_FORECAST: DemandForecastData = {
  title: "Dessert demand forecast",
  badgeLabel: "Learning",
  description:
    "Not enough consistent dessert sales yet to make a reliable forecast. Keep recording stock and sales for about 12 more days.",
  readinessPercentage: 58,
  daysNeeded: 12,
}

export const DEFAULT_PRESET_QUESTIONS: PresetQuestion[] = [
  {
    question: "Which menu items have rising costs but flat sales?",
    answer:
      "Across the past 30 days, Beef Tenderloin and Whole Grilled Tilapia showed substantial ingredient cost inflation while unit sales plateaued:",
    bullets: [
      "Beef Tenderloin: Raw cost rose +18.2% (14,500 RWF/kg vs 12,270 RWF baseline), but volume was flat at 112 portions/week. Current food cost is 42.1% against your 32.0% target.",
      "Whole Grilled Tilapia: Lake Kivu supply dipped, pushing wholesale fish prices up +14.5% to 8,000 RWF/unit. Menu price remains 18,000 RWF, shrinking gross margin by 2,200 RWF per plate.",
      "Recommendation: Test a slight menu price adjustment to 19,500 RWF on Tilapia, or introduce a signature chimichurri brochette combo to balance beef margins.",
    ],
  },
  {
    question: "Why is cooking oil 31% above normal?",
    answer:
      "Oil consumption jumped from your weekly baseline of 7.5 L to 9.8 L (+31%), starting Tuesday evening:",
    bullets: [
      "Deep Fryer #1 oil was dumped and replaced on Wednesday at 19:15 (3.2 L), 2 days before the routine Friday rotation schedule.",
      "Shift logs show high thermostat settings (205°C instead of standard 180°C) during the fish frying rush, causing premature breakdown of the oil.",
      "Recommended action: Verify fryer thermostat calibration and train evening cooks on oil skimming to extend usage life.",
    ],
  },
  {
    question: "What's the best time to start lunch prep for brochettes?",
    answer:
      "POS service tickets show Tuesday and Wednesday lunch rushes start 20 minutes earlier than Thursdays and Fridays:",
    bullets: [
      "Peak ticket volume hits 11:35 AM on mid-week days due to corporate offices in Nyarutarama taking earlier lunch meetings.",
      "Currently, grill firing begins at 11:30 AM, resulting in average ticket wait times of 24 minutes between 11:45 AM and 12:30 PM.",
      "Moving broiler pre-heating to 11:15 AM and pre-skewering 40 brochettes by 11:40 AM will reduce order turnaround to under 12 minutes.",
    ],
  },
  {
    question: "How do Saturday sales compare to our baseline?",
    answer:
      "Saturday, September 28 was your highest-earning day of the month with exceptional bar and terrace performance:",
    bullets: [
      "Gross revenue reached 2,840,000 RWF (+23% above Saturday average).",
      "Top revenue drivers were Grilled Tilapia Platters (48 orders), Goat Brochettes (112 orders), and Mutzig Draft (84 pints).",
      "Terrace seating turned over 2.4 times between 19:00 and 23:00 with zero stock-outs.",
    ],
  },
]

export const DEFAULT_OIL_MOVEMENTS: StockMovementRecord[] = [
  {
    id: "oil-mov-1",
    timestamp: "Tue Sep 26, 18:30",
    movementType: "Evening shift withdrawal",
    quantity: "5.0 L",
    loggedBy: "Fabrice M.",
  },
  {
    id: "oil-mov-2",
    timestamp: "Wed Sep 27, 19:15",
    movementType: "Mid-week early refill",
    quantity: "3.2 L",
    loggedBy: "Eric T.",
    highlight: true,
  },
  {
    id: "oil-mov-3",
    timestamp: "Thu Sep 28, 12:00",
    movementType: "Lunch station top-up",
    quantity: "1.6 L",
    loggedBy: "Fabrice M.",
  },
]

export const DEFAULT_VOID_INCIDENTS: VoidIncidentRecord[] = [
  {
    id: "void-1",
    time: "20:34",
    till: "Till #2",
    operator: "Claude M.",
    item: "2x Whole Tilapia",
    amountRwf: 36000,
    amountFormatted: "36,000 RWF",
    reason: "Guest changed mind",
  },
  {
    id: "void-2",
    time: "21:10",
    till: "Till #2",
    operator: "Claude M.",
    item: "1x Goat Brochette",
    amountRwf: 14000,
    amountFormatted: "14,000 RWF",
    reason: "Kitchen delay",
  },
  {
    id: "void-3",
    time: "21:45",
    till: "Till #2",
    operator: "Claude M.",
    item: "2x Primus Large",
    amountRwf: 5000,
    amountFormatted: "5,000 RWF",
    reason: "Table re-assigned",
  },
  {
    id: "void-4",
    time: "20:15",
    till: "Till #1",
    operator: "Sarah N.",
    item: "1x Passion Juice",
    amountRwf: 3500,
    amountFormatted: "3,500 RWF",
    reason: "Double punch",
  },
  {
    id: "void-5",
    time: "22:02",
    till: "Till #1",
    operator: "Sarah N.",
    item: "1x Belgian Fries",
    amountRwf: 3000,
    amountFormatted: "3,000 RWF",
    reason: "Out of stock",
  },
]

export const DEFAULT_HOURLY_SLOTS: HourlyDemandSlot[] = [
  { time: "11:00 - 11:30", orders: 8, percentage: 20, note: "Early walk-ins" },
  {
    time: "11:30 - 12:00",
    orders: 24,
    percentage: 60,
    note: "⚡ 20 min early surge",
  },
  {
    time: "12:00 - 12:30",
    orders: 42,
    percentage: 100,
    note: "Peak corporate lunch",
  },
  {
    time: "12:30 - 13:00",
    orders: 38,
    percentage: 90,
    note: "Sustained lunch service",
  },
  { time: "13:00 - 13:30", orders: 19, percentage: 45, note: "Tapering" },
]
