/**
 * Comprehensive API client for Bara Backend API (OpenAPI 3.0.3)
 * Specification: https://bara-backend-ntmc.onrender.com/api/schema/swagger-ui/
 * 
 * Includes full support for:
 * - Authentication (Signup, Login, Logout, Refresh, Forgot/Reset Password)
 * - Subscription Plans & Selection
 * - Payment Confirmations & Verification
 * - Ingredients & Stock Levels
 * - Stock Movements (Stock-in, Stock-out, Waste)
 * - Consumables & Consumable Purchases
 * - Offline-first fallback integration (Section 5.7)
 */

import { offlineStore } from "./offline-store"

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://bara-backend-ntmc.onrender.com"
).replace(/\/+$/, "")

export const ACCESS_TOKEN_COOKIE = "bara_access_token"
export const REFRESH_TOKEN_COOKIE = "bara_refresh_token"

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"))
  return match ? decodeURIComponent(match[3]) : null
}

export function setCookie(name: string, value: string, days = 14) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function removeCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

// ==========================================
// TYPES & SCHEMAS
// ==========================================

export interface AuthTokens {
  access: string
  refresh: string
}

export interface ApiUser {
  id: string
  first_name: string
  last_name: string
  email: string
  restaurant?: {
    id: string
    name: string
    code?: string
  }
}

export interface LoginResponse {
  message: string
  access: string
  refresh: string
  user: ApiUser
}

export interface SignupResponse {
  message: string
  user: ApiUser
}

export type SubscriptionTier = "basic" | "pro" | "premium"
export type SubscriptionStatus = "pending_payment" | "active" | "expired" | "cancelled"

export interface SubscriptionPlanItem {
  tier?: SubscriptionTier
  name: string
  price: number
  currency: string
  billing_period: string
  features: string[]
}

export interface SubscriptionRecord {
  id: string
  restaurant: string
  restaurant_name: string
  tier: SubscriptionTier
  amount: number
  status: SubscriptionStatus
  selected_at: string
  starts_at: string | null
  ends_at: string | null
}

export interface Ingredient {
  id: string
  name: string
  unit: string
  low_stock_threshold: string
  cost_per_unit: string
  current_quantity?: string | number
  created_at: string
  updated_at: string
}

export interface IngredientCreate {
  name: string
  unit: string
  low_stock_threshold: string | number
  cost_per_unit: string | number
}

export type MovementTypeEnum = "in" | "out" | "waste"

export interface StockMovement {
  id: string
  client_uuid?: string | null
  ingredient: string
  ingredient_name?: string
  recorded_by?: string | null
  recorded_by_name?: string
  movement_type: MovementTypeEnum
  quantity: string
  note?: string
  occurred_at: string
  synced_at?: string | null
}

export interface StockMovementCreate {
  ingredient: string
  movement_type: MovementTypeEnum
  quantity: string | number
  note?: string
  client_uuid?: string | null
}

export interface Consumable {
  id: string
  name: string
  category?: string
  created_at: string
}

export interface ConsumableCreate {
  name: string
  category?: string
}

export interface ConsumablePurchase {
  id: string
  consumable: string
  consumable_name?: string
  quantity: string
  cost: string
  purchase_date: string
  note?: string
  created_at: string
}

export interface ConsumablePurchaseCreate {
  consumable: string
  quantity: string | number
  cost: string | number
  purchase_date?: string
  note?: string
}

export type PaymentConfirmationStatusEnum = "pending" | "paid" | "rejected"

export interface PaymentConfirmation {
  id: string
  subscription: string
  payer_name: string
  payer_phone: string
  submitted_at: string
  status: PaymentConfirmationStatusEnum
  verified_by: string | null
  verified_at: string | null
  rejection_reason: string
}

export interface PaymentConfirmationCreate {
  subscription: string
  payer_name: string
  payer_phone: string
}

export interface PaymentApproval {
  starts_at: string
  ends_at: string
}

export interface PaymentRejection {
  rejection_reason: string
}

