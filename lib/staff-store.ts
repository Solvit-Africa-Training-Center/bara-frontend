/**
 * Staff Store for Bara Web Dashboard
 * Implements the Users/Staff specifications:
 * - Owner-only staff management
 * - Staff list with name, role, status (Active | Deactivated), and last login
 * - Add staff with unique 4-6 digit PIN generation shown once
 * - Role changes (Manager, Cashier / Waiter, Kitchen / Stock)
 * - Reset PIN flow with unique generation
 * - Deactivate instead of deleting to preserve audit trails (past orders & stock movements)
 * - Minimum one active Owner guarantee
 */

import type { StaffApiItem, ApiStaffRole } from "./api-client"

export type StaffRole = "Owner" | "Manager" | "Cashier / Waiter" | "Kitchen / Stock"
export type StaffStatus = "Active" | "Deactivated"
export type PlatformAccess = "App + Web" | "App only"

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  status: StaffStatus
  platformAccess: PlatformAccess
  avatarInitials: string
  isOwner?: boolean
  email?: string
  phone?: string
  shiftPin?: string
  lastLogin: string
  failedPinAttempts?: number
  deactivatedAt?: string
  createdAt: string
}

export function mapApiStaffToStaffMember(item: StaffApiItem): StaffMember {
  const roleMap: Record<ApiStaffRole, StaffRole> = {
    manager: "Manager",
    cashier: "Cashier / Waiter",
    kitchen: "Kitchen / Stock",
  }
  const role: StaffRole = roleMap[item.role] || "Cashier / Waiter"
  const platformAccess: PlatformAccess = role === "Manager" ? "App + Web" : "App only"
  const firstName = (item.first_name || "").trim()
  const rawLast = (item.last_name || "").trim()
  const lastName = rawLast === "." ? "" : rawLast
  const name = `${firstName} ${lastName}`.trim() || "Staff Member"
  const avatarInitials =
    `${firstName[0] || ""}${lastName[0] || firstName[1] || ""}`.toUpperCase() || "ST"

  return {
    id: item.id,
    name,
    role,
    status: item.is_active ? "Active" : "Deactivated",
    platformAccess,
    avatarInitials,
    isOwner: false,
    email: item.email || undefined,
    phone: item.phone_number,
    shiftPin: item.generated_pin || undefined,
    lastLogin: "Active on till",
    failedPinAttempts: 0,
    createdAt: item.created_at,
  }
}

export function mapStaffRoleToApiRole(role: StaffRole): ApiStaffRole {
  switch (role) {
    case "Manager":
      return "manager"
    case "Kitchen / Stock":
      return "kitchen"
    case "Cashier / Waiter":
    default:
      return "cashier"
  }
}

export const INITIAL_STAFF_MEMBERS: StaffMember[] = []

export function createOwnerMember(user?: {
  id?: string
  name?: string
  email?: string
  phone?: string
}): StaffMember {
  const name = user?.name || "Restaurant Owner"
  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "OW"

  return {
    id: user?.id || "owner-primary",
    name,
    role: "Owner",
    status: "Active",
    platformAccess: "App + Web",
    avatarInitials: initials,
    isOwner: true,
    email: user?.email,
    phone: user?.phone || "",
    lastLogin: "Active now",
    failedPinAttempts: 0,
    createdAt: new Date().toISOString(),
  }
}

const STORAGE_KEY = "bara_staff_members_v2"

const isDemoStaff = (m: StaffMember) =>
  m.id === "staff-owner-1" ||
  m.id === "staff-mgr-1" ||
  m.id === "staff-csh-1" ||
  m.id === "staff-csh-2" ||
  m.id === "staff-kit-1" ||
  m.id === "staff-kit-2" ||
  m.name === "Patrick Mugisha" ||
  m.name === "Jean Niyonzima" ||
  m.name === "Grace Uwase" ||
  m.name === "Chantal Uwamahoro" ||
  m.name === "Emmanuel Ishimwe"

/**
 * Generates a unique 4-digit PIN (1000-9999) that does not clash with any existing staff PIN
 */
export function generateUniquePin(existingPins: (string | undefined)[]): string {
  const pinSet = new Set(existingPins.filter(Boolean))

  for (let attempt = 0; attempt < 5000; attempt++) {
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    if (!pinSet.has(pin)) {
      return pin
    }
  }

  return Math.floor(10000 + Math.random() * 90000).toString()
}

/**
 * Loads staff members from local storage or defaults, merging current active owner
 */
export function loadStaffMembers(currentOwner?: {
  id?: string
  name?: string
  email?: string
  phone?: string
}): StaffMember[] {
  if (typeof window === "undefined") {
    return currentOwner?.name ? [createOwnerMember(currentOwner)] : []
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let list: StaffMember[] = raw ? JSON.parse(raw) : []

    // Strip out all legacy demo records
    list = list.filter((m) => !isDemoStaff(m))

    // Handle Owner
    const ownerMember = createOwnerMember(currentOwner)
    const existingOwnerIndex = list.findIndex((m) => m.isOwner)

    if (existingOwnerIndex !== -1) {
      if (currentOwner?.name) {
        list[existingOwnerIndex] = {
          ...list[existingOwnerIndex],
          id: currentOwner.id || list[existingOwnerIndex].id,
          name: currentOwner.name,
          email: currentOwner.email || list[existingOwnerIndex].email,
          phone: currentOwner.phone || list[existingOwnerIndex].phone,
          avatarInitials: ownerMember.avatarInitials,
        }
      }
    } else if (currentOwner?.name) {
      list.unshift(ownerMember)
    }

    saveStaffMembers(list)
    return list
  } catch {
    return currentOwner?.name ? [createOwnerMember(currentOwner)] : []
  }
}

/**
 * Saves staff members to local storage
 */
export function saveStaffMembers(members: StaffMember[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  } catch {
    // Local storage unavailable or full
  }
}
