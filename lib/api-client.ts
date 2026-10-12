/**
 * Client library for Bara Backend API (OpenAPI 3.0.3)
 * Specification: https://bara-backend-ntmc.onrender.com/api/schema/swagger-ui/
 */

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

export interface SubscriptionPlanItem {
  tier?: "basic" | "pro" | "premium"
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
  tier: "basic" | "pro" | "premium"
  amount: number
  status: "pending_payment" | "active" | "expired" | "cancelled"
  selected_at: string
  starts_at: string | null
  ends_at: string | null
}

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
  // Clear any legacy localStorage tokens
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("bara:auth_tokens")
      window.sessionStorage.removeItem("bara:auth_tokens")
    } catch {
      /* ignore */
    }
  }
}

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

  const response = await fetch(url, {
    ...options,
    headers,
  })

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
            const err = await retryRes.json().catch(() => ({}))
            throw new Error(err.detail || err.message || `HTTP ${retryRes.status}`)
          }
          return (await retryRes.json()) as T
        }
      } catch {
        saveStoredTokens(null)
      }
    }
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || err.message || `HTTP ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return (await response.json()) as T
}

export const authApi = {
  /**
   * POST /api/auth/signup/
   */
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

  /**
   * POST /api/auth/login/
   */
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

  /**
   * POST /api/auth/logout/
   */
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
        /* proceed with client-side cleanup */
      }
    }
    saveStoredTokens(null)
    return { message: "Logged out" }
  },

  /**
   * POST /api/auth/forgot-password/
   */
  forgotPassword: async (email: string): Promise<{ message?: string }> => {
    return apiRequest<{ message?: string }>("/api/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  /**
   * POST /api/auth/reset-password/
   */
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

export const subscriptionApi = {
  /**
   * GET /api/subscription-plans/
   * Requires JWT Bearer
   */
  getPlans: async (): Promise<SubscriptionPlanItem[]> => {
    return apiRequest<SubscriptionPlanItem[]>(
      "/api/subscription-plans/",
      { method: "GET" },
      true
    )
  },

  /**
   * POST /api/subscription-plans/select/
   * Requires JWT Bearer
   */
  selectPlan: async (tier: "basic" | "pro" | "premium"): Promise<{
    message: string
    subscription: SubscriptionRecord
  }> => {
    return apiRequest<{
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
  },
}
