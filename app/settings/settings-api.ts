/**
 * Settings & Billing API Client
 * Endpoints for Subscription Plans and Payment Confirmations
 */

import { apiRequest } from "@/lib/api-client"
import { offlineStore } from "@/lib/offline-store"

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

export type PaymentConfirmationStatusEnum = "pending" | "paid" | "rejected"

export interface PaymentConfirmation {
  id: string
  subscription: string
  payer_name: string
  payer_phone: string
  status: PaymentConfirmationStatusEnum
  rejection_reason?: string | null
  submitted_at: string
  verified_by?: string | null
  verified_at?: string | null
}

export interface PaymentConfirmationCreate {
  subscription: string
  payer_name: string
  payer_phone: string
}

export interface PaymentApproval {
  starts_at?: string
  ends_at?: string
}

export interface PaymentRejection {
  rejection_reason: string
}

export const subscriptionApi = {
  getPlans: async (): Promise<SubscriptionPlanItem[]> => {
    try {
      return await apiRequest<SubscriptionPlanItem[]>(
        "/api/restaurant/subscription-plans/",
        { method: "GET" },
        true
      )
    } catch {
      return [
        {
          tier: "basic",
          name: "Basic",
          price: 19000,
          currency: "RWF",
          billing_period: "month",
          features: [
            "1 Till device",
            "Unlimited orders",
            "Basic daily sales reporting",
            "Offline mode support",
          ],
        },
        {
          tier: "pro",
          name: "Pro",
          price: 32000,
          currency: "RWF",
          billing_period: "month",
          features: [
            "Up to 3 devices",
            "Ingredient stock & depletion alerts",
            "Recipe cost tracking",
            "Staff management & PIN logins",
          ],
        },
        {
          tier: "premium",
          name: "Premium",
          price: 49000,
          currency: "RWF",
          billing_period: "month",
          features: [
            "Unlimited devices & stations",
            "Predictive kitchen AI & waste alerts",
            "Multi-branch consolidated reporting",
            "Priority phone & WhatsApp support",
          ],
        },
      ]
    }
  },

  getCurrentSubscription: (): SubscriptionRecord | null => {
    if (typeof window === "undefined") return null
    try {
      const raw = window.localStorage.getItem("bara:current_subscription_record")
      if (raw) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
    return null
  },

  saveCurrentSubscription: (record: SubscriptionRecord): void => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem("bara:current_subscription_record", JSON.stringify(record))
      window.localStorage.setItem("bara:active_subscription_id", record.id)
    } catch {
      /* ignore */
    }
  },

  selectPlan: async (
    tier: SubscriptionTier,
    includeOnboarding = false
  ): Promise<{
    message: string
    subscription: SubscriptionRecord
  }> => {
    try {
      const res = await apiRequest<{
        message: string
        subscription: SubscriptionRecord
      }>(
        "/api/restaurant/subscription-plans/select/",
        {
          method: "POST",
          body: JSON.stringify({ tier, include_onboarding: includeOnboarding }),
        },
        true
      )
      if (res?.subscription) {
        subscriptionApi.saveCurrentSubscription(res.subscription)
      }
      return res
    } catch {
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
      subscriptionApi.saveCurrentSubscription(mockSub)
      return {
        message: "Plan selected successfully (Offline / Local Mode).",
        subscription: mockSub,
      }
    }
  },
}

export const paymentConfirmationsApi = {
  list: async (): Promise<PaymentConfirmation[]> => {
    try {
      const items = await apiRequest<PaymentConfirmation[]>(
        "/api/restaurant/payment-confirmations/",
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
        "/api/restaurant/payment-confirmations/",
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
        `/api/restaurant/payment-confirmations/${id}/approve/`,
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
        `/api/restaurant/payment-confirmations/${id}/reject/`,
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
// RESTAURANT SETUP & BUSINESS DETAILS API
// ==========================================

export interface BackendRestaurantSetup {
  id: string
  name: string
  code: string
  logo: string | null
  tin: string
  trading_name: string
  phone: string
  city: string
  business_address: string
  primary_currency: string
  color_palette?: string
  accent_color?: string
  setup_completed?: boolean
}

export interface BackendRestaurantSetupUpdate {
  tin?: string
  trading_name?: string
  phone?: string
  city?: string
  business_address?: string
  primary_currency?: string
  color_palette?: string
  accent_color?: string
  logo?: string | null
}

export const restaurantSetupApi = {
  getSetup: async (): Promise<BackendRestaurantSetup | null> => {
    try {
      const res = await apiRequest<BackendRestaurantSetup | BackendRestaurantSetup[]>(
        "/api/restaurant/setup/",
        { method: "GET" },
        true
      )
      if (Array.isArray(res)) {
        return res[0] || null
      }
      return res || null
    } catch {
      return null
    }
  },

  updateSetup: async (
    id: string,
    data: BackendRestaurantSetupUpdate
  ): Promise<BackendRestaurantSetup | null> => {
    try {
      return await apiRequest<BackendRestaurantSetup>(
        `/api/restaurant/setup/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        true
      )
    } catch {
      return null
    }
  },
}

// ==========================================
// USER PROFILE & ACCOUNT API
// ==========================================

export interface BackendUserProfile {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone_number?: string
  role: string
  restaurant: string
}

export interface BackendUserProfileUpdate {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
}

export const userProfileApi = {
  getProfile: async (): Promise<BackendUserProfile | null> => {
    try {
      const res = await apiRequest<BackendUserProfile | BackendUserProfile[]>(
        "/api/auth/profile/",
        { method: "GET" },
        true
      )
      if (Array.isArray(res)) {
        return res[0] || null
      }
      return res || null
    } catch {
      return null
    }
  },

  updateProfile: async (
    id: string,
    data: BackendUserProfileUpdate
  ): Promise<BackendUserProfile | null> => {
    try {
      return await apiRequest<BackendUserProfile>(
        `/api/auth/profile/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        true
      )
    } catch {
      return null
    }
  },
}

// ==========================================
// ONBOARDING REQUESTS API
// ==========================================

export interface BackendOnboardingRequest {
  id: string
  restaurant_name: string
  subscription?: string | null
  fee: number
  status: "requested" | "in_progress" | "completed" | "cancelled"
  created_at: string
  updated_at?: string
}

export const onboardingApi = {
  list: async (): Promise<BackendOnboardingRequest[]> => {
    try {
      const res = await apiRequest<BackendOnboardingRequest[]>(
        "/api/restaurant/onboarding-requests/",
        { method: "GET" },
        true
      )
      return Array.isArray(res) ? res : []
    } catch {
      return []
    }
  },

  request: async (): Promise<BackendOnboardingRequest | null> => {
    try {
      return await apiRequest<BackendOnboardingRequest>(
        "/api/restaurant/onboarding-requests/",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        true
      )
    } catch {
      return null
    }
  },

  cancel: async (id: string): Promise<boolean> => {
    try {
      await apiRequest(
        `/api/restaurant/onboarding-requests/${id}/cancel/`,
        { method: "POST" },
        true
      )
      return true
    } catch {
      return false
    }
  },
}

export const settingsApi = {
  subscription: subscriptionApi,
  paymentConfirmations: paymentConfirmationsApi,
  restaurantSetup: restaurantSetupApi,
  userProfile: userProfileApi,
  onboarding: onboardingApi,
}

