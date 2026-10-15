/**
 * Comprehensive API client for Bara Backend API (OpenAPI 3.0.3)
 * Specification: https://bara-backend-5g84.onrender.com/api/schema/swagger-ui/
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
// GENERIC API REQUEST HELPER WITH TIMEOUT
// ==========================================

export const DEFAULT_REQUEST_TIMEOUT_MS = 40_000 // 40 seconds (generous for Render cold-starts)

export interface ApiRequestOptions extends RequestInit {
  /**
   * Timeout in milliseconds.
   * Defaults to DEFAULT_REQUEST_TIMEOUT_MS (40,000ms / 40s).
   * Set to 0 to disable timeout.
   */
  timeoutMs?: number
}

export class RequestTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(
      `Request timed out after ${Math.round(
        timeoutMs / 1000
      )}s. The server may be waking up or your internet connection was interrupted. Please retry.`
    )
    this.name = "RequestTimeoutError"
  }
}

export class ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string[]>
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data

    if (data && typeof data === "object" && !Array.isArray(data)) {
      const fields: Record<string, string[]> = {}
      for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
        if (Array.isArray(v)) {
          fields[k] = v.map((item) =>
            typeof item === "string" ? item : JSON.stringify(item)
          )
        } else if (typeof v === "string") {
          fields[k] = [v]
        }
      }
      this.fieldErrors = fields
    }
  }
}

export function extractApiErrorMessage(data: unknown, status?: number): string {
  if (!data) {
    return status ? `Server returned error (${status})` : "An unexpected error occurred."
  }

  if (typeof data === "string") {
    const trimmed = data.trim()
    if (trimmed.startsWith("<") || trimmed.includes("Internal Server Error")) {
      return status === 500
        ? "The server encountered a temporary internal error. Please try again in a moment."
        : `Server returned an error (${status || "unknown"}).`
    }
    return trimmed
  }

  if (Array.isArray(data)) {
    const items = data.map((item) => extractApiErrorMessage(item)).filter(Boolean)
    return items.join(" ") || "Invalid request."
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>

    // 1. Direct standard fields
    if (typeof obj.detail === "string" && obj.detail.trim()) {
      return obj.detail.trim()
    }
    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message.trim()
    }
    if (typeof obj.error === "string" && obj.error.trim()) {
      return obj.error.trim()
    }

    // 2. Django non_field_errors
    if (Array.isArray(obj.non_field_errors) && obj.non_field_errors.length > 0) {
      return obj.non_field_errors
        .map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
        .join(" ")
    }
    if (typeof obj.non_field_errors === "string" && obj.non_field_errors.trim()) {
      return obj.non_field_errors.trim()
    }

    // 3. Field-specific errors (e.g. { new_password: ["Password must contain at least one uppercase letter."] })
    const messages: string[] = []
    for (const [key, val] of Object.entries(obj)) {
      if (key === "status" || key === "code" || key === "success") continue

      if (Array.isArray(val)) {
        const msgs = val
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .filter(Boolean)
        if (msgs.length > 0) {
          messages.push(msgs.join(" "))
        }
      } else if (typeof val === "string" && val.trim()) {
        messages.push(val.trim())
      } else if (typeof val === "object" && val !== null) {
        const nested = extractApiErrorMessage(val)
        if (nested) messages.push(nested)
      }
    }

    if (messages.length > 0) {
      return messages.join(" ")
    }
  }

  return status ? `Request failed (${status})` : "Request failed."
}

function createTimeoutSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal | null
): {
  signal: AbortSignal
  cleanup: () => void
  isTimedOut: () => boolean
} {
  const controller = new AbortController()
  let timedOut = false
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true
      try {
        controller.abort(new RequestTimeoutError(timeoutMs))
      } catch {
        controller.abort()
      }
    }, timeoutMs)
  }

  const onExternalAbort = () => {
    if (timeoutId) clearTimeout(timeoutId)
    try {
      controller.abort(externalSignal?.reason)
    } catch {
      controller.abort()
    }
  }

  if (externalSignal) {
    if (externalSignal.aborted) {
      onExternalAbort()
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true })
    }
  }

  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId)
    if (externalSignal) {
      externalSignal.removeEventListener("abort", onExternalAbort)
    }
  }

  return {
    signal: controller.signal,
    cleanup,
    isTimedOut: () => timedOut,
  }
}

let isRedirectingToLogin = false

