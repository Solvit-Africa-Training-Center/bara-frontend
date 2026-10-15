/**
 * Inventory API Client
 * Endpoints for Ingredients and Stock Movements
 */

import { apiRequest } from "@/lib/api-client"
import { offlineStore } from "@/lib/offline-store"

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

export const inventoryApi = {
  ingredients: ingredientsApi,
  stockMovements: stockMovementsApi,
}
