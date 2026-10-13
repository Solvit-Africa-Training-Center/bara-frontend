"use client"

import * as React from "react"
import {
  Check,
  Crown,
  HelpCircle,
  Info,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCog,
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
import { PlanUpgradeGate } from "@/components/plan-upgrade-gate"

export type StaffRole = "Owner" | "Manager" | "Cashier / Waiter" | "Kitchen / Stock"
export type StaffStatus = "Active" | "Invited"
export type PlatformAccess = "App + Web" | "App only"

export interface TeamMember {
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
}

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "u-1",
    name: "Aline Mukamana",
    role: "Owner",
    status: "Active",
    platformAccess: "App + Web",
    avatarInitials: "AM",
    isOwner: true,
    email: "aline@kigaliheightsbistro.rw",
    phone: "+250 788 100 001",
    shiftPin: "1100",
  },
  {
    id: "u-2",
    name: "Patrick Mugisha",
    role: "Manager",
    status: "Active",
    platformAccess: "App + Web",
    avatarInitials: "PM",
    email: "patrick@kigaliheightsbistro.rw",
    phone: "+250 788 200 002",
    shiftPin: "2201",
  },
  {
    id: "u-3",
    name: "Jean Niyonzima",
    role: "Cashier / Waiter",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "JN",
    email: "jean@kigaliheightsbistro.rw",
    phone: "+250 788 300 003",
    shiftPin: "3302",
  },
  {
    id: "u-4",
    name: "Grace Uwase",
    role: "Cashier / Waiter",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "GU",
    email: "grace@kigaliheightsbistro.rw",
    phone: "+250 788 400 004",
    shiftPin: "4403",
  },
  {
    id: "u-5",
    name: "Eric Habimana",
    role: "Cashier / Waiter",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "EH",
    email: "eric@kigaliheightsbistro.rw",
    phone: "+250 788 500 005",
    shiftPin: "5504",
  },
  {
    id: "u-6",
    name: "Diane Keza",
    role: "Cashier / Waiter",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "DK",
    email: "diane@kigaliheightsbistro.rw",
    phone: "+250 788 600 006",
    shiftPin: "6605",
  },
  {
    id: "u-7",
    name: "Chantal Uwamahoro",
    role: "Kitchen / Stock",
    status: "Active",
    platformAccess: "App only",
    avatarInitials: "CU",
    email: "chantal@kigaliheightsbistro.rw",
    phone: "+250 788 700 007",
    shiftPin: "7706",
  },
  {
    id: "u-8",
    name: "Emmanuel Ishimwe",
    role: "Kitchen / Stock",
    status: "Invited",
    platformAccess: "App only",
    avatarInitials: "EI",
    email: "emmanuel@kigaliheightsbistro.rw",
    phone: "+250 788 800 008",
    shiftPin: "8807",
  },
]