export function handleSessionExpired() {
  saveStoredTokens(null)
  removeCookie("bara_auth_user")
  setCookie("bara_auth_logged_out", "true", 14)

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("bara:session_expired"))
    } catch {
      /* ignore */
    }

    const pathname = window.location.pathname
    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password")

    if (!isAuthPage && !isRedirectingToLogin) {
      isRedirectingToLogin = true
      window.location.href = "/login?expired=1"
    }
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
  requiresAuth = false
): Promise<T> {
  const {
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    signal: externalSignal,
    ...fetchOptions
  } = options

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (requiresAuth) {
    const tokens = getStoredTokens()
    if (tokens?.access) {
      headers["Authorization"] = `Bearer ${tokens.access}`
    }
  }

  const timeoutHelper = createTimeoutSignal(timeoutMs, externalSignal)

  let response: Response
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: timeoutHelper.signal,
    })
  } catch (netErr: unknown) {
    offlineStore.setStatus("offline")
    if (timeoutHelper.isTimedOut()) {
      throw new RequestTimeoutError(timeoutMs)
    }
    throw new Error(
      netErr instanceof Error ? netErr.message : "Network connection failed"
    )
  } finally {
    timeoutHelper.cleanup()
  }

  // Restore live sync state if we were previously offline and request succeeded
  if (offlineStore.getStatus() === "offline") {
    offlineStore.setStatus("synced")
  }

  // Handle token expiration & refresh
  if (response.status === 401 && requiresAuth) {
    const tokens = getStoredTokens()
    if (tokens?.refresh) {
      try {
        const refreshTimeout = createTimeoutSignal(15_000, externalSignal)
        let refreshRes: Response
        try {
          refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: tokens.refresh }),
            signal: refreshTimeout.signal,
          })
        } finally {
          refreshTimeout.cleanup()
        }

        if (refreshRes.ok) {
          const newTokens: AuthTokens = await refreshRes.json()
          saveStoredTokens(newTokens)
          headers["Authorization"] = `Bearer ${newTokens.access}`

          const retryTimeout = createTimeoutSignal(timeoutMs, externalSignal)
          let retryRes: Response
          try {
            retryRes = await fetch(url, {
              ...fetchOptions,
              headers,
              signal: retryTimeout.signal,
            })
          } finally {
            retryTimeout.cleanup()
          }

          if (!retryRes.ok) {
            if (retryRes.status === 401) {
              handleSessionExpired()
            }
            let retryErrorData: unknown = null
            try {
              const ct = retryRes.headers.get("content-type") || ""
              if (ct.includes("application/json")) {
                retryErrorData = await retryRes.json()
              } else {
                retryErrorData = await retryRes.text()
              }
            } catch {
              retryErrorData = null
            }
            const msg = extractApiErrorMessage(retryErrorData, retryRes.status)
            throw new ApiError(msg, retryRes.status, retryErrorData)
          }
          if (retryRes.status === 204) return {} as T
          return (await retryRes.json()) as T
        } else {
          handleSessionExpired()
        }
      } catch (refreshErr) {
        handleSessionExpired()
        throw refreshErr
      }
    } else {
      handleSessionExpired()
    }
  }

  if (!response.ok) {
    let errorData: unknown = null
    try {
      const ct = response.headers.get("content-type") || ""
      if (ct.includes("application/json")) {
        errorData = await response.json()
      } else {
        errorData = await response.text()
      }
    } catch {
      errorData = null
    }
    const message = extractApiErrorMessage(errorData, response.status)
    throw new ApiError(message, response.status, errorData)
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

  forgotPassword: async (
    email: string,
    options?: ApiRequestOptions
  ): Promise<{ message?: string }> => {
    return apiRequest<{ message?: string }>("/api/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
      timeoutMs: options?.timeoutMs ?? 10_000,
      ...options,
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

  /**
   * Super Admin operation: Performed by the external Bara platform administration system,
   * not within the restaurant tenant web app.
   */
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

// ==========================================
// MENU API
// ==========================================

export interface BackendMenuItem {
  menu_id?: string
  id?: string
  name: string
  description?: string
  price: string | number
  category?: string
  is_available: boolean
  created_at?: string
}

export const menuApi = {
  list: async (): Promise<BackendMenuItem[]> => {
    try {
      const items = await apiRequest<BackendMenuItem[]>("/api/menu/", { method: "GET" }, true)
      if (Array.isArray(items) && items.length > 0) {
        offlineStore.saveMenuItems(items)
        return items
      }
      return offlineStore.getMenuItems()
    } catch {
      return offlineStore.getMenuItems()
    }
  },

  create: async (data: Omit<BackendMenuItem, "menu_id" | "created_at">): Promise<BackendMenuItem> => {
    try {
      const created = await apiRequest<BackendMenuItem>(
        "/api/menu/",
        {
          method: "POST",
          body: JSON.stringify({
            name: data.name,
            description: data.description || "",
            price: String(data.price),
            category: data.category || "Main dishes",
            is_available: data.is_available ?? true,
          }),
        },
        true
      )
      offlineStore.addMenuItem(created)
      return created
    } catch {
      return offlineStore.addMenuItem(data)
    }
  },

  retrieve: async (id: string): Promise<BackendMenuItem> => {
    try {
      return await apiRequest<BackendMenuItem>(`/api/menu/${id}/`, { method: "GET" }, true)
    } catch {
      const all = offlineStore.getMenuItems()
      const found = all.find((m) => m.id === id || m.menu_id === id)
      if (!found) throw new Error("Menu item not found")
      return found
    }
  },

  update: async (id: string, data: Partial<BackendMenuItem>): Promise<BackendMenuItem> => {
    try {
      const body: Record<string, unknown> = {}
      if (data.name !== undefined) body.name = data.name
      if (data.description !== undefined) body.description = data.description
      if (data.price !== undefined) body.price = String(data.price)
      if (data.category !== undefined) body.category = data.category
      if (data.is_available !== undefined) body.is_available = data.is_available

      const updated = await apiRequest<BackendMenuItem>(
        `/api/menu/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
        true
      )
      offlineStore.updateMenuItem(id, updated)
      return updated
    } catch {
      const updated = offlineStore.updateMenuItem(id, data)
      if (!updated) throw new Error("Menu item not found")
      return updated
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<void>(`/api/menu/${id}/`, { method: "DELETE" }, true)
    } catch {
      /* offline fallback */
    }
    offlineStore.deleteMenuItem(id)
  },
}


