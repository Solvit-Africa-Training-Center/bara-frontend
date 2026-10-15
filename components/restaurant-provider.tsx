"use client"

import * as React from "react"
import { loadDraft } from "@/lib/onboarding"
import { useAuth } from "@/components/auth-provider"
import { applyRuntimeTheme } from "@/lib/runtime-theme"
import { getTierFeatures, TierFeatures } from "@/lib/tier-features"

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
  status?: "active" | "grace" | "restricted" | "locked" | "archived"
  graceDaysLeft?: number
  brandColor: string
  logo?: string
  features: TierFeatures
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
  features: TierFeatures
  updateRestaurant: (patch: Partial<Restaurant>) => void
  updateUser: (patch: Partial<CurrentUser>) => void
  switchBranch: (branchName: string) => void
  formatCurrency: (amount: number) => string
  applyTheme: (color?: string) => void
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
  plan: "premium",
  billing: "monthly",
  status: "active",
  brandColor: "#C85A24",
  logo: undefined,
  features: getTierFeatures("premium"),
}

export const DEFAULT_USER: CurrentUser = {
  id: "",
  name: "",
  email: "",
  initials: "",
  role: "Staff",
  avatar: "",
}

const RESTAURANT_STORAGE_KEY = "bara:restaurant_profile"
const USER_STORAGE_KEY = "bara:current_user_profile"

function loadPersistedRestaurant(): Partial<Restaurant> {
  if (typeof window === "undefined") return {}
  let saved: Partial<Restaurant> = {}
  try {
    const raw = window.localStorage.getItem(RESTAURANT_STORAGE_KEY)
    if (raw) {
      saved = JSON.parse(raw) as Partial<Restaurant>
    }
  } catch {
    /* ignore storage errors */
  }

  try {
    const d = loadDraft()
    const name = d.tradingName?.trim() || d.restaurantName?.trim()
    if (name && !saved.name) {
      saved.name = name
      saved.tradingName = d.tradingName?.trim() || name
    }
    if (d.brandColor && !saved.brandColor) {
      saved.brandColor = d.brandColor
    }
    if (d.logoDataUrl && !saved.logo) {
      saved.logo = d.logoDataUrl
    }
    if (d.plan && !saved.plan) {
      saved.plan = d.plan
    }
    if (d.city && !saved.city) saved.city = d.city
    if (d.address && !saved.address) saved.address = d.address
    if (d.phone && !saved.phone) saved.phone = d.phone
    if (d.currency && !saved.currency) saved.currency = d.currency
  } catch {
    /* ignore draft errors */
  }

  const effectivePlan = saved.plan || DEFAULT_RESTAURANT.plan
  saved.features = getTierFeatures(effectivePlan)
  return saved
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

class RestaurantStore {
  private restaurant: Restaurant = DEFAULT_RESTAURANT
  private user: CurrentUser = DEFAULT_USER
  private listeners = new Set<() => void>()
  private initialized = false

  constructor() {
    // Initialization deferred to useEffect in RestaurantProvider to match SSR snapshot
  }

  init() {
    if (this.initialized) return
    this.initialized = true
    const persistedRest = loadPersistedRestaurant()
    const persistedUser = loadPersistedUser()
    const effectivePlan = persistedRest.plan || DEFAULT_RESTAURANT.plan
    this.restaurant = {
      ...DEFAULT_RESTAURANT,
      ...persistedRest,
      features: getTierFeatures(effectivePlan),
    }
    this.user = { ...DEFAULT_USER, ...persistedUser }

    // Apply dynamic runtime theming on init
    applyRuntimeTheme(this.restaurant.brandColor || "#C85A24")

    this.emit()

    if (typeof window !== "undefined") {
      window.addEventListener("storage", () => {
        this.refresh()
      })
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getRestaurantSnapshot = () => this.restaurant
  getRestaurantServerSnapshot = () => DEFAULT_RESTAURANT

  getUserSnapshot = () => this.user
  getUserServerSnapshot = () => DEFAULT_USER

  updateRestaurant = (patch: Partial<Restaurant>) => {
    const nextPlan = patch.plan || this.restaurant.plan
    const nextBrandColor = patch.brandColor || this.restaurant.brandColor

    this.restaurant = {
      ...this.restaurant,
      ...patch,
      features: getTierFeatures(nextPlan),
    }

    // Apply theme at runtime immediately whenever branding or colors change
    if (patch.brandColor || patch.logo !== undefined) {
      applyRuntimeTheme(nextBrandColor)
    }

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(this.restaurant))
      }
    } catch {
      /* storage unavailable */
    }
    this.emit()
  }

  updateUser = (patch: Partial<CurrentUser>) => {
    this.user = { ...this.user, ...patch }
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user))
      }
    } catch {
      /* storage unavailable */
    }
    this.emit()
  }

  refresh = () => {
    const persistedRest = loadPersistedRestaurant()
    const persistedUser = loadPersistedUser()
    const effectivePlan = persistedRest.plan || DEFAULT_RESTAURANT.plan
    this.restaurant = {
      ...DEFAULT_RESTAURANT,
      ...persistedRest,
      features: getTierFeatures(effectivePlan),
    }
    this.user = { ...DEFAULT_USER, ...persistedUser }
    applyRuntimeTheme(this.restaurant.brandColor || "#C85A24")
    this.emit()
  }

  private emit() {
    this.listeners.forEach((l) => l())
  }
}

const store = new RestaurantStore()
const RestaurantContext = React.createContext<RestaurantContextValue | null>(null)

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth()

  React.useEffect(() => {
    store.init()
  }, [])

  React.useEffect(() => {
    if (authUser) {
      store.updateUser({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        initials: authUser.initials,
        role: authUser.role,
        avatar: authUser.avatar,
      })
      if (authUser.restaurantName) {
        store.updateRestaurant({
          name: authUser.restaurantName,
          tradingName: authUser.restaurantName,
        })
      }
      // Fetch and apply that restaurant's configuration and runtime theme upon staff login
      store.refresh()
    }
  }, [authUser])

  const restaurant = React.useSyncExternalStore(
    store.subscribe,
    store.getRestaurantSnapshot,
    store.getRestaurantServerSnapshot
  )

  const user = React.useSyncExternalStore(
    store.subscribe,
    store.getUserSnapshot,
    store.getUserServerSnapshot
  )

  const switchBranch = React.useCallback((branchName: string) => {
    store.updateRestaurant({ activeBranch: branchName })
  }, [])

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

  const applyTheme = React.useCallback(
    (color?: string) => {
      applyRuntimeTheme(color || restaurant.brandColor || "#C85A24")
    },
    [restaurant.brandColor]
  )

  const value = React.useMemo<RestaurantContextValue>(
    () => ({
      restaurant,
      user,
      features: restaurant.features,
      updateRestaurant: store.updateRestaurant,
      updateUser: store.updateUser,
      switchBranch,
      formatCurrency,
      applyTheme,
      refresh: store.refresh,
    }),
    [restaurant, user, switchBranch, formatCurrency, applyTheme]
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