"use client"

import * as React from "react"
import {
  Check,
  Copy,
  Crown,
  HelpCircle,
  Info,
  KeyRound,
  Laptop,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserCog,
  UserX,
  X,
  ChevronDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"
import { useAuth } from "@/components/auth-provider"
import { accountApi, type CreateStaffPayload } from "./users-api"
import { getStoredTokens } from "@/lib/api-client"
import {
  StaffMember,
  StaffRole,
  StaffStatus,
  PlatformAccess,
  loadStaffMembers,
  saveStaffMembers,
  createOwnerMember,
  generateUniquePin,
  mapApiStaffToStaffMember,
  mapStaffRoleToApiRole,
} from "@/lib/staff-store"

function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "")
  if (digits.startsWith("+")) return digits
  if (digits.startsWith("250")) return `+${digits}`
  if (digits.startsWith("0")) return `+250${digits.slice(1)}`
  if (digits.length >= 9) return `+250${digits}`
  return digits ? `+250${digits}` : "+250788000000"
}

export default function UsersPage() {
  const { restaurant } = useRestaurant()
  const { user: authUser } = useAuth()

  // Staff members state with local persistence
  const [staffMembers, setStaffMembers] = React.useState<StaffMember[]>([])
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [isLoadingStaff, setIsLoadingStaff] = React.useState(false)
  const [isSubmittingStaff, setIsSubmittingStaff] = React.useState(false)

  // Filters & search
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("All")
  const [statusFilter, setStatusFilter] = React.useState<string>("All")
  const [toastNotice, setToastNotice] = React.useState<string | null>(null)

  // Modal 1: Add staff member
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [addName, setAddName] = React.useState("")
  const [addRole, setAddRole] = React.useState<StaffRole>("Cashier / Waiter")
  const [addEmail, setAddEmail] = React.useState("")
  const [addPhone, setAddPhone] = React.useState("")
  const [addPassword, setAddPassword] = React.useState("")
  const [addError, setAddError] = React.useState<string | null>(null)

  // Modal 2: PIN Generated - Shown Once
  const [revealedPinMember, setRevealedPinMember] = React.useState<{
    member: StaffMember
    pin: string
    isReset?: boolean
  } | null>(null)
  const [hasCopiedPin, setHasCopiedPin] = React.useState(false)

  // Modal 3: Change Role
  const [roleChangeMember, setRoleChangeMember] = React.useState<StaffMember | null>(null)
  const [newSelectedRole, setNewSelectedRole] = React.useState<StaffRole>("Cashier / Waiter")

  // Modal 4: Reset PIN confirmation
  const [resetPinCandidate, setResetPinCandidate] = React.useState<StaffMember | null>(null)
  const [isResettingPin, setIsResettingPin] = React.useState(false)

  // Modal 5: Deactivate / Reactivate
  const [statusToggleMember, setStatusToggleMember] = React.useState<StaffMember | null>(null)

  // Modal 6: Help / Role guide
  const [showHelpModal, setShowHelpModal] = React.useState(false)

  // Modal 7: Edit staff member info
  const [editMember, setEditMember] = React.useState<StaffMember | null>(null)
  const [editName, setEditName] = React.useState("")
  const [editEmail, setEditEmail] = React.useState("")
  const [editPhone, setEditPhone] = React.useState("")
  const [isSubmittingEdit, setIsSubmittingEdit] = React.useState(false)
  const [editError, setEditError] = React.useState<string | null>(null)

  const openEditModal = (member: StaffMember) => {
    setEditMember(member)
    setEditName(member.name)
    setEditEmail(member.email || "")
    setEditPhone(member.phone || "")
    setEditError(null)
  }

  // Fetch staff from backend (/api/account/staff/)
  const fetchBackendStaff = React.useCallback(async () => {
    const tokens = getStoredTokens()
    if (!tokens?.access) return

    setIsLoadingStaff(true)
    try {
      const apiItems = await accountApi.getStaff()
      if (Array.isArray(apiItems)) {
        const mapped = apiItems.map(mapApiStaffToStaffMember)

        setStaffMembers((prev) => {
          const currentOwner =
            prev.find((m) => m.isOwner) ||
            createOwnerMember({
              id: authUser?.id,
              name: authUser?.name,
              email: authUser?.email,
              phone: authUser?.phone,
            })
          const nonOwners = mapped.filter((m) => m.id !== currentOwner.id)
          const combined = [currentOwner, ...nonOwners]
          saveStaffMembers(combined)
          return combined
        })
      }
    } catch (err: unknown) {
      console.warn("Could not fetch staff from backend, keeping cached records:", err)
    } finally {
      setIsLoadingStaff(false)
    }
  }, [authUser])

  // Load from store on mount and sync with live backend
  React.useEffect(() => {
    const list = loadStaffMembers({
      id: authUser?.id,
      name: authUser?.name,
      email: authUser?.email,
      phone: authUser?.phone,
    })
    setStaffMembers(list)
    setIsInitialized(true)

    fetchBackendStaff()
  }, [authUser, fetchBackendStaff])

  // Sync to store on change
  const updateStaffList = (updater: (prev: StaffMember[]) => StaffMember[]) => {
    setStaffMembers((prev) => {
      const next = updater(prev)
      saveStaffMembers(next)
      return next
    })
  }

  const showToast = (message: string) => {
    setToastNotice(message)
    setTimeout(() => {
      setToastNotice((curr) => (curr === message ? null : curr))
    }, 4000)
  }

  // Summary Metrics
  const totalStaff = staffMembers.length
  const activeStaff = staffMembers.filter((m) => m.status === "Active").length
  const deactivatedStaff = staffMembers.filter((m) => m.status === "Deactivated").length
  const managersAndOwners = staffMembers.filter(
    (m) => m.status === "Active" && (m.role === "Owner" || m.role === "Manager")
  ).length
  const posStaff = staffMembers.filter(
    (m) => m.status === "Active" && (m.role === "Cashier / Waiter" || m.role === "Kitchen / Stock")
  ).length

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
    return staffMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.phone && m.phone.includes(searchQuery))
      const matchesRole = roleFilter === "All" || m.role === roleFilter
      const matchesStatus = statusFilter === "All" || m.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [staffMembers, searchQuery, roleFilter, statusFilter])

  // Handlers
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addName.trim()) return

    const nameParts = addName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || "."
    const formattedPhone = normalizePhoneNumber(addPhone)

    if (addRole === "Manager" && !addEmail.trim()) {
      setAddError("Managers require an email address.")
      return
    }

    if (addRole === "Manager" && (!addPassword || addPassword.length < 8)) {
      setAddError("Manager password must be at least 8 characters.")
      return
    }

    const tokens = getStoredTokens()

    // 1. If backend tokens available, invoke live /api/account/staff/
    if (tokens?.access) {
      setIsSubmittingStaff(true)
      setAddError(null)

      try {
        const apiRole = mapStaffRoleToApiRole(addRole)
        const trimmedEmail = addEmail.trim()
        const payload: CreateStaffPayload = {
          first_name: firstName,
          last_name: lastName || ".",
          phone_number: formattedPhone,
          role: apiRole,
          ...(trimmedEmail ? { email: trimmedEmail.toLowerCase() } : {}),
          ...(addRole === "Manager" && addPassword ? { password: addPassword } : {}),
        }

        const createdItem = await accountApi.createStaff(payload)
        const newStaff = mapApiStaffToStaffMember(createdItem)

        updateStaffList((prev) => [...prev, newStaff])
        setShowAddModal(false)
        setAddName("")
        setAddEmail("")
        setAddPhone("")
        setAddPassword("")
        setAddRole("Cashier / Waiter")
        setAddError(null)

        if (createdItem.generated_pin) {
          setHasCopiedPin(false)
          setRevealedPinMember({
            member: newStaff,
            pin: createdItem.generated_pin,
            isReset: false,
          })
        }
        showToast(
          addRole === "Manager"
            ? `Manager account ${newStaff.name} created! They can log in with their email & password.`
            : `Staff member ${newStaff.name} created!`
        )
        return
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to create staff member."
        setAddError(errorMsg)
        showToast(errorMsg)
        return
      } finally {
        setIsSubmittingStaff(false)
      }
    }

    // 2. Offline fallback mode
    const existingPins = staffMembers.map((m) => m.shiftPin)
    const generatedPin = generateUniquePin(existingPins)

    const platformAccess: PlatformAccess = addRole === "Manager" ? "App + Web" : "App only"
    const initials =
      addName
        .trim()
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "ST"

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: addName.trim(),
      role: addRole,
      status: "Active",
      platformAccess,
      avatarInitials: initials,
      email: addEmail.trim() || undefined,
      phone: formattedPhone,
      shiftPin: generatedPin,
      lastLogin: "Never logged in",
      failedPinAttempts: 0,
      createdAt: new Date().toISOString(),
    }

    updateStaffList((prev) => [...prev, newStaff])
    setShowAddModal(false)
    setAddName("")
    setAddEmail("")
    setAddPhone("")
    setAddPassword("")
    setAddRole("Cashier / Waiter")
    setAddError(null)

    if (addRole !== "Manager") {
      setHasCopiedPin(false)
      setRevealedPinMember({ member: newStaff, pin: generatedPin, isReset: false })
    }
    showToast(`Staff member ${newStaff.name} created (offline mode)!`)
  }

  const handleConfirmRoleChange = () => {
    if (!roleChangeMember) return
    if (roleChangeMember.isOwner) {
      showToast("The Owner role cannot be changed.")
      setRoleChangeMember(null)
      return
    }

    const platformAccess: PlatformAccess = newSelectedRole === "Manager" ? "App + Web" : "App only"
    updateStaffList((prev) =>
      prev.map((m) =>
        m.id === roleChangeMember.id
          ? { ...m, role: newSelectedRole, platformAccess }
          : m
      )
    )
    showToast(`Updated role for ${roleChangeMember.name} to ${newSelectedRole}.`)
    setRoleChangeMember(null)
  }

  const handleConfirmResetPin = async () => {
    if (!resetPinCandidate || isResettingPin) return

    setIsResettingPin(true)
    try {
      const tokens = getStoredTokens()
      let newPin: string | undefined

      // If backend tokens available and candidate has real backend ID, invoke /api/account/staff/{id}/reset-pin/
      if (tokens?.access && !resetPinCandidate.id.startsWith("staff-")) {
        try {
          const res = await accountApi.resetPin(resetPinCandidate.id)
          if (res.generated_pin) {
            newPin = res.generated_pin
          }
        } catch (err: unknown) {
          console.warn("Backend PIN reset failed, falling back to local:", err)
        }
      }

      if (!newPin) {
        const otherPins = staffMembers
          .filter((m) => m.id !== resetPinCandidate.id)
          .map((m) => m.shiftPin)
        newPin = generateUniquePin(otherPins)
      }

      updateStaffList((prev) =>
        prev.map((m) =>
          m.id === resetPinCandidate.id
            ? { ...m, shiftPin: newPin, failedPinAttempts: 0 }
            : m
        )
      )

      const memberCopy = { ...resetPinCandidate, shiftPin: newPin }
      setResetPinCandidate(null)
      setHasCopiedPin(false)
      setRevealedPinMember({ member: memberCopy, pin: newPin, isReset: true })
      showToast(`Generated a new PIN for ${memberCopy.name}.`)
    } finally {
      setIsResettingPin(false)
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editMember) return
    if (!editName.trim()) {
      setEditError("Staff name cannot be empty.")
      return
    }

    const nameParts = editName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || "."
    const formattedPhone = normalizePhoneNumber(editPhone)
    const trimmedEmail = editEmail.trim()

    if (editMember.role === "Manager" && !trimmedEmail) {
      setEditError("Managers require an email address.")
      return
    }

    setIsSubmittingEdit(true)
    setEditError(null)

    const tokens = getStoredTokens()
    const isBackendId = tokens?.access && !editMember.id.startsWith("staff-") && !editMember.isOwner

    if (isBackendId) {
      try {
        const payload = {
          first_name: firstName,
          last_name: lastName,
          phone_number: formattedPhone,
          email: trimmedEmail ? trimmedEmail.toLowerCase() : "",
        }
        const updatedApiItem = await accountApi.updateStaff(editMember.id, payload)
        const updatedMember = mapApiStaffToStaffMember(updatedApiItem)
        updateStaffList((prev) =>
          prev.map((m) => (m.id === editMember.id ? updatedMember : m))
        )
        setEditMember(null)
        showToast(`Staff information for ${updatedMember.name} updated!`)
        return
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to update staff member."
        setEditError(errorMsg)
        showToast(errorMsg)
        return
      } finally {
        setIsSubmittingEdit(false)
      }
    }

    // Local / Offline fallback update (or Owner profile update)
    const initials =
      editName
        .trim()
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase() || "ST"

    const updatedLocally: StaffMember = {
      ...editMember,
      name: editName.trim(),
      email: trimmedEmail || undefined,
      phone: formattedPhone,
      avatarInitials: initials,
    }

    updateStaffList((prev) =>
      prev.map((m) => (m.id === editMember.id ? updatedLocally : m))
    )
    setEditMember(null)
    setIsSubmittingEdit(false)
    showToast(`Staff information for ${updatedLocally.name} updated!`)
  }

  const handleConfirmToggleStatus = async () => {
    if (!statusToggleMember) return
    if (statusToggleMember.isOwner) {
      showToast("The restaurant must always have at least one active Owner.")
      setStatusToggleMember(null)
      return
    }

    const isCurrentlyActive = statusToggleMember.status === "Active"
    const nextStatus: StaffStatus = isCurrentlyActive ? "Deactivated" : "Active"

    // If deactivating on live backend (/api/account/staff/{id}/deactivate/)
    const tokens = getStoredTokens()
    if (isCurrentlyActive && tokens?.access && !statusToggleMember.id.startsWith("staff-")) {
      try {
        await accountApi.deactivateStaff(statusToggleMember.id)
      } catch (err: unknown) {
        console.warn("Backend deactivation failed, applying locally:", err)
      }
    }

    updateStaffList((prev) =>
      prev.map((m) =>
        m.id === statusToggleMember.id
          ? {
              ...m,
              status: nextStatus,
              deactivatedAt: isCurrentlyActive ? new Date().toISOString() : undefined,
            }
          : m
      )
    )

    if (isCurrentlyActive) {
      showToast(
        `${statusToggleMember.name} has been deactivated. Past audit trails remain preserved.`
      )
    } else {
      showToast(`${statusToggleMember.name} is now reactivated with POS access.`)
    }
    setStatusToggleMember(null)
  }

  const handleCopyPin = (pin: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(pin)
      setHasCopiedPin(true)
      setTimeout(() => setHasCopiedPin(false), 2500)
    }
  }

  const restaurantDisplayName =
    restaurant.tradingName || restaurant.name || "Kigali Heights Bistro"

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Toast Alert */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-primary text-primary-foreground px-4 py-3 shadow-lg border border-primary/40 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="size-4 text-primary-foreground/90 shrink-0 stroke-[2.5]" />
          <span className="text-xs font-medium">{toastNotice}</span>
          <button
            onClick={() => setToastNotice(null)}
            className="ml-2 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF5EE]">
              Users &amp; Staff
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold">
              <ShieldCheck className="size-3 text-primary" />
              <span>Owner only</span>
            </span>
          </div>
          <p className="text-xs text-[#78716C] dark:text-[#A89A90] mt-1">
            Manage your restaurant team, assign operational roles, and issue unique tablet login PINs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchBackendStaff()}
            disabled={isLoadingStaff}
            className="size-9.5 rounded-xl border border-[#E5E0D5] dark:border-border/60 bg-white dark:bg-card flex items-center justify-center text-[#78716C] hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh staff list from cloud backend"
          >
            <RefreshCw className={cn("size-4", isLoadingStaff && "animate-spin text-primary")} />
          </button>

          {/* Add Staff Button */}
          <Button
            onClick={() => {
              setAddName("")
              setAddEmail("")
              setAddPhone("")
              setAddPassword("")
              setAddRole("Cashier / Waiter")
              setAddError(null)
              setShowAddModal(true)
            }}
            className="h-9.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add staff</span>
          </Button>

          {/* Help question button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="size-9.5 rounded-xl border border-[#E5E0D5] dark:border-border/60 bg-white dark:bg-card flex items-center justify-center text-[#78716C] hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            title="Help & access roles"
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Team members (Dynamic Theme Brand Color) */}
        <div className="rounded-2xl bg-primary text-primary-foreground p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-primary-foreground/80 font-medium">Total Staff Enrolled</span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-primary-foreground">
              {totalStaff}
            </span>
          </div>
          <span className="text-xs text-primary-foreground/80 truncate">
            {restaurantDisplayName}
          </span>
        </div>

        {/* Card 2: Active staff */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Active Staff
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {activeStaff}
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Authorized to log in to POS &amp; Web
          </span>
        </div>

        {/* Card 3: Deactivated staff */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Deactivated Staff
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#78716C] dark:text-muted-foreground">
              {deactivatedStaff}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            Audit history &amp; order logs preserved
          </span>
        </div>

        {/* Card 4: Web + App Managers */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Web &amp; Management Access
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {managersAndOwners}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            {posStaff} POS tablet-only staff
          </span>
        </div>
      </div>

      {/* Staff Table Card */}
      <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border shadow-xs overflow-hidden">
        {/* Top toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F0ECE1] dark:border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1C1917] dark:text-foreground">
                Staff Roster
              </h2>
              <span className="text-xs text-[#78716C] dark:text-muted-foreground">
                ({filteredMembers.length} staff member{filteredMembers.length === 1 ? "" : "s"})
              </span>
            </div>
            <p className="text-xs text-[#78716C] dark:text-muted-foreground mt-0.5">
              Unique PIN-only authentication on shared Android tablets ensures accurate order attribution.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search by name */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#A8A29E] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff name..."
                className="h-8.5 w-44 sm:w-56 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border pl-8.5 pr-3 text-xs text-foreground placeholder:text-[#A8A29E] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Role filter dropdown */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8.5 pl-3 pr-8 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="All">All roles</option>
                <option value="Owner">Owner</option>
                <option value="Manager">Manager</option>
                <option value="Cashier / Waiter">Cashier / Waiter</option>
                <option value="Kitchen / Stock">Kitchen / Stock</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C] pointer-events-none" />
            </div>

            {/* Status filter dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8.5 pl-3 pr-8 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="All">All status</option>
                <option value="Active">Active</option>
                <option value="Deactivated">Deactivated</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-muted/30 border-b border-[#EBE7DF] dark:border-border text-[#78716C]">
                <th className="py-3 pl-5 font-semibold text-[11px] uppercase tracking-wider">
                  STAFF NAME
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  ROLE
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  STATUS
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  LAST LOGIN
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  PLATFORM ACCESS
                </th>
                <th className="py-3 pr-5 text-right font-semibold text-[11px] uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE6] dark:divide-border/40">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className={cn(
                    "hover:bg-[#FAF8F5]/60 dark:hover:bg-muted/20 transition-colors",
                    member.status === "Deactivated" && "opacity-60 bg-muted/10"
                  )}
                >
                  {/* Name Column */}
                  <td className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none",
                          member.isOwner
                            ? "bg-[#D97706] text-white shadow-xs"
                            : member.status === "Deactivated"
                            ? "bg-muted text-muted-foreground"
                            : "bg-[#EDE7DD] dark:bg-muted text-[#574F45] dark:text-muted-foreground font-semibold"
                        )}
                      >
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#1C1917] dark:text-foreground flex items-center gap-2">
                          <span>{member.name}</span>
                          {member.status === "Deactivated" && (
                            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              Deactivated
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#78716C] dark:text-muted-foreground">
                          {member.isOwner
                            ? "Primary Account Owner · Superadmin"
                            : member.email || member.phone || "No contact info provided"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="py-3.5 px-4">
                    {member.isOwner ? (
                      <div className="inline-flex items-center gap-1.5 font-bold text-xs text-[#1C1917] dark:text-foreground">
                        <Crown className="size-3.5 text-amber-500 fill-amber-500" />
                        <span>Owner</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-[#1C1917] dark:text-foreground">
                        {member.role}
                      </span>
                    )}
                  </td>

                  {/* Status Column (Active or Deactivated) */}
                  <td className="py-3.5 px-4">
                    {member.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF5EC] border border-[#C6E6CD] text-[#1E743A] text-xs font-semibold">
                        <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium">
                        <UserX className="size-3 text-muted-foreground" />
                        <span>Deactivated</span>
                      </span>
                    )}
                  </td>

                  {/* Last Login Column */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium text-[#78716C] dark:text-muted-foreground">
                      {member.lastLogin}
                    </span>
                  </td>

                  {/* Platform Access Column */}
                  <td className="py-3.5 px-4">
                    {member.platformAccess === "App + Web" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] dark:text-foreground">
                        <Laptop className="size-3.5 text-primary" />
                        <span>App + Web</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#78716C] dark:text-muted-foreground">
                        <Smartphone className="size-3.5 text-[#A8A29E]" />
                        <span>POS Tablet only</span>
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 pr-5 text-right">
                    {member.isOwner ? (
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Edit your contact info"
                        >
                          <Pencil className="size-3 text-primary" />
                          <span>Edit info</span>
                        </button>
                        <span className="inline-flex items-center gap-1 text-xs text-[#78716C] font-medium justify-end">
                          <Lock className="size-3.5 text-[#A8A29E]" />
                          <span>Protected</span>
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* Quick action: Reset PIN */}
                        <button
                          onClick={() => setResetPinCandidate(member)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          Reset PIN
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button
                                className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-[#78716C] hover:text-foreground transition-colors cursor-pointer"
                                title="Staff options"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem
                              onClick={() => openEditModal(member)}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <Pencil className="size-3.5 text-muted-foreground" />
                              <span>Edit info</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setRoleChangeMember(member)
                                setNewSelectedRole(member.role)
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <UserCog className="size-3.5 text-muted-foreground" />
                              <span>Change role</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setResetPinCandidate(member)}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <KeyRound className="size-3.5 text-muted-foreground" />
                              <span>Reset login PIN</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {member.status === "Active" ? (
                              <DropdownMenuItem
                                onClick={() => setStatusToggleMember(member)}
                                className="gap-2 cursor-pointer text-xs text-amber-700 dark:text-amber-400"
                              >
                                <UserX className="size-3.5" />
                                <span>Deactivate staff</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setStatusToggleMember(member)}
                                className="gap-2 cursor-pointer text-xs text-emerald-700 dark:text-emerald-400 font-semibold"
                              >
                                <UserCheck className="size-3.5" />
                                <span>Reactivate staff</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No team members found matching your search.
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setRoleFilter("All")
                          setStatusFilter("All")
                        }}
                        className="h-8 text-xs rounded-lg cursor-pointer"
                      >
                        Reset filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 px-5 bg-[#FAF8F5]/60 dark:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#EBE7DF] dark:border-border text-xs text-[#78716C]">
          <div>
            Showing {filteredMembers.length} staff member{filteredMembers.length === 1 ? "" : "s"}
          </div>
          <div className="flex items-center gap-1.5 text-[#78716C]">
            <Info className="size-3.5 text-[#A8A29E]" />
            <span>Deactivated staff retain full order &amp; stock movement audit trails.</span>
          </div>
        </div>
      </div>

      {/* Modal 1: Add Staff Member */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Staff Member</DialogTitle>
            <DialogDescription className="text-xs">
              Add a team member to {restaurantDisplayName}. A unique 4-digit PIN will be generated for POS tablet login.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStaffSubmit} className="space-y-4 mt-2">
            {addError && (
              <div className="rounded-xl border border-rose-200/60 bg-rose-50/70 dark:bg-rose-950/30 p-2.5 text-xs text-rose-700 dark:text-rose-300">
                {addError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground">
                Staff Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Mugisha"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">
                Staff Role <span className="text-red-500">*</span>
              </label>
              <select
                value={addRole}
                onChange={(e) => setAddRole(e.target.value as StaffRole)}
                className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Cashier / Waiter">Cashier / Waiter (POS App only)</option>
                <option value="Kitchen / Stock">Kitchen / Stock (POS App only)</option>
                <option value="Manager">Manager (POS App + Web Dashboard)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Phone (MoMo / WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+250 788 000 000"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Email {addRole === "Manager" ? <span className="text-red-500">*</span> : "(Optional)"}
                </label>
                <input
                  type="email"
                  required={addRole === "Manager"}
                  placeholder="staff@restaurant.rw"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {addRole === "Manager" && (
              <div>
                <label className="text-xs font-bold text-foreground">
                  Manager Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="•••••••• (Min. 8 characters)"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Managers log in with email and password to access the web dashboard and POS tablet.
                </p>
              </div>
            )}

            {/* Access preview banner */}
            <div className="rounded-xl border border-[#EBE7DF] dark:border-border p-3 bg-[#FAF8F5] dark:bg-muted/30 flex items-center gap-3">
              {addRole === "Manager" ? (
                <Laptop className="size-5 text-primary shrink-0" />
              ) : (
                <Smartphone className="size-5 text-primary shrink-0" />
              )}
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-foreground">
                  {addRole === "Manager" ? "App + Web Access" : "Shared POS Tablet Only"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {addRole === "Manager"
                    ? "Can manage ingredients, menu items, and view reports on web."
                    : "Logs in with a fast 4-digit PIN on shared Android tablets."}
                </p>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmittingStaff}
                onClick={() => setShowAddModal(false)}
                className="h-9 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingStaff}
                className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isSubmittingStaff ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : addRole === "Manager" ? (
                  "Create Manager Account"
                ) : (
                  "Generate PIN & Add Staff"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: PIN Generated - Shown Once */}
      <Dialog
        open={Boolean(revealedPinMember)}
        onOpenChange={(open) => {
          if (!open) setRevealedPinMember(null)
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto size-12 rounded-2xl bg-[#EAF5EC] dark:bg-emerald-950/40 border border-[#C6E6CD] dark:border-emerald-900/60 flex items-center justify-center text-[#1E743A] dark:text-emerald-400 mb-2">
              <KeyRound className="size-6 stroke-[2]" />
            </div>
            <DialogTitle className="text-base font-bold">
              {revealedPinMember?.isReset ? "New PIN Generated" : "Staff Member Created"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Login PIN for{" "}
              <strong className="text-foreground font-semibold">
                {revealedPinMember?.member.name}
              </strong>{" "}
              ({revealedPinMember?.member.role})
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-4">
            {/* PIN Card */}
            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 dark:bg-muted/40 p-6 text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                4-Digit POS Shift PIN
              </span>

              <div className="flex items-center justify-center gap-3">
                {revealedPinMember?.pin.split("").map((digit, i) => (
                  <div
                    key={i}
                    className="size-12 rounded-xl bg-white dark:bg-card border border-[#E5E0D5] dark:border-border flex items-center justify-center text-2xl font-bold font-mono text-[#1C1917] dark:text-foreground shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <Button
                  type="button"
                  onClick={() => revealedPinMember && handleCopyPin(revealedPinMember.pin)}
                  variant="outline"
                  className="h-8 rounded-lg text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  {hasCopiedPin ? (
                    <>
                      <Check className="size-3.5 text-emerald-600 stroke-[2.5]" />
                      <span className="text-emerald-600">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy PIN</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Shown once warning banner */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Important: Shown once for security</p>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  Share this PIN directly with {revealedPinMember?.member.name}. It cannot be viewed
                  again after closing this window. You can reset it anytime as Owner.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setRevealedPinMember(null)}
              className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
            >
              I have shared / saved this PIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Change Role */}
      <Dialog
        open={Boolean(roleChangeMember)}
        onOpenChange={(open) => {
          if (!open) setRoleChangeMember(null)
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Change Staff Role</DialogTitle>
            <DialogDescription className="text-xs">
              Update role and system permissions for{" "}
              <strong className="text-foreground">{roleChangeMember?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Select New Role</label>
              <select
                value={newSelectedRole}
                onChange={(e) => setNewSelectedRole(e.target.value as StaffRole)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="Cashier / Waiter">Cashier / Waiter (POS App only)</option>
                <option value="Kitchen / Stock">Kitchen / Stock (POS App only)</option>
                <option value="Manager">Manager (POS App + Web Dashboard)</option>
              </select>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1">
              <p className="font-semibold text-foreground">Role Permissions Summary:</p>
              {newSelectedRole === "Manager" ? (
                <p className="text-muted-foreground text-[11px]">
                  Managers can access both the POS Android App and this Web Dashboard to adjust menu
                  items, ingredients, and view sales reports.
                </p>
              ) : newSelectedRole === "Cashier / Waiter" ? (
                <p className="text-muted-foreground text-[11px]">
                  Waitstaff &amp; cashiers take orders, print tickets, and apply payments on shared
                  tablets with their assigned shift PIN.
                </p>
              ) : (
                <p className="text-muted-foreground text-[11px]">
                  Kitchen staff view incoming ticket orders and log stock-in, stock-out, and waste
                  events on the tablet.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleChangeMember(null)}
              className="h-9 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRoleChange}
              className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Reset PIN Confirmation */}
      <Dialog
        open={Boolean(resetPinCandidate)}
        onOpenChange={(open) => {
          if (!open && !isResettingPin) setResetPinCandidate(null)
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="size-11 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-1.5">
              <KeyRound className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold">Reset Shift Login PIN?</DialogTitle>
            <DialogDescription className="text-xs">
              Generate a brand new unique PIN for{" "}
              <strong className="text-foreground">{resetPinCandidate?.name}</strong>. Their
              previous PIN will be immediately invalidated on all shared tablets.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 text-xs text-muted-foreground">
            The new PIN will be shown once on the screen immediately after generation so you can
            provide it to the staff member.
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isResettingPin}
              onClick={() => setResetPinCandidate(null)}
              className="h-9 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmResetPin}
              disabled={isResettingPin}
              className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {isResettingPin ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Generating PIN...</span>
                </span>
              ) : (
                "Generate New PIN"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 5: Deactivate / Reactivate Staff */}
      <Dialog
        open={Boolean(statusToggleMember)}
        onOpenChange={(open) => {
          if (!open) setStatusToggleMember(null)
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div
              className={cn(
                "size-11 rounded-xl flex items-center justify-center mb-1.5",
                statusToggleMember?.status === "Active"
                  ? "bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 text-amber-700 dark:text-amber-400"
                  : "bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400"
              )}
            >
              {statusToggleMember?.status === "Active" ? (
                <UserX className="size-5" />
              ) : (
                <UserCheck className="size-5" />
              )}
            </div>
            <DialogTitle className="text-base font-bold">
              {statusToggleMember?.status === "Active"
                ? `Deactivate ${statusToggleMember?.name}?`
                : `Reactivate ${statusToggleMember?.name}?`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {statusToggleMember?.status === "Active"
                ? "This will immediately revoke POS tablet and web login for this staff member."
                : "This staff member will be granted active POS access with their assigned PIN."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 text-xs text-muted-foreground space-y-2">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="font-semibold text-foreground text-xs">
                Audit Trail Integrity Guaranteed
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Staff accounts are never deleted. All past order attributions, cashier sessions,
                voids, and stock movement logs remain permanently attributed to{" "}
                <span className="font-semibold text-foreground">{statusToggleMember?.name}</span>.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusToggleMember(null)}
              className="h-9 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmToggleStatus}
              className={cn(
                "h-9 rounded-xl text-white text-xs font-bold cursor-pointer",
                statusToggleMember?.status === "Active"
                  ? "bg-amber-700 hover:bg-amber-800"
                  : "bg-emerald-700 hover:bg-emerald-800"
              )}
            >
              {statusToggleMember?.status === "Active" ? "Confirm Deactivation" : "Confirm Reactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 6: Help & Role Guide */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Bara Access Roles &amp; Security</DialogTitle>
            <DialogDescription className="text-xs">
              How staff authentication and permission tiers work in Bara.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="rounded-xl border border-border p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Crown className="size-3.5 text-amber-500 fill-amber-500" />
                <span>Owner</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Full administrative access. Manages subscription billing, store profile, and staff
                accounts. A restaurant must always have at least one active Owner.
              </p>
            </div>

            <div className="rounded-xl border border-border p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Laptop className="size-3.5 text-primary" />
                <span>Manager</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Access to POS App and Web Dashboard. Can manage menu items, ingredients, log stock
                adjustments, and review daily sales reports. Cannot manage users or billing.
              </p>
            </div>

            <div className="rounded-xl border border-border p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Smartphone className="size-3.5 text-primary" />
                <span>Cashier / Waiter &amp; Kitchen / Stock</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Shared tablet app users. Log in with their unique 4-digit PIN. 5 consecutive failed
                PIN attempts lock the account until reset by the Owner.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowHelpModal(false)}
              className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 7: Edit Staff Member Info */}
      <Dialog open={!!editMember} onOpenChange={(open) => !open && setEditMember(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Pencil className="size-4 text-primary" />
              <span>Edit Staff Member</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update personal details and contact information for {editMember?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
            {editError && (
              <div className="rounded-xl border border-rose-200/60 bg-rose-50/70 dark:bg-rose-950/30 p-2.5 text-xs text-rose-700 dark:text-rose-300">
                {editError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground">
                Staff Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Mugisha"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 h-9.5 w-full rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border px-3 text-xs text-foreground placeholder:text-[#A8A29E] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">
                Phone (MoMo / WhatsApp) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0788 123 456"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="mt-1 h-9.5 w-full rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border px-3 text-xs text-foreground placeholder:text-[#A8A29E] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Email {editMember?.role === "Manager" ? <span className="text-red-500">*</span> : "(Optional)"}
                </label>
                {editMember?.role !== "Manager" && (
                  <span className="text-[11px] text-muted-foreground">Optional for POS staff</span>
                )}
              </div>
              <input
                type="email"
                required={editMember?.role === "Manager"}
                placeholder="name@restaurant.rw"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mt-1 h-9.5 w-full rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border px-3 text-xs text-foreground placeholder:text-[#A8A29E] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Read-only role information card */}
            <div className="rounded-xl bg-[#FAF8F5] dark:bg-muted/20 border border-[#EBE7DF] dark:border-border p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block">Assigned Role</span>
                <span className="text-xs font-bold text-foreground">{editMember?.role}</span>
              </div>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {editMember?.platformAccess}
              </span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMember(null)}
                className="h-9 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingEdit}
                className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isSubmittingEdit ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
