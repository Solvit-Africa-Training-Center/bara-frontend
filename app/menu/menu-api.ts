/**
 * Menu API Client
 * Endpoints for Restaurant Menu Items (/api/menu/)
 */

import { apiRequest } from "@/lib/api-client"
import { offlineStore } from "@/lib/offline-store"

export interface BackendRecipeLine {
  id?: string
  ingredient: string
  ingredient_name?: string
  unit?: string
  quantity_used: string | number
  waste_percent?: string | number
}

export interface BackendMenuItem {
  menu_id?: string
  id?: string
  name: string
  description?: string
  price: string | number
  category?: string
  is_available: boolean
  available_servings?: string
  cost_per_serving?: string
  gross_profit?: string
  food_cost_percent?: string
  target_food_cost_percent?: string | number
  recipe_lines?: BackendRecipeLine[]
  created_at?: string
}

export const menuApi = {
  list: async (): Promise<BackendMenuItem[]> => {
    try {
      const items = await apiRequest<BackendMenuItem[]>("/api/menu/", { method: "GET" }, true)
      if (Array.isArray(items)) {
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
      const payload: Record<string, unknown> = {
        name: data.name,
        description: data.description || "",
        price: String(data.price),
        category: data.category || "Main dishes",
        is_available: data.is_available ?? true,
      }
      if (data.recipe_lines) payload.recipe_lines = data.recipe_lines
      if (data.target_food_cost_percent !== undefined) {
        payload.target_food_cost_percent = String(data.target_food_cost_percent)
      }

      const created = await apiRequest<BackendMenuItem>(
        "/api/menu/",
        {
          method: "POST",
          body: JSON.stringify(payload),
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
      if (data.recipe_lines !== undefined) body.recipe_lines = data.recipe_lines
      if (data.target_food_cost_percent !== undefined) {
        body.target_food_cost_percent = String(data.target_food_cost_percent)
      }

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

  refreshAvailability: async (id: string): Promise<BackendMenuItem> => {
    const updated = await apiRequest<BackendMenuItem>(
      `/api/menu/${id}/refresh-availability/`,
      { method: "POST" },
      true
    )
    if (updated?.id || updated?.menu_id) {
      offlineStore.updateMenuItem(id, updated)
    }
    return updated
  },
}
