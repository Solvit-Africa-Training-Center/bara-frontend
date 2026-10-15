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

  selectPlan: async (
    tier: SubscriptionTier
  ): Promise<{
    message: string
    subscription: SubscriptionRecord
  }> => {
    try {
      return await apiRequest<{
        message: string
        subscription: SubscriptionRecord
      }>(
        "/api/restaurant/subscription-plans/select/",
        {
          method: "POST",
          body: JSON.stringify({ tier }),
        },
        true
      )
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

export const settingsApi = {
  subscription: subscriptionApi,
  paymentConfirmations: paymentConfirmationsApi,
}