// ==========================================
// TOKEN STORAGE
// ==========================================

export function getStoredTokens(): AuthTokens | null {
  const access = getCookie(ACCESS_TOKEN_COOKIE)
  const refresh = getCookie(REFRESH_TOKEN_COOKIE)
  if (access && refresh) {
    return { access, refresh }
  }
  return null
}

export function saveStoredTokens(tokens: AuthTokens | null, persistent = true) {
  const days = persistent ? 14 : 1
  if (tokens) {
    setCookie(ACCESS_TOKEN_COOKIE, tokens.access, days)
    setCookie(REFRESH_TOKEN_COOKIE, tokens.refresh, days * 2)
  } else {
    removeCookie(ACCESS_TOKEN_COOKIE)
    removeCookie(REFRESH_TOKEN_COOKIE)
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("bara:auth_tokens")
      window.sessionStorage.removeItem("bara:auth_tokens")
    } catch {
      /* ignore */
    }
  }
}

// ==========================================
// GENERIC API REQUEST HELPER
// ==========================================

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (requiresAuth) {
    const tokens = getStoredTokens()
    if (tokens?.access) {
      headers["Authorization"] = `Bearer ${tokens.access}`
    }
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (netErr: unknown) {
    offlineStore.setStatus("offline")
    throw new Error(
      netErr instanceof Error ? netErr.message : "Network connection failed"
    )
  }

  // Handle token expiration & refresh
  if (response.status === 401 && requiresAuth) {
    const tokens = getStoredTokens()
    if (tokens?.refresh) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: tokens.refresh }),
        })
        if (refreshRes.ok) {
          const newTokens: AuthTokens = await refreshRes.json()
          saveStoredTokens(newTokens)
          headers["Authorization"] = `Bearer ${newTokens.access}`
          const retryRes = await fetch(url, { ...options, headers })
          if (!retryRes.ok) {
            let retryErr: { detail?: string; message?: string } = {}
            try {
              retryErr = await retryRes.json()
            } catch {
              retryErr = { message: `HTTP ${retryRes.status}` }
            }
            throw new Error(retryErr.detail || retryErr.message || `HTTP ${retryRes.status}`)
          }
          if (retryRes.status === 204) return {} as T
          return (await retryRes.json()) as T
        }
      } catch {
        saveStoredTokens(null)
      }
    }
  }

  if (!response.ok) {
    let err: { detail?: string; message?: string } = {}
    try {
      err = await response.json()
    } catch {
      err = { message: `Server returned error (${response.status})` }
    }
    throw new Error(err.detail || err.message || `HTTP ${response.status}`)
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return (await response.json()) as T
}

// ==========================================
// AUTH API
// ==========================================

export const authApi = {
  signup: async (data: {
    first_name: string
    last_name: string
    restaurant_name: string
    email: string
    password: string
    accept_terms: boolean
  }): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>("/api/auth/signup/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  login: async (data: {
    email: string
    password: string
  }): Promise<LoginResponse> => {
    const res = await apiRequest<LoginResponse>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (res.access && res.refresh) {
      saveStoredTokens({ access: res.access, refresh: res.refresh })
    }
    return res
  },

  logout: async (refresh?: string): Promise<{ message?: string }> => {
    const tokens = getStoredTokens()
    const refreshToken = refresh || tokens?.refresh
    if (refreshToken) {
      try {
        await apiRequest<{ message?: string }>("/api/auth/logout/", {
          method: "POST",
          body: JSON.stringify({ refresh: refreshToken }),
        })
      } catch {
        /* ignore */
      }
    }
    saveStoredTokens(null)
    return { message: "Logged out" }
  },

  forgotPassword: async (email: string): Promise<{ message?: string }> => {
    return apiRequest<{ message?: string }>("/api/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (data: {
    email: string
    token: string
    new_password: string
    confirm_password: string
  }): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/api/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// ==========================================
// SUBSCRIPTION API
// ==========================================

