/**
 * Authentication API Client
 * Endpoints for Login, PIN login, Registration, Password Reset, and Session Management
 */

import {
  apiRequest,
  saveStoredTokens,
  getStoredTokens,
  type AuthTokens,
  type ApiRequestOptions,
} from "@/lib/api-client"

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

export const authApi = {
  signup: async (data: {
    first_name: string
    last_name: string
    restaurant_name: string
    email: string
    password: string
    accept_terms: boolean
  }): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>("/api/account/signup/", {
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

  pinLogin: async (pin: string): Promise<LoginResponse> => {
    const res = await apiRequest<LoginResponse>("/api/auth/pin-login/", {
      method: "POST",
      body: JSON.stringify({ pin }),
    })
    if (res.access && res.refresh) {
      saveStoredTokens({ access: res.access, refresh: res.refresh })
    }
    return res
  },

  getProfile: async (options?: ApiRequestOptions): Promise<ApiUser> => {
    return apiRequest<ApiUser>(
      "/api/auth/profile/",
      {
        method: "GET",
        ...options,
      },
      true
    )
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
