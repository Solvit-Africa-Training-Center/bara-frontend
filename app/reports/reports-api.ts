/**
 * Reports & Consumables API Client
 * Endpoints for Consumables and Consumable Purchases
 */

import { apiRequest } from "@/lib/api-client"
import { offlineStore } from "@/lib/offline-store"

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

export const reportsApi = {
  consumables: consumablesApi,
  consumablePurchases: consumablePurchasesApi,
}