export const subscriptionApi = {
  getPlans: async (): Promise<SubscriptionPlanItem[]> => {
    try {
      return await apiRequest<SubscriptionPlanItem[]>(
        "/api/subscription-plans/",
        { method: "GET" },
        true
      )
    } catch {
      // Return predefined catalog fallback
      return [
        {
          tier: "basic",
          name: "Bara Basic",
          price: 19000,
          currency: "RWF",
          billing_period: "month",
          features: [
            "Point of Sale (POS) & offline sync",
            "Inventory & stock tracking",
            "Menu management & recipe costing",
            "Single cashier / manager session",
            "Standard digital receipts",
          ],
        },
        {
          tier: "pro",
          name: "Bara Pro",
          price: 32000,
          currency: "RWF",
          billing_period: "month",
          features: [
            "Everything in Basic",
            "Financial & Sales reports with linear area trends",
            "Monthly consumables breakdown (Gas, Packaging, Supplies)",
            "Role-based staff accounts & shift PINs",
            "Audited voids & refund compliance logs",
          ],
        },
        {
          tier: "premium",
          name: "Bara Premium",
          price: 49000,
          currency: "RWF",
          billing_period: "month",
          features: [
            "Everything in Pro",
            "Automated portion leakage detection & variance audits",
            "Surging ingredient food cost notifications",
            "Dynamic Happy Hour promo suggestions",
            "Weekly operational briefs exportable for management",
            "Restock and inventory depletion predictions",
          ],
        },
      ]
    }
  },

  selectPlan: async (tier: SubscriptionTier): Promise<{
    message: string
    subscription: SubscriptionRecord
  }> => {
    try {
      return await apiRequest<{
        message: string
        subscription: SubscriptionRecord
      }>(
        "/api/subscription-plans/select/",
        {
          method: "POST",
          body: JSON.stringify({ tier }),
        },
        true
      )
    } catch {
      // Local optimistic fallback
      const mockSub: SubscriptionRecord = {
        id: `sub-${Date.now()}`,
        restaurant: "rest-001",
        restaurant_name: "Bara Bistro & Grill",
        tier,
        amount: tier === "basic" ? 19000 : tier === "pro" ? 32000 : 49000,
        status: "pending_payment",
        selected_at: new Date().toISOString(),
        starts_at: null,
        ends_at: null,
      }
      return {
        message: "Plan selected successfully (Offline / Local Mode).",
        subscription: mockSub,
      }
    }
  },
}

// ==========================================
// INGREDIENTS API
// ==========================================

