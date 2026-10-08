import type { OnboardingDraft } from "@/lib/onboarding"

export type PlanId = NonNullable<OnboardingDraft["plan"]>
export type Billing = NonNullable<OnboardingDraft["billing"]>
export type Provider = "mtn" | "airtel"

export type SetupData = {
  // account
  firstName: string
  lastName: string
  email: string
  restaurantName: string
  // restaurant
  tradingName: string
  tin: string
  phone: string
  city: string
  address: string
  currency: string
  brandColor: string
  logo?: string
  guided: boolean
  // plan
  plan: PlanId | null
  billing: Billing
  // payment
  provider: Provider
  momoPhone: string
}

export const brandColors = ["#C1440E", "#2F5233", "#E8A33D"]

export const initialData: SetupData = {
  firstName: "",
  lastName: "",
  email: "",
  restaurantName: "",
  tradingName: "",
  tin: "",
  phone: "",
  city: "",
  address: "",
  currency: "RWF",
  brandColor: brandColors[0],
  logo: undefined,
  guided: true,
  plan: null,
  billing: "monthly",
  provider: "mtn",
  momoPhone: "",
}

export const currencies = [
  { code: "RWF", label: "RWF — Rwandan Franc" },
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "KES", label: "KES — Kenyan Shilling" },
  { code: "UGX", label: "UGX — Ugandan Shilling" },
  { code: "TZS", label: "TZS — Tanzanian Shilling" },
]

export const ANNUAL_DISCOUNT = 0.1
export const GUIDED_FEE = 35000
export const MAX_LOGO_BYTES = 5 * 1024 * 1024

export const plans: {
  id: PlanId
  name: string
  badge: string
  price: number
  blurb: string
  features: string[]
  highlight?: boolean
}[] = [
  {
    id: "basic",
    name: "Basic",
    badge: "Essentials",
    price: 19000,
    blurb: "Reliable essentials for a single restaurant.",
    features: [
      "POS",
      "Inventory / stock tracking",
      "Menu and recipe costing",
      "Offline-first sync",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Growing teams",
    price: 32000,
    blurb: "Visibility for growing daily operations.",
    features: [
      "Everything in Basic",
      "Sales reports",
      "Monthly consumables tracking",
      "Performance exports",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    badge: "Recommended",
    price: 49000,
    blurb: "Practical intelligence for better decisions.",
    features: [
      "Everything in Pro",
      "AI data analysis",
      "Anomaly alerts",
      "Restock predictions",
    ],
    highlight: true,
  },
]

export const formatRwf = (n: number) =>
  `RWF ${Math.round(n).toLocaleString("en-US")}`