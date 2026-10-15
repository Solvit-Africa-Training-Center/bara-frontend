/**
 * Core API Client & HTTP Transport Engine for Bara Web
 *
 * Modular architecture:
 * - Core HTTP engine, session handling, token storage, and auth endpoints are kept here.
 * - Feature and page-specific APIs are co-located within their respective page directories:
 *   - Users & Staff: app/users/users-api.ts
 *   - Inventory & Stock: app/inventory/inventory-api.ts
 *   - Menu Items: app/menu/menu-api.ts
 *   - Reports & Consumables: app/reports/reports-api.ts
 *   - Settings, Subscriptions & Billing: app/settings/settings-api.ts
 * 
 * All feature APIs and types are re-exported below for backward compatibility.
 */

import { offlineStore } from "./offline-store"

export const API_BASE_URL = (
  typeof window !== "undefined"
    ? ""
    : (process.env.NEXT_PUBLIC_API_URL || "https://shirt-shady-daisy.ngrok-free.dev")
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
// CORE AUTH TYPES & SCHEMAS
// ==========================================

export interface AuthTokens {
  access: string
  refresh: string
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
            headers: {
              "Content-Type": "application/json",
            },
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
// MODULAR PAGE APIS & TYPES RE-EXPORTS
// ==========================================

export * from "@/app/(auth)/auth-api"
export * from "@/app/users/users-api"
export * from "@/app/inventory/inventory-api"
export * from "@/app/menu/menu-api"
export * from "@/app/reports/reports-api"
export * from "@/app/settings/settings-api"