export const ingredientsApi = {
  list: async (): Promise<Ingredient[]> => {
    try {
      const items = await apiRequest<Ingredient[]>(
        "/api/ingredients/",
        { method: "GET" },
        true
      )
      if (Array.isArray(items) && items.length > 0) {
        offlineStore.saveIngredients(items)
        return items
      }
      return offlineStore.getIngredients()
    } catch {
      return offlineStore.getIngredients()
    }
  },

  create: async (data: IngredientCreate): Promise<Ingredient> => {
    try {
      const created = await apiRequest<Ingredient>(
        "/api/ingredients/",
        {
          method: "POST",
          body: JSON.stringify({
            name: data.name,
            unit: data.unit,
            low_stock_threshold: String(data.low_stock_threshold),
            cost_per_unit: String(data.cost_per_unit),
          }),
        },
        true
      )
      offlineStore.addIngredient(created)
      return created
    } catch {
      return offlineStore.addIngredient(data)
    }
  },

  get: async (id: string): Promise<Ingredient> => {
    try {
      return await apiRequest<Ingredient>(`/api/ingredients/${id}/`, { method: "GET" }, true)
    } catch {
      const all = offlineStore.getIngredients()
      const found = all.find((i) => i.id === id)
      if (!found) throw new Error("Ingredient not found")
      return found
    }
  },

  update: async (id: string, data: Partial<IngredientCreate>): Promise<Ingredient> => {
    try {
      const updated = await apiRequest<Ingredient>(
        `/api/ingredients/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        true
      )
      offlineStore.updateIngredient(id, updated)
      return updated
    } catch {
      const updated = offlineStore.updateIngredient(id, data as Partial<Ingredient>)
      if (!updated) throw new Error("Ingredient not found")
      return updated
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<void>(`/api/ingredients/${id}/`, { method: "DELETE" }, true)
    } catch {
      /* offline fallback */
    }
    offlineStore.deleteIngredient(id)
  },

  getStockLevels: async (): Promise<Ingredient[]> => {
    try {
      const res = await apiRequest<Ingredient[] | Ingredient>(
        "/api/ingredients/stock_levels/",
        { method: "GET" },
        true
      )
      if (Array.isArray(res)) return res
      if (res && typeof res === "object") return [res]
      return offlineStore.getIngredients()
    } catch {
      return offlineStore.getIngredients()
    }
  },
}

// ==========================================
// STOCK MOVEMENTS API
// ==========================================

export const stockMovementsApi = {
  list: async (): Promise<StockMovement[]> => {
    try {
      const items = await apiRequest<StockMovement[]>(
        "/api/stock-movements/",
        { method: "GET" },
        true
      )
      if (Array.isArray(items) && items.length > 0) {
        offlineStore.saveStockMovements(items)
        return items
      }
      return offlineStore.getStockMovements()
    } catch {
      return offlineStore.getStockMovements()
    }
  },

  create: async (
    data: StockMovementCreate,
    userDisplayName = "Staff Member"
  ): Promise<StockMovement> => {
    try {
      const created = await apiRequest<StockMovement>(
        "/api/stock-movements/",
        {
          method: "POST",
          body: JSON.stringify({
            ingredient: data.ingredient,
            movement_type: data.movement_type,
            quantity: String(data.quantity),
            note: data.note || "",
            client_uuid: data.client_uuid || `client-uuid-${Date.now()}`,
          }),
        },
        true
      )
      offlineStore.addStockMovement(created, userDisplayName)
      return created
    } catch {
      return offlineStore.addStockMovement(data, userDisplayName)
    }
  },

  get: async (id: string): Promise<StockMovement> => {
    try {
      return await apiRequest<StockMovement>(`/api/stock-movements/${id}/`, { method: "GET" }, true)
    } catch {
      const all = offlineStore.getStockMovements()
      const found = all.find((m) => m.id === id)
      if (!found) throw new Error("Stock movement not found")
      return found
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<void>(`/api/stock-movements/${id}/`, { method: "DELETE" }, true)
    } catch {
      /* offline */
    }
    const current = offlineStore.getStockMovements()
    offlineStore.saveStockMovements(current.filter((m) => m.id !== id))
  },
}

// ==========================================
// CONSUMABLES API
// ==========================================

export const consumablesApi = {
  list: async (): Promise<Consumable[]> => {
    try {
      const items = await apiRequest<Consumable[]>(
        "/api/consumables/",
        { method: "GET" },
        true
      )
      if (Array.isArray(items) && items.length > 0) {
        offlineStore.saveConsumables(items)
        return items
      }
      return offlineStore.getConsumables()
    } catch {
      return offlineStore.getConsumables()
    }
  },

  create: async (data: ConsumableCreate): Promise<Consumable> => {
    try {
      const created = await apiRequest<Consumable>(
        "/api/consumables/",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        true
      )
      offlineStore.addConsumable(created)
      return created
    } catch {
      return offlineStore.addConsumable(data)
    }
  },

  get: async (id: string): Promise<Consumable> => {
    try {
      return await apiRequest<Consumable>(`/api/consumables/${id}/`, { method: "GET" }, true)
    } catch {
      const all = offlineStore.getConsumables()
      const found = all.find((c) => c.id === id)
      if (!found) throw new Error("Consumable not found")
      return found
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<void>(`/api/consumables/${id}/`, { method: "DELETE" }, true)
    } catch {
      /* offline */
    }
    offlineStore.deleteConsumable(id)
  },
}

// ==========================================
// CONSUMABLE PURCHASES API
// ==========================================

export const consumablePurchasesApi = {
  list: async (): Promise<ConsumablePurchase[]> => {
    try {
      const items = await apiRequest<ConsumablePurchase[]>(
        "/api/consumable-purchases/",
        { method: "GET" },
        true
      )
      if (Array.isArray(items) && items.length > 0) {
        offlineStore.saveConsumablePurchases(items)
        return items
      }
      return offlineStore.getConsumablePurchases()
    } catch {
      return offlineStore.getConsumablePurchases()
    }
  },

  create: async (data: ConsumablePurchaseCreate): Promise<ConsumablePurchase> => {
    try {
      const created = await apiRequest<ConsumablePurchase>(
        "/api/consumable-purchases/",
        {
          method: "POST",
          body: JSON.stringify({
            consumable: data.consumable,
            quantity: String(data.quantity),
            cost: String(data.cost),
            purchase_date: data.purchase_date || new Date().toISOString().split("T")[0],
            note: data.note || "",
          }),
        },
        true
      )
      offlineStore.addConsumablePurchase(created)
      return created
    } catch {
      return offlineStore.addConsumablePurchase(data)
    }
  },

  get: async (id: string): Promise<ConsumablePurchase> => {
    try {
      return await apiRequest<ConsumablePurchase>(
        `/api/consumable-purchases/${id}/`,
        { method: "GET" },
        true
      )
    } catch {
      const all = offlineStore.getConsumablePurchases()
      const found = all.find((p) => p.id === id)
      if (!found) throw new Error("Purchase not found")
      return found
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<void>(`/api/consumable-purchases/${id}/`, { method: "DELETE" }, true)
    } catch {
      /* offline */
    }
    offlineStore.deleteConsumablePurchase(id)
  },
}

// ==========================================
// PAYMENT CONFIRMATIONS API
// ==========================================

export const paymentConfirmationsApi = {
  list: async (): Promise<PaymentConfirmation[]> => {
    try {
      const items = await apiRequest<PaymentConfirmation[]>(
        "/api/payment-confirmations/",
        { method: "GET" },
        true
      )
      if (Array.isArray(items) && items.length > 0) {
        offlineStore.savePaymentConfirmations(items)
        return items
      }
      return offlineStore.getPaymentConfirmations()
    } catch {
      return offlineStore.getPaymentConfirmations()
    }
  },

  submit: async (data: PaymentConfirmationCreate): Promise<PaymentConfirmation> => {
    try {
      const res = await apiRequest<PaymentConfirmation>(
        "/api/payment-confirmations/",
        {
          method: "POST",
          body: JSON.stringify({
            subscription: data.subscription,
            payer_name: data.payer_name,
            payer_phone: data.payer_phone,
          }),
        },
        true
      )
      offlineStore.addPaymentConfirmation(res)
      return res
    } catch {
      return offlineStore.addPaymentConfirmation(data)
    }
  },

  approve: async (id: string, data: PaymentApproval): Promise<PaymentConfirmation> => {
    try {
      const res = await apiRequest<PaymentConfirmation>(
        `/api/payment-confirmations/${id}/approve/`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        true
      )
      offlineStore.updatePaymentConfirmationStatus(id, "paid")
      return res
    } catch {
      const updated = offlineStore.updatePaymentConfirmationStatus(id, "paid")
      if (!updated) throw new Error("Payment record not found")
      return updated
    }
  },

  reject: async (id: string, data: PaymentRejection): Promise<PaymentConfirmation> => {
    try {
      const res = await apiRequest<PaymentConfirmation>(
        `/api/payment-confirmations/${id}/reject/`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        true
      )
      offlineStore.updatePaymentConfirmationStatus(id, "rejected", data.rejection_reason)
      return res
    } catch {
      const updated = offlineStore.updatePaymentConfirmationStatus(
        id,
        "rejected",
        data.rejection_reason
      )
      if (!updated) throw new Error("Payment record not found")
      return updated
    }
  },
}
