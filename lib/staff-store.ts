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
  const firstName = item.first_name || ""
  const lastName = item.last_name || ""
  const name = `${firstName} ${lastName}`.trim() || "Staff Member"
  const avatarInitials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "ST"

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

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: "staff-owner-1",
    name: "Aline Mukamana",
    role: "Owner",
    status: "Active",
    platformAccess: "App + Web",
    avatarInitials: "AM",
    isOwner: true,
    email: "aline@kigaliheightsbistro.rw",
    phone: "+250 788 100 001",
    shiftPin: "1100",
    lastLogin: "Today, 14:20",
    failedPinAttempts: 0,
    createdAt: "2026-08-01T08:00:00Z",
  },
  {
    id: "staff-mgr-1",
    name: "Patrick Mugisha",
    role: "Manager",
    status: "Active",
    platformAccess: "App + Web",
    avatarInitials: "PM",
    email: "patrick@kigaliheightsbistro.rw",
    phone: "+250 788 200 002",
    shiftPin: "2201",
    lastLogin: "Today, 11:45",
    failedPinAttempts: 0,
    createdAt: "2026-08-10T09:30:00Z",
  },
  {
    id: "staff-csh-1",
    name: "Jean Niyonzima",
    role: "Cashier / Waiter",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "JN",
    email: "jean@kigaliheightsbistro.rw",
    phone: "+250 788 300 003",
    shiftPin: "3302",
    lastLogin: "Yesterday, 21:30",
    failedPinAttempts: 0,
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "staff-csh-2",
    name: "Grace Uwase",
    role: "Cashier / Waiter",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "GU",
    email: "grace@kigaliheightsbistro.rw",
    phone: "+250 788 400 004",
    shiftPin: "4403",
    lastLogin: "2 days ago",
    failedPinAttempts: 0,
    createdAt: "2026-08-20T11:15:00Z",
  },
  {
    id: "staff-kit-1",
    name: "Chantal Uwamahoro",
    role: "Kitchen / Stock",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "CU",
    email: "chantal@kigaliheightsbistro.rw",
    phone: "+250 788 700 007",
    shiftPin: "7706",
    lastLogin: "Today, 07:10",
    failedPinAttempts: 0,
    createdAt: "2026-09-01T06:30:00Z",
  },
  {
    id: "staff-kit-2",
    name: "Emmanuel Ishimwe",
    role: "Kitchen / Stock",
    status: "Deactivated",
    platformAccess: "App only",
    avatarInitials: "EI",
    email: "emmanuel@kigaliheightsbistro.rw",
    phone: "+250 788 800 008",
    shiftPin: "8807",
    lastLogin: "2 weeks ago",
    failedPinAttempts: 0,
    deactivatedAt: "2026-09-28T16:00:00Z",
    createdAt: "2026-09-05T07:45:00Z",
  },
]

const STORAGE_KEY = "bara_staff_members_v1"

/**
 * Generates a unique 4-digit PIN (1000-9999) that does not clash with any existing staff PIN
 */
export function generateUniquePin(existingPins: (string | undefined)[]): string {
  const pinSet = new Set(existingPins.filter(Boolean))

  for (let attempt = 0; attempt < 5000; attempt++) {
    // Generate a random 4-digit number
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    if (!pinSet.has(pin)) {
      return pin
    }
  }

  // Fallback to 5-digit PIN if 4-digit space is tight
  return Math.floor(10000 + Math.random() * 90000).toString()
}

/**
 * Loads staff members from local storage or defaults, merging current active owner
 */
export function loadStaffMembers(currentOwner?: { name?: string; email?: string }): StaffMember[] {
  if (typeof window === "undefined") {
    return INITIAL_STAFF_MEMBERS
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let list: StaffMember[] = raw ? JSON.parse(raw) : INITIAL_STAFF_MEMBERS

    // Ensure list has at least one active owner
    const hasOwner = list.some((m) => m.isOwner && m.status === "Active")
    if (!hasOwner && list.length > 0) {
      list[0].isOwner = true
      list[0].role = "Owner"
      list[0].status = "Active"
      list[0].platformAccess = "App + Web"
    }

    // If current owner is authenticated, reflect their name on the primary owner
    if (currentOwner?.name && list.length > 0) {
      const ownerIdx = list.findIndex((m) => m.isOwner)
      if (ownerIdx !== -1) {
        list[ownerIdx] = {
          ...list[ownerIdx],
          name: currentOwner.name,
          email: currentOwner.email || list[ownerIdx].email,
          avatarInitials: currentOwner.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "OW",
        }
      }
    }

    return list
  } catch {
    return INITIAL_STAFF_MEMBERS
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
