"use client"

import * as React from "react"
import { loadDraft } from "@/lib/onboarding"

export interface Restaurant {
  id: string
  name: string
  tradingName: string
  branch: string
  branches: string[]
  activeBranch: string
  address: string
  city: string
  phone: string
  currency: string
  currencySymbol: string
  timeZone: string
  kitchenTarget: number
  barTarget: number
  aiAlerts: boolean
  plan: "basic" | "pro" | "premium"
  billing: "monthly" | "annual"
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  initials: string
  role: string
  avatar: string
}

export interface RestaurantContextValue {
  restaurant: Restaurant
  user: CurrentUser
  isLoaded: boolean
  updateRestaurant: (patch: Partial<Restaurant>) => void
  updateUser: (patch: Partial<CurrentUser>) => void
  switchBranch: (branchName: string) => void
  formatCurrency: (amount: number) => string
  refresh: () => void
}

const DEFAULT_BRANCHES = [
  "Bara Bistro - Nyarutarama (Main)",
  "Bara Lounge - Kimihurura",
  "Bara Rooftop - Kiyovu",
]

export const DEFAULT_RESTAURANT: Restaurant = {
  id: "rest-001",
  name: "Bara Bistro & Grill",
  tradingName: "Bara Bistro & Grill",
  branch: "Bara Bistro - Nyarutarama (Main)",
  branches: DEFAULT_BRANCHES,
  activeBranch: "Bara Bistro - Nyarutarama (Main)",
  address: "KG 9 Ave, Nyarutarama, Kigali, Rwanda",
  city: "Kigali",
  phone: "+250 788 123 456",
  currency: "RWF",
  currencySymbol: "RWF",
  timeZone: "Africa/Kigali (GMT+2)",
  kitchenTarget: 32,
  barTarget: 22,
  aiAlerts: true,
  plan: "pro",
  billing: "monthly",
}

export const DEFAULT_USER: CurrentUser = {
  id: "usr-001",
  name: "Alex Rivera",
  email: "alex@barabistro.rw",
  initials: "AR",
  role: "General Manager",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
}

const RESTAURANT_STORAGE_KEY = "bara:restaurant_profile"
const USER_STORAGE_KEY = "bara:current_user_profile"

function loadPersistedRestaurant(): Partial<Restaurant> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(RESTAURANT_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as Partial<Restaurant>
    }
  } catch {
    /* ignore storage errors */
  }

  // Fallback to onboarding draft if present
  try {
    const d = loadDraft()
    const name = d.tradingName?.trim() || d.restaurantName?.trim()
    if (name) {
      return {
        name,
        tradingName: d.tradingName?.trim() || name,
        city: d.city?.trim() || undefined,
        address: d.address?.trim() || undefined,
        phone: d.phone?.trim() || undefined,
        currency: d.currency || undefined,
        plan: d.plan || undefined,
        billing: d.billing || undefined,
      }
    }
  } catch {
    /* ignore draft errors */
  }

  return {}
}

function loadPersistedUser(): Partial<CurrentUser> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as Partial<CurrentUser>
    }
  } catch {
    /* ignore storage errors */
  }

  try {
    const d = loadDraft()
    const first = d.firstName?.trim() ?? ""
    const last = d.lastName?.trim() ?? ""
    if (first || last || d.email) {
      const fullName = `${first} ${last}`.trim()
      return {
        name: fullName || undefined,
        email: d.email || undefined,
        initials: `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || undefined,
      }
    }
  } catch {
    /* ignore draft errors */
  }

  return {}
}

const RestaurantContext = React.createContext<RestaurantContextValue | null>(null)

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurant] = React.useState<Restaurant>(DEFAULT_RESTAURANT)
  const [user, setUser] = React.useState<CurrentUser>(DEFAULT_USER)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const refresh = React.useCallback(() => {
    const persistedRest = loadPersistedRestaurant()
    const persistedUser = loadPersistedUser()
    setRestaurant((prev) => ({ ...prev, ...persistedRest }))
    setUser((prev) => ({ ...prev, ...persistedUser }))
  }, [])

  React.useEffect(() => {
    refresh()
    setIsLoaded(true)
  }, [refresh])

  const updateRestaurant = React.useCallback((patch: Partial<Restaurant>) => {
    setRestaurant((prev) => {
      const next = { ...prev, ...patch }
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(next))
        }
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }, [])

  const updateUser = React.useCallback((patch: Partial<CurrentUser>) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next))
        }
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }, [])

  const switchBranch = React.useCallback(
    (branchName: string) => {
      updateRestaurant({ activeBranch: branchName })
    },
    [updateRestaurant]
  )

  const formatCurrency = React.useCallback(
    (amount: number): string => {
      const curr = restaurant.currency || "RWF"
      const formattedNumber = Math.round(amount).toLocaleString()
      if (curr.includes("USD") || curr === "$") {
        return `$${formattedNumber}`
      }
      if (curr.includes("KES")) {
        return `KSh ${formattedNumber}`
      }
      return `${formattedNumber} RWF`
    },
    [restaurant.currency]
  )

  const value = React.useMemo<RestaurantContextValue>(
    () => ({
      restaurant,
      user,
      isLoaded,
      updateRestaurant,
      updateUser,
      switchBranch,
      formatCurrency,
      refresh,
    }),
    [restaurant, user, isLoaded, updateRestaurant, updateUser, switchBranch, formatCurrency, refresh]
  )

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const ctx = React.useContext(RestaurantContext)
  if (!ctx) {
    throw new Error("useRestaurant must be used inside RestaurantProvider")
  }
  return ctx
}