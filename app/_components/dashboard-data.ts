import {
  DashboardKpiData,
  TransactionItem,
  TopPerformerItem,
  WasteAlertItem,
  ConsumableCategory,
  CriticalIngredientsAlertData,
} from "./types"

export const DEFAULT_KPI_DATA: DashboardKpiData = {
  totalSales: {
    amount: 10240000,
    amountFormatted: "10,240,000",
    changePercentage: "+14.2%",
    isPositive: true,
    subtitle: "vs last cycle",
    progressPercent: 78,
  },
  consumables: {
    amount: 3180000,
    amountFormatted: "3,180,000",
    healthBadge: "21.0% Healthy",
    targetSubtitle: "Target: ≤ 32.5%",
    progressPercent: 21,
  },
  profitMargin: {
    amount: 7060000,
    amountFormatted: "7,060,000",
    marginBadge: "69.0%",
    subtitle: "Profit post-Consumables",
    progressPercent: 69,
  },
}

export const DEFAULT_RECENT_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-1",
    title: "Table 8 • Grilled Tilapia & Iced Teas",
    status: "Paid",
    time: "20:12",
    server: "Patrick K.",
    receiptNo: "#BARA-8941",
    amount: 32500,
    amountFormatted: "RWF 32,500",
    paymentMethod: "MTN MoMo",
    dotColor: "bg-amber-500",
  },
  {
    id: "tx-2",
    title: "Table 3 • 2x Cappuccino, Carrot Cake",
    status: "Paid",
    time: "20:04",
    server: "Clarisse M.",
    receiptNo: "#BARA-8940",
    amount: 11200,
    amountFormatted: "RWF 11,200",
    paymentMethod: "Cash",
    dotColor: "bg-emerald-500",
  },
  {
    id: "tx-3",
    title: "Takeaway • Avocado Toast, Cold Brew",
    status: "Paid",
    time: "19:51",
    server: "Front POS",
    receiptNo: "#BARA-8939",
    amount: 9800,
    amountFormatted: "RWF 9,800",
    paymentMethod: "Visa Card",
    dotColor: "bg-blue-500",
  },
  {
    id: "tx-4",
    title: "Table 6 • Nyama Choma Platter & Drinks",
    status: "Paid",
    time: "19:35",
    server: "Patrick K.",
    receiptNo: "#BARA-8938",
    amount: 44000,
    amountFormatted: "RWF 44,000",
    paymentMethod: "MTN MoMo",
    dotColor: "bg-amber-500",
  },
]

export const ALL_MODAL_TRANSACTIONS: TransactionItem[] = [
  ...DEFAULT_RECENT_TRANSACTIONS,
  {
    id: "tx-5",
    title: "Table 2 • Whole Goat Ribs & Primus",
    status: "Paid",
    time: "19:15",
    server: "Clarisse M.",
    receiptNo: "#BARA-8937",
    amount: 28000,
    amountFormatted: "RWF 28,000",
    paymentMethod: "MTN MoMo",
    dotColor: "bg-amber-500",
  },
  {
    id: "tx-6",
    title: "Takeaway • Rwandan Special Coffee & Mandazi",
    status: "Paid",
    time: "18:45",
    server: "Front POS",
    receiptNo: "#BARA-8936",
    amount: 5500,
    amountFormatted: "RWF 5,500",
    paymentMethod: "Cash",
    dotColor: "bg-emerald-500",
  },
  {
    id: "tx-7",
    title: "Table 11 • Grilled Chicken Brochette & Virunga Fries",
    status: "Paid",
    time: "18:20",
    server: "Patrick K.",
    receiptNo: "#BARA-8935",
    amount: 19500,
    amountFormatted: "RWF 19,500",
    paymentMethod: "Airtel Money",
    dotColor: "bg-rose-500",
  },
]

export const DEFAULT_TOP_PERFORMERS: TopPerformerItem[] = [
  {
    id: "perf-1",
    name: "Grilled Lake Tilapia",
    badge: "#1 Revenue",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    orders: 342,
    ordersUnit: "orders",
    avgPrep: "22m",
    revenue: 2907000,
    revenueFormatted: "2,907,000 RWF",
    profitPercent: 72,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "perf-2",
    name: "Signature Beef Brochettes",
    badge: "#1 Velocity",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/40 dark:text-orange-300",
    orders: 410,
    ordersUnit: "orders",
    avgPrep: "14m",
    revenue: 1722000,
    revenueFormatted: "1,722,000 RWF",
    profitPercent: 68,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "perf-3",
    name: "Primus & House Brews",
    badge: "Peak Profit %",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300",
    orders: 580,
    ordersUnit: "servings",
    avgPrep: "Instant pour",
    revenue: 1450000,
    revenueFormatted: "1,450,000 RWF",
    profitPercent: 81,
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=120&auto=format&fit=crop&q=80",
  },
]

export const DEFAULT_WASTE_ALERTS: WasteAlertItem[] = [
  {
    id: "waste-1",
    title: "Passion Fruit Panna Cotta",
    wasteBadge: "35% Waste",
    meta: "Only 12 sold • 35% spoilage rate",
    callout: "Heavy dairy prep loss",
    actionLabel: "Apply 2-for-1 Promo",
    actionType: "promo",
  },
  {
    id: "waste-2",
    title: "Roast Duck Special",
    wasteBadge: "Slow Turnover",
    meta: "8 orders total • 46 min prep bottleneck",
    callout: "6 whole duck carcasses frozen",
    actionLabel: "De-list from POS",
    actionType: "delist",
  },
]

export const CHEF_RECOMMENDATION_NOTE =
  "Chef recommendation: Shift unused duck poultry into weekend brochette special to recapture 94,000 RWF cost."

export const DEFAULT_CONSUMABLES_CATEGORIES: ConsumableCategory[] = [
  {
    id: "cat-1",
    name: "Fresh Meats & Tilapia",
    percentage: 44,
    amountRwf: 1399200,
    amountFormatted: "1,399,200 RWF",
    dotColor: "bg-[#C85A24]",
    barColor: "bg-[#C85A24]",
  },
  {
    id: "cat-2",
    name: "Local Produce & Plantains",
    percentage: 22,
    amountRwf: 699600,
    amountFormatted: "699,600 RWF",
    dotColor: "bg-[#234D3A]",
    barColor: "bg-[#234D3A]",
  },
  {
    id: "cat-3",
    name: "Cooking Oils, Ghee & Dairy",
    percentage: 16,
    amountRwf: 508800,
    amountFormatted: "508,800 RWF",
    dotColor: "bg-[#B8860B]",
    barColor: "bg-[#B8860B]",
  },
  {
    id: "cat-4",
    name: "Kraft Packaging & Napkins",
    percentage: 10,
    amountRwf: 318000,
    amountFormatted: "318,000 RWF",
    dotColor: "bg-[#8C7D73]",
    barColor: "bg-[#8C7D73]",
  },
  {
    id: "cat-5",
    name: "Akabanga Spices & Seasonings",
    percentage: 8,
    amountRwf: 254400,
    amountFormatted: "254,400 RWF",
    dotColor: "bg-[#A52A2A]",
    barColor: "bg-[#A52A2A]",
  },
]

export const DEFAULT_CRITICAL_ALERT: CriticalIngredientsAlertData = {
  titleBadge: "ALERT",
  message: "3 Critical Ingredients Below Threshold: Cassava Flour, Cooking Oil, Goat Meat",
  ingredients: ["Cassava Flour", "Cooking Oil", "Goat Meat"],
}
