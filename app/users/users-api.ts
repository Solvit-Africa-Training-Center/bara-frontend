/**
 * Users & Staff API Client
 * Endpoints under /api/account/ for managing restaurant staff members
 */

import { apiRequest, ApiRequestOptions } from "@/lib/api-client"

export type ApiStaffRole = "manager" | "cashier" | "kitchen"

export interface StaffApiItem {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone_number: string
  role: ApiStaffRole
  password?: string
  generated_pin?: string | null
  is_active: boolean
  created_at: string
}

export interface CreateStaffPayload {
  first_name: string
  last_name: string
  phone_number: string
  role: ApiStaffRole
  email?: string | null
  password?: string
}

export interface UpdateStaffPayload {
  first_name?: string
  last_name?: string
  phone_number?: string
  email?: string | null
}

export const accountApi = {
  getStaff: async (options?: ApiRequestOptions): Promise<StaffApiItem[]> => {
    return apiRequest<StaffApiItem[]>("/api/account/staff/", {
      method: "GET",
      ...options,
    }, true)
  },

  createStaff: async (
    payload: CreateStaffPayload,
    options?: ApiRequestOptions
  ): Promise<StaffApiItem> => {
    return apiRequest<StaffApiItem>("/api/account/staff/", {
      method: "POST",
      body: JSON.stringify(payload),
      ...options,
    }, true)
  },

  getStaffMember: async (
    id: string,
    options?: ApiRequestOptions
  ): Promise<StaffApiItem> => {
    return apiRequest<StaffApiItem>(`/api/account/staff/${id}/`, {
      method: "GET",
      ...options,
    }, true)
  },

  updateStaff: async (
    id: string,
    payload: UpdateStaffPayload,
    options?: ApiRequestOptions
  ): Promise<StaffApiItem> => {
    return apiRequest<StaffApiItem>(`/api/account/staff/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      ...options,
    }, true)
  },

  deactivateStaff: async (
    id: string,
    options?: ApiRequestOptions
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/account/staff/${id}/deactivate/`, {
      method: "POST",
      ...options,
    }, true)
  },
}

export const usersApi = accountApi
export const staffApi = accountApi
