"use client"

import * as React from "react"
import {
  CheckCircle2,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users as UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"
import { PlanUpgradeGate } from "@/components/plan-upgrade-gate"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  level: "Manager (Full Access)" | "Kitchen & Inventory" | "Bar Inventory & Sales" | "Auditor (Read-Only Reports)" | "Cashier (POS Shifts Only)"
  status: "Active" | "Invited"
  lastActive: string
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Floor Manager & Operations",
    email: "alex@barabistro.rw",
    level: "Manager (Full Access)",
    status: "Active",
    lastActive: "Active now",
  },
  {
    id: "2",
    name: "Jean-Paul Habimana",
    role: "Head Chef & Kitchen Lead",
    email: "jp@barabistro.rw",
    level: "Kitchen & Inventory",
    status: "Active",
    lastActive: "Today, 11:25",
  },
  {
    id: "3",
    name: "Grace Uwase",
    role: "Head Bartender & Cellar",
    email: "grace@barabistro.rw",
    level: "Bar Inventory & Sales",
    status: "Active",
    lastActive: "Today, 13:00",
  },
  {
    id: "4",
    name: "Diane Kayitesi",
    role: "Financial Auditor & POS",
    email: "diane@barabistro.rw",
    level: "Auditor (Read-Only Reports)",
    status: "Active",
    lastActive: "Yesterday, 19:40",
  },
]

const rolePermissions = [
  {
    role: "Manager (Full Access)",
    dashboard: "Full",
    menu: "Full Edit",
    reports: "Full Export",
    aiInsights: "Full Access",
    settings: "Admin",
  },
  {
    role: "Kitchen & Inventory",
    dashboard: "View Only",
    menu: "Recipe & Costing",
    reports: "Food COGS Only",
    aiInsights: "Kitchen Alerts",
    settings: "No Access",
  },
  {
    role: "Bar Inventory & Sales",
    dashboard: "View Only",
    menu: "Bar Items Only",
    reports: "Bar COGS Only",
    aiInsights: "Bar Alerts",
    settings: "No Access",
  },
  {
    role: "Auditor (Read-Only Reports)",
    dashboard: "View Only",
    menu: "View Pricing",
    reports: "Full Export & P&L",
    aiInsights: "Financials Only",
    settings: "Billing Only",
  },
  {
    role: "Cashier (POS Shifts Only)",
    dashboard: "Daily Register",
    menu: "View Only",
    reports: "No Access",
    aiInsights: "No Access",
    settings: "No Access",
  },
]