export default function UsersPage() {
  const { restaurant } = useRestaurant()

  // Team state
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>(INITIAL_TEAM_MEMBERS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("All")
  const [toastNotice, setToastNotice] = React.useState<string | null>(null)

  // Add User modal state
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [addName, setAddName] = React.useState("")
  const [addRole, setAddRole] = React.useState<"Manager" | "Cashier / Waiter" | "Kitchen / Stock">("Cashier / Waiter")
  const [addEmail, setAddEmail] = React.useState("")
  const [addPhone, setAddPhone] = React.useState("")
  const [addPin, setAddPin] = React.useState("1234")
  const [addSendInvite, setAddSendInvite] = React.useState(true)

  // Change Role modal state
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<"Manager" | "Cashier / Waiter" | "Kitchen / Stock">("Cashier / Waiter")

  // Reset PIN modal state
  const [pinModalMember, setPinModalMember] = React.useState<TeamMember | null>(null)
  const [newPin, setNewPin] = React.useState("")

  // Delete Member confirmation modal state
  const [deleteMember, setDeleteMember] = React.useState<TeamMember | null>(null)

  // Help modal state
  const [showHelpModal, setShowHelpModal] = React.useState(false)

  const showToast = (message: string) => {
    setToastNotice(message)
    setTimeout(() => {
      setToastNotice((curr) => (curr === message ? null : curr))
    }, 4000)
  }

  // Summary Metrics
  const totalMembers = teamMembers.length
  const activeStaff = teamMembers.filter((m) => m.status === "Active").length
  const invitedStaff = teamMembers.filter((m) => m.status === "Invited").length
  const appAndWebStaff = teamMembers.filter((m) => m.platformAccess === "App + Web").length
  const appOnlyStaff = teamMembers.filter((m) => m.platformAccess === "App only").length
  const appOnlyActiveStaff = teamMembers.filter(
    (m) => m.platformAccess === "App only" && m.status === "Active"
  ).length
  const appOnlyInvitedStaff = teamMembers.filter(
    (m) => m.platformAccess === "App only" && m.status === "Invited"
  ).length

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
    return teamMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesRole = roleFilter === "All" || m.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [teamMembers, searchQuery, roleFilter])

  // Handlers
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addName.trim()) return

    const platformAccess: PlatformAccess = addRole === "Manager" ? "App + Web" : "App only"
    const initials = addName
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      name: addName.trim(),
      role: addRole,
      status: addSendInvite ? "Invited" : "Active",
      platformAccess,
      avatarInitials: initials || "ST",
      email: addEmail.trim() || undefined,
      phone: addPhone.trim() || undefined,
      shiftPin: addPin.trim() || "1234",
    }

    setTeamMembers((prev) => [...prev, newMember])
    setShowAddModal(false)
    setAddName("")
    setAddEmail("")
    setAddPhone("")
    setAddPin("1234")
    showToast(`Added ${newMember.name} to the team!`)
  }

  const handleUpdateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return

    const platformAccess: PlatformAccess = selectedRole === "Manager" ? "App + Web" : "App only"
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? { ...m, role: selectedRole, platformAccess }
          : m
      )
    )
    showToast(`Updated role for ${editingMember.name} to ${selectedRole}.`)
    setEditingMember(null)
  }

  const handleResetPinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pinModalMember || !newPin.trim()) return

    setTeamMembers((prev) =>
      prev.map((m) => (m.id === pinModalMember.id ? { ...m, shiftPin: newPin.trim() } : m))
    )
    showToast(`Reset shift PIN for ${pinModalMember.name}.`)
    setPinModalMember(null)
    setNewPin("")
  }

  const handleDeleteMember = () => {
    if (!deleteMember) return
    setTeamMembers((prev) => prev.filter((m) => m.id !== deleteMember.id))
    showToast(`Removed ${deleteMember.name} from the team.`)
    setDeleteMember(null)
  }

  const handleResendInvite = (member: TeamMember) => {
    showToast(`Invitation resent to ${member.name} (${member.email || "email"}).`)
  }

  // Plan gating for Basic plan
  if (restaurant.plan === "basic") {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF5EE]">
            Users
          </h1>
          <p className="text-xs text-[#78716C] dark:text-[#A89A90] mt-0.5">
            Manage your team and their access to Bara.
          </p>
        </div>
        <PlanUpgradeGate
          requiredPlan="pro"
          featureName="Team Roles & Permissions"
          title="Collaborate with Role-Based Team Permissions"
          description="Bara Basic is built for single-operator restaurants. To invite managers, cashiers, waitstaff, and kitchen leads with tailored security permissions, upgrade to Bara Pro."
          features={[
            "Role-based access control (Manager, Cashier, Waiter, Kitchen)",
            "Staff login activity and audit trail logs",
            "Shift accountability & cashier ticket safety",
            "Unlimited team member invitations",
          ]}
          priceRwf={32000}
        />
      </div>
    )
  }

  const restaurantDisplayName =
    restaurant.tradingName || restaurant.name || "Kigali Heights Bistro"

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Toast Alert */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-[#284E3A] text-white px-4 py-3 shadow-lg border border-[#3b6d53] animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="size-4 text-[#A8C5B3] shrink-0 stroke-[2.5]" />
          <span className="text-xs font-medium">{toastNotice}</span>
          <button
            onClick={() => setToastNotice(null)}
            className="ml-2 text-white/70 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF5EE]">
            Users
          </h1>
          <p className="text-xs text-[#78716C] dark:text-[#A89A90] mt-0.5">
            Manage your team and their access to Bara.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium">
            <span className="size-2 rounded-full bg-[#10B981]" />
            <span>Online · Synced now</span>
          </div>

          {/* Add user action */}
          <Button
            onClick={() => {
              setAddName("")
              setAddEmail("")
              setAddPhone("")
              setAddPin("1234")
              setAddRole("Cashier / Waiter")
              setAddSendInvite(true)
              setShowAddModal(true)
            }}
            className="h-9 px-4 rounded-xl bg-[#B43403] hover:bg-[#9A2C02] text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Add user</span>
          </Button>

          {/* Help question button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="size-9 rounded-xl border border-[#E5E0D5] dark:border-border/60 bg-white dark:bg-card flex items-center justify-center text-[#78716C] hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            title="Help & access roles"
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Team members (Dark Forest Green) */}
        <div className="rounded-2xl bg-[#284E3A] text-white p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#A8C5B3] font-medium">Team members</span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {totalMembers}
            </span>
          </div>
          <span className="text-xs text-[#A8C5B3] truncate">
            {restaurantDisplayName}
          </span>
        </div>

        {/* Card 2: Active staff */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Active staff
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {activeStaff}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            {invitedStaff} invitation awaiting acceptance
          </span>
        </div>

        {/* Card 3: App + Web access */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            App + Web access
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {appAndWebStaff}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            Owner and manager only
          </span>
        </div>

        {/* Card 4: App-only staff */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            App-only staff
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {appOnlyStaff}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            {appOnlyActiveStaff} active · {appOnlyInvitedStaff} invited
          </span>
        </div>
      </div>

      {/* "Your team" Table Card */}
      <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border shadow-xs overflow-hidden">
        {/* Top toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F0ECE1] dark:border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1C1917] dark:text-foreground">
                Your team
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF2EC] text-[#284E3A] dark:bg-emerald-950/40 dark:text-emerald-400 border border-[#D5E3D7] dark:border-emerald-900/60 text-[11px] font-semibold">
                <ShieldCheck className="size-3 text-[#284E3A] dark:text-emerald-400" />
                <span>Owner only</span>
              </span>
            </div>
            <p className="text-xs text-[#78716C] dark:text-muted-foreground mt-0.5">
              Manage staff accounts for this restaurant.
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
                placeholder="Search by name"
                className="h-8.5 w-48 sm:w-60 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border pl-8.5 pr-3 text-xs text-foreground placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B43403] focus:ring-1 focus:ring-[#B43403]/20"
              />
            </div>

            {/* Role filter dropdown */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-8.5 pl-3 pr-8 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border text-xs font-semibold text-foreground focus:outline-none focus:border-[#B43403] cursor-pointer appearance-none"
              >
                <option value="All">All roles</option>
                <option value="Owner">Owner</option>
                <option value="Manager">Manager</option>
                <option value="Cashier / Waiter">Cashier / Waiter</option>
                <option value="Kitchen / Stock">Kitchen / Stock</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Team Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-muted/30 border-b border-[#EBE7DF] dark:border-border text-[#78716C]">
                <th className="py-3 pl-5 font-semibold text-[11px] uppercase tracking-wider">
                  NAME
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  ROLE
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  STATUS
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  PLATFORM / ACCESS
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
                  className="hover:bg-[#FAF8F5]/60 dark:hover:bg-muted/20 transition-colors"
                >
                  {/* Name Column */}
                  <td className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none",
                          member.isOwner
                            ? "bg-[#D97706] text-white shadow-xs"
                            : "bg-[#EDE7DD] dark:bg-muted text-[#574F45] dark:text-muted-foreground font-semibold"
                        )}
                      >
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#1C1917] dark:text-foreground">
                          {member.name}
                        </div>
                        {member.isOwner && (
                          <div className="text-[11px] text-[#78716C] leading-none mt-0.5">
                            You · Account owner
                          </div>
                        )}
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

                  {/* Status Column */}
                  <td className="py-3.5 px-4">
                    {member.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF5EC] border border-[#C6E6CD] text-[#1E743A] text-xs font-medium">
                        <Check className="size-3 stroke-[2.5]" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF4E6] border border-[#FADBB2] text-[#B45309] text-xs font-medium">
                        <Mail className="size-3" />
                        <span>Invited</span>
                      </span>
                    )}
                  </td>

                  {/* Platform / Access Column */}
                  <td className="py-3.5 px-4">
                    {member.platformAccess === "App + Web" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] dark:text-foreground">
                        <Laptop className="size-3.5 text-[#284E3A] dark:text-emerald-400" />
                        <span>App + Web</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#78716C] dark:text-muted-foreground">
                        <Smartphone className="size-3.5 text-[#A8A29E]" />
                        <span>App only</span>
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 pr-5 text-right">
                    {member.isOwner ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#78716C] font-medium justify-end">
                        <Lock className="size-3.5 text-[#A8A29E]" />
                        <span>Owner role fixed</span>
                      </span>
                    ) : member.status === "Invited" ? (
                      <div className="inline-flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleResendInvite(member)}
                          className="text-xs font-semibold text-[#B43403] hover:underline cursor-pointer"
                        >
                          Resend invite
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button
                                className="size-7 rounded-lg hover:bg-muted/60 flex items-center justify-center text-[#78716C] hover:text-foreground transition-colors cursor-pointer"
                                title="More options"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingMember(member)
                                setSelectedRole(member.role as "Manager" | "Cashier / Waiter" | "Kitchen / Stock")
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <UserCog className="size-3.5 text-muted-foreground" />
                              <span>Change role</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setPinModalMember(member)
                                setNewPin(member.shiftPin || "1234")
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <KeyRound className="size-3.5 text-muted-foreground" />
                              <span>Reset PIN</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteMember(member)}
                              variant="destructive"
                              className="gap-2 cursor-pointer text-xs text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Remove user</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => {
                            setEditingMember(member)
                            setSelectedRole(member.role as "Manager" | "Cashier / Waiter" | "Kitchen / Stock")
                          }}
                          className="text-xs font-semibold text-[#B43403] hover:underline cursor-pointer"
                        >
                          Change role
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button
                                className="size-7 rounded-lg hover:bg-muted/60 flex items-center justify-center text-[#78716C] hover:text-foreground transition-colors cursor-pointer"
                                title="More options"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingMember(member)
                                setSelectedRole(member.role as "Manager" | "Cashier / Waiter" | "Kitchen / Stock")
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <UserCog className="size-3.5 text-muted-foreground" />
                              <span>Change role</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setPinModalMember(member)
                                setNewPin(member.shiftPin || "1234")
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <KeyRound className="size-3.5 text-muted-foreground" />
                              <span>Reset PIN</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteMember(member)}
                              variant="destructive"
                              className="gap-2 cursor-pointer text-xs text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Remove user</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs text-muted-foreground">
                    No team members found matching your search.
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setRoleFilter("All")
                        }}
                        className="h-7 text-xs rounded-lg"
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
            Showing all {filteredMembers.length} team member{filteredMembers.length === 1 ? "" : "s"}
          </div>
          <div className="flex items-center gap-1.5 text-[#78716C]">
            <Info className="size-3.5 text-[#A8A29E]" />
            <span>App-only staff cannot sign in to this web dashboard.</span>
          </div>
        </div>
      </div>

      {/* Modal 1: Add User */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add user</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new staff member to {restaurantDisplayName}. Configure their role, access tier, and PIN.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUserSubmit} className="space-y-3.5 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Mugisha"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Operational Role</label>
                <select
                  value={addRole}
                  onChange={(e) =>
                    setAddRole(e.target.value as "Manager" | "Cashier / Waiter" | "Kitchen / Stock")
                  }
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20 cursor-pointer"
                >
                  <option value="Cashier / Waiter">Cashier / Waiter (App only)</option>
                  <option value="Kitchen / Stock">Kitchen / Stock (App only)</option>
                  <option value="Manager">Manager (App + Web)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">4-Digit Shift PIN</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  value={addPin}
                  onChange={(e) => setAddPin(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20 font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <input
                type="email"
                placeholder="e.g. samuel@kigaliheightsbistro.rw"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Phone Number (MoMo / WhatsApp)</label>
              <input
                type="tel"
                placeholder="+250 788 000 000"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20"
              />
            </div>

            {/* Platform Access badge indicator */}
            <div className="rounded-xl border border-[#EBE7DF] dark:border-border p-3 bg-[#FAF8F5] dark:bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {addRole === "Manager" ? (
                  <Laptop className="size-4 text-[#284E3A]" />
                ) : (
                  <Smartphone className="size-4 text-[#78716C]" />
                )}
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {addRole === "Manager" ? "App + Web Access" : "App Only Access"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {addRole === "Manager"
                      ? "Can log in to Bara POS App and this Web Dashboard"
                      : "Can only sign in to the Bara POS Android/iOS App"}
                  </div>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={addSendInvite}
                onChange={(e) => setAddSendInvite(e.target.checked)}
                className="rounded border-border text-[#B43403] focus:ring-[#B43403]"
              />
              <span className="text-xs text-foreground font-medium">
                Send invitation link via email
              </span>
            </label>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="h-8.5 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8.5 text-xs rounded-xl bg-[#B43403] hover:bg-[#9A2C02] text-white font-bold px-4"
              >
                Save user
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Change Role */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Change role</DialogTitle>
            <DialogDescription className="text-xs">
              Modify the operational role and platform permissions for {editingMember?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateRoleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Select New Role</label>
              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value as "Manager" | "Cashier / Waiter" | "Kitchen / Stock")
                }
                className="mt-1.5 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20 cursor-pointer"
              >
                <option value="Manager">Manager (App + Web)</option>
                <option value="Cashier / Waiter">Cashier / Waiter (App only)</option>
                <option value="Kitchen / Stock">Kitchen / Stock (App only)</option>
              </select>
            </div>

            <div className="rounded-xl border border-[#EBE7DF] dark:border-border p-3.5 bg-[#FAF8F5] dark:bg-muted/30 space-y-1.5">
              <div className="flex items-center gap-2">
                {selectedRole === "Manager" ? (
                  <Laptop className="size-4 text-[#284E3A]" />
                ) : (
                  <Smartphone className="size-4 text-[#78716C]" />
                )}
                <span className="text-xs font-bold text-foreground">
                  {selectedRole === "Manager" ? "App + Web Access" : "App-only Access"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {selectedRole === "Manager"
                  ? "Managers can sign in to the Bara Web Dashboard to view sales analytics, modify menus, manage inventory, and supervise staff shifts."
                  : "Cashiers, waitstaff, and kitchen staff can only log in via the Bara Mobile/Tablet POS app using their shift PIN. They cannot access this Web Dashboard."}
              </p>
            </div>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingMember(null)}
                className="h-8.5 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8.5 text-xs rounded-xl bg-[#B43403] hover:bg-[#9A2C02] text-white font-bold px-4"
              >
                Update role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Reset PIN */}
      <Dialog open={!!pinModalMember} onOpenChange={(open) => !open && setPinModalMember(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Reset Shift PIN</DialogTitle>
            <DialogDescription className="text-xs">
              Set a new 4-digit PIN for {pinModalMember?.name} to unlock the Bara POS app.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPinSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-lg text-foreground focus:border-[#B43403] focus:outline-none focus:ring-1 focus:ring-[#B43403]/20 font-mono tracking-widest text-center"
              />
              <p className="text-[11px] text-muted-foreground mt-1 text-center">
                This PIN is entered on tablet terminals when clocking in.
              </p>
            </div>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPinModalMember(null)}
                className="h-8.5 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8.5 text-xs rounded-xl bg-[#B43403] hover:bg-[#9A2C02] text-white font-bold px-4"
              >
                Save PIN
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 4: Delete Member */}
      <Dialog open={!!deleteMember} onOpenChange={(open) => !open && setDeleteMember(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive">
              Revoke user access?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to revoke access for <strong className="text-foreground">{deleteMember?.name}</strong>? They will no longer be able to log in to the Bara POS or access shift registers.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteMember(null)}
              className="h-8.5 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteMember}
              className="h-8.5 text-xs rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold px-4"
            >
              Revoke access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 5: Help & Platform Access */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#284E3A]" />
              <span>Bara Roles &amp; Platform Access Guide</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Learn how permissions and multi-platform boundaries protect your restaurant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 mt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Crown className="size-3.5 text-amber-500 fill-amber-500" />
                <span>Owner (App + Web)</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Full administrative access. Manages billing, subscription plans, bank details, tax configurations, and staff access.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Laptop className="size-3.5 text-[#284E3A]" />
                <span>Manager (App + Web)</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Supervises floor operations, reconciles daily register cash counts, updates recipes and menu prices, and accesses shift analytics.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-[#78716C]" />
                <span>Cashier / Waiter (App only)</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Fast touchscreen interface to take table orders, print kitchen tickets, apply discounts, and accept MoMo/card payments.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-[#78716C]" />
                <span>Kitchen / Stock (App only)</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Kitchen Display System (KDS) order bump bar, prep timers, and daily ingredient stock taking.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="h-8.5 text-xs rounded-xl bg-[#284E3A] hover:bg-[#1E3C2C] text-white font-bold px-4"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