export default function UsersPage() {
  const { restaurant } = useRestaurant()
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>(initialTeamMembers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("All")
  const [savedNotice, setSavedNotice] = React.useState("")

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [inviteName, setInviteName] = React.useState("")
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState("Floor Staff")
  const [inviteLevel, setInviteLevel] = React.useState<TeamMember["level"]>("Kitchen & Inventory")

  // Edit modal state
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null)
  const [editLevel, setEditLevel] = React.useState<TeamMember["level"]>("Kitchen & Inventory")

  if (restaurant.plan === "basic") {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Staff Accounts &amp; Access Control
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Role-based permission levels, shift PINs, and system access audits for {restaurant.name}.
          </p>
        </div>
        <PlanUpgradeGate
          requiredPlan="pro"
          featureName="Team Roles & Permissions"
          title="Collaborate with Role-Based Team Permissions"
          description="Bara Basic is built for single-operator restaurants. To invite managers, kitchen leads, bar staff, cashiers, and auditors with tailored security permissions, upgrade to Bara Pro."
          features={[
            "Role-based access control (Manager, Kitchen, Bar, Cashier, Auditor)",
            "Staff login activity and audit trail logs",
            "Shift accountability & cashier ticket safety",
            "Unlimited team member invitations",
          ]}
          priceRwf={32000}
        />
      </div>
    )
  }

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())

    if (roleFilter === "All") return matchesSearch
    return matchesSearch && m.level.toLowerCase().includes(roleFilter.toLowerCase())
  })

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole.trim() || "Staff Member",
      level: inviteLevel,
      status: "Invited",
      lastActive: "Invitation sent",
    }

    setTeamMembers([newMember, ...teamMembers])
    setShowInviteModal(false)
    setInviteName("")
    setInviteEmail("")
    setInviteRole("Floor Staff")
    setSavedNotice(`Invitation sent to ${newMember.email}!`)
    setTimeout(() => setSavedNotice(""), 3500)
  }

  const handleUpdateRole = () => {
    if (!editingMember) return
    setTeamMembers(
      teamMembers.map((m) => (m.id === editingMember.id ? { ...m, level: editLevel } : m))
    )
    setEditingMember(null)
    setSavedNotice("Role and access permissions updated!")
    setTimeout(() => setSavedNotice(""), 3500)
  }

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke access for ${name}?`)) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id))
      setSavedNotice(`Access revoked for ${name}.`)
      setTimeout(() => setSavedNotice(""), 3500)
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Users &amp; Team Management
            </h1>
            <Badge variant="success" className="font-bold text-[10px]">
              {teamMembers.length} Active Staff
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage authorized staff roles, floor authorizations, and role-based permissions across {restaurant.name} ({restaurant.activeBranch}).
          </p>
        </div>

        <Button
          onClick={() => setShowInviteModal(true)}
          className="h-8.5 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-bold px-3.5 shadow-xs shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Invite Team Member</span>
        </Button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Authorized Staff</span>
            <UsersIcon className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">{teamMembers.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Active logins configured</p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Access Tiers</span>
            <UserCheck className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">4 Tiers</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Manager, Kitchen, Bar, Audit</p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Seat Capacity</span>
            <ShieldCheck className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">Unlimited</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Bara Pro Active Tier</p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Security Model</span>
            <Lock className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-foreground">RBAC</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Role-Based Access Control</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team member by name, role or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 w-full rounded-xl border border-border bg-background pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Manager", "Kitchen", "Bar", "Auditor"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                roleFilter === r
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {r === "All" ? "All Roles" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members List */}
      <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="border-b border-border/60 p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground">
            Team Members Directory ({filteredMembers.length})
          </CardTitle>
          <span className="text-xs text-muted-foreground">Local &amp; Cloud Authorized</span>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/50">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{member.name}</p>
                    <Badge
                      variant={member.status === "Active" ? "success" : "warning"}
                      className="text-[10px] py-0"
                    >
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.role} • <span className="font-mono text-[11px]">{member.email}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Last active: <span className="text-foreground font-medium">{member.lastActive}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Badge variant="secondary" className="px-2.5 py-1 text-xs font-medium border border-border/40">
                  {member.level}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingMember(member)
                    setEditLevel(member.level)
                  }}
                  className="h-8 text-xs rounded-xl gap-1.5"
                >
                  <UserCog className="size-3.5" />
                  <span>Edit Role</span>
                </Button>

                {member.level !== "Manager (Full Access)" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="h-8 size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    title="Revoke Access"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No team members found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permission Matrix Card */}
      <Card className="rounded-2xl border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <ShieldCheck className="size-4 text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            Role Permission Matrix
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Bara provides role-based access boundaries to keep financial and kitchen data secure.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 font-semibold">Role Tier</th>
                <th className="pb-2 font-semibold">Dashboard</th>
                <th className="pb-2 font-semibold">Menu &amp; Costing</th>
                <th className="pb-2 font-semibold">Reports &amp; P&amp;L</th>
                <th className="pb-2 font-semibold">AI Insights</th>
                <th className="pb-2 font-semibold">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rolePermissions.map((rp) => (
                <tr key={rp.role} className="py-2.5">
                  <td className="py-2.5 font-bold text-foreground">{rp.role}</td>
                  <td className="py-2.5 text-muted-foreground">{rp.dashboard}</td>
                  <td className="py-2.5 text-muted-foreground">{rp.menu}</td>
                  <td className="py-2.5 text-muted-foreground">{rp.reports}</td>
                  <td className="py-2.5 text-muted-foreground">{rp.aiInsights}</td>
                  <td className="py-2.5 text-muted-foreground">{rp.settings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Member Modal with shadcn Dialog */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Grant access and assign role permissions to {restaurant.name} ({restaurant.activeBranch}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInviteSubmit} className="space-y-3.5 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Mugisha"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Work Email</label>
              <input
                type="email"
                required
                placeholder="e.g. samuel@barabistro.rw"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Operational Role Title</label>
              <input
                type="text"
                placeholder="e.g. Sous Chef, Mixologist, Shift Cashier"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Access Permission Tier</label>
              <select
                value={inviteLevel}
                onChange={(e) => setInviteLevel(e.target.value as TeamMember["level"])}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="Kitchen & Inventory">Kitchen &amp; Inventory</option>
                <option value="Bar Inventory & Sales">Bar Inventory &amp; Sales</option>
                <option value="Auditor (Read-Only Reports)">Auditor (Read-Only Reports)</option>
                <option value="Cashier (POS Shifts Only)">Cashier (POS Shifts Only)</option>
                <option value="Manager (Full Access)">Manager (Full Access)</option>
              </select>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowInviteModal(false)}
                className="h-8 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8 text-xs rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] font-bold px-4"
              >
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal with shadcn Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              {editingMember?.name} ({editingMember?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <label className="text-xs font-semibold text-foreground">Select New Role Tier</label>
            <select
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value as TeamMember["level"])}
              className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              <option value="Manager (Full Access)">Manager (Full Access)</option>
              <option value="Kitchen & Inventory">Kitchen &amp; Inventory</option>
              <option value="Bar Inventory & Sales">Bar Inventory &amp; Sales</option>
              <option value="Auditor (Read-Only Reports)">Auditor (Read-Only Reports)</option>
              <option value="Cashier (POS Shifts Only)">Cashier (POS Shifts Only)</option>
            </select>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingMember(null)}
                className="h-8 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdateRole}
                className="h-8 text-xs rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold px-4"
              >
                Save Access
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
