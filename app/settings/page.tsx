"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Percent,
  Plus,
  Save,
  Sparkles,
  Store,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const activeTab = tabParam === "users" || tabParam === "billing" ? tabParam : "general"

  const handleTabChange = (value: string) => {
    router.replace(`/settings?tab=${value}`, { scroll: false })
  }

  const [savedNotice, setSavedNotice] = React.useState("")
  const [restaurantName, setRestaurantName] = React.useState("Bara Bistro & Grill")
  const [currency, setCurrency] = React.useState("RWF (Rwandan Franc)")
  const [kitchenTarget, setKitchenTarget] = React.useState("32")
  const [barTarget, setBarTarget] = React.useState("22")
  const [aiAlerts, setAiAlerts] = React.useState(true)

  // Team state
  const [teamMembers, setTeamMembers] = React.useState([
    {
      name: "Alex Rivera",
      role: "Floor Manager & Operations",
      email: "alex@barabistro.rw",
      level: "Manager (Full Access)",
      status: "Active",
    },
    {
      name: "Jean-Paul Habimana",
      role: "Head Chef & Kitchen Lead",
      email: "jp@barabistro.rw",
      level: "Kitchen & Inventory",
      status: "Active",
    },
    {
      name: "Grace Uwase",
      role: "Head Bartender & Cellar",
      email: "grace@barabistro.rw",
      level: "Bar Inventory & Sales",
      status: "Active",
    },
    {
      name: "Diane Kayitesi",
      role: "Financial Auditor & POS",
      email: "diane@barabistro.rw",
      level: "Auditor (Read-Only Reports)",
      status: "Active",
    },
  ])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedNotice("Settings saved successfully!")
    setTimeout(() => setSavedNotice(""), 3500)
  }

  const handleInvite = () => {
    const email = prompt("Enter team member email to invite:", "staff@barabistro.rw")
    if (email) {
      const name = email.split("@")[0].replace(".", " ")
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
      setTeamMembers([
        ...teamMembers,
        {
          name: formattedName,
          role: "Floor Operations Staff",
          email,
          level: "Staff (Transactions Only)",
          status: "Invited",
        },
      ])
      setSavedNotice(`Invitation sent to ${email}!`)
      setTimeout(() => setSavedNotice(""), 3500)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings &amp; Preferences
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your restaurant profile, team authorizations, and Bara subscription plan.
          </p>
        </div>

        {activeTab === "general" && (
          <Button
            onClick={handleSave}
            className="h-8 gap-1.5 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] text-xs font-bold shadow-xs"
          >
            <Save className="size-3.5" />
            <span>Save Changes</span>
          </Button>
        )}
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <TabsList className="h-11 w-full sm:w-auto p-1 bg-muted/80 rounded-2xl grid grid-cols-3 sm:inline-flex border border-border/60">
          <TabsTrigger
            value="general"
            className="rounded-xl px-4 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
          >
            <Store className="size-4" />
            <span className="truncate">General Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-xl px-4 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
          >
            <Users className="size-4" />
            <span className="truncate">Users &amp; Roles</span>
            <span className="hidden sm:inline-flex rounded-full bg-secondary px-1.5 py-0.2 text-[10px] font-bold text-secondary-foreground">
              {teamMembers.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-xl px-4 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-sm"
          >
            <CreditCard className="size-4" />
            <span className="truncate">Billing &amp; Plan</span>
            <span className="hidden sm:inline-flex rounded-md bg-amber-500/15 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              Pro
            </span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: General & Profile */}
        <TabsContent value="general" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Branch & General Profile */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Store className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  Branch &amp; Profile Details
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Restaurant Branch Name
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Location &amp; Address</label>
                  <input
                    type="text"
                    defaultValue="KG 9 Ave, Nyarutarama, Kigali, Rwanda"
                    className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Base Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="RWF (Rwandan Franc)">RWF (Rwandan Franc)</option>
                      <option value="USD ($)">USD ($)</option>
                      <option value="KES (Kenyan Shilling)">KES (Kenyan Shilling)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Time Zone</label>
                    <input
                      type="text"
                      disabled
                      defaultValue="Africa/Kigali (GMT+2)"
                      className="mt-1 h-9 w-full rounded-xl border border-border bg-muted/50 px-3 text-xs text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Food Cost & Operational Margins */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Percent className="size-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-foreground">
                  Food Cost &amp; Margin Targets
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Kitchen Food Cost Target (% of sales)
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={kitchenTarget}
                      onChange={(e) => setKitchenTarget(e.target.value)}
                      className="h-9 w-24 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <span className="text-xs text-muted-foreground">
                      Benchmark: 28% – 34%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Bar &amp; Beverage Cost Target (% of sales)
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      value={barTarget}
                      onChange={(e) => setBarTarget(e.target.value)}
                      className="h-9 w-24 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <span className="text-xs text-muted-foreground">
                      Benchmark: 18% – 24%
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiAlerts}
                      onChange={(e) => setAiAlerts(e.target.checked)}
                      className="size-4 rounded accent-primary cursor-pointer"
                    />
                    <span className="text-xs font-medium text-foreground">
                      Enable AI variance alerts when cost exceeds target by &gt; 5%
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Users & Team Roles */}
        <TabsContent value="users" className="mt-0">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Authorized Team Members
                </h2>
                <p className="text-xs text-muted-foreground">
                  Manage access roles for floor managers, chefs, bartenders and auditors
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleInvite}
                className="h-8 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-bold shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>+ Invite Team Member</span>
              </Button>
            </div>

            <div className="divide-y divide-border/50">
              {teamMembers.map((member) => (
                <div key={member.email} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{member.name}</p>
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.2 text-[10px] font-semibold",
                            member.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role} • {member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {member.level}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSavedNotice(`Updated role permissions for ${member.name}!`)
                        setTimeout(() => setSavedNotice(""), 3500)
                      }}
                      className="h-8 text-xs rounded-xl"
                    >
                      Edit Access
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>Seat allocation: <strong>{teamMembers.length} / Unlimited</strong> (Bara Pro Tier)</span>
              <span className="text-emerald-600 font-semibold">Role-Based Access Control Enabled</span>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: Billing & Subscription */}
        <TabsContent value="billing" className="mt-0 space-y-6">
          {/* Current Active Plan Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#C85A24] bg-card p-6 shadow-md">
            <div className="absolute top-0 right-0 bg-[#C85A24] text-white px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-200" />
              Active Subscription
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  Restaurant Tier
                </span>
                <h2 className="text-2xl font-extrabold text-foreground mt-1">
                  Bara Pro + AI Intelligence
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-md leading-relaxed">
                  Includes live POS shift reconciliation, automated ingredient food cost variance
                  alerts, and unlimited staff permissions.
                </p>
              </div>

              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <span className="text-3xl font-extrabold text-foreground">69,000</span>
                <span className="text-xs text-muted-foreground font-semibold ml-1">RWF / month</span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Next renewal: <strong>November 5, 2026</strong>
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 border-t border-border/60 pt-5 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <span>Unlimited Staff Logins</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <span>AI Recipe Portion Costing</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Check className="size-4 text-emerald-600 shrink-0" />
                <span>Priority 24/7 Operations Line</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
              <Button
                variant="outline"
                onClick={() => {
                  setSavedNotice("Switched to Annual Billing (Saved 20%)!")
                  setTimeout(() => setSavedNotice(""), 3500)
                }}
                className="h-8 rounded-xl text-xs font-bold"
              >
                Switch to Annual Plan (Save 20%)
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const num = prompt("Enter new card or MTN MoMo phone number:", "+250 788 000 000")
                  if (num) {
                    setSavedNotice(`Payment method updated to ${num}!`)
                    setTimeout(() => setSavedNotice(""), 3500)
                  }
                }}
                className="h-8 rounded-xl text-xs text-muted-foreground hover:text-foreground"
              >
                Update Payment Method
              </Button>
            </div>
          </div>

          {/* Payment Method & Invoices */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">Billing History &amp; Receipts</h3>
                <p className="text-xs text-muted-foreground">Download tax invoices for your restaurant accounting</p>
              </div>
              <span className="text-xs text-muted-foreground">MTN MoMo Business •••• 9821</span>
            </div>

            <div className="mt-3 divide-y divide-border/50">
              {[
                { ref: "INV-2026-09", date: "Oct 5, 2026", amount: "69,000 RWF", status: "Paid" },
                { ref: "INV-2026-08", date: "Sep 5, 2026", amount: "69,000 RWF", status: "Paid" },
                { ref: "INV-2026-07", date: "Aug 5, 2026", amount: "69,000 RWF", status: "Paid" },
              ].map((inv) => (
                <div key={inv.ref} className="flex items-center justify-between py-3 text-xs">
                  <div>
                    <p className="font-bold text-foreground">{inv.ref}</p>
                    <p className="text-[11px] text-muted-foreground">{inv.date} • Bara Pro Subscription</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{inv.amount}</span>
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {inv.status}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSavedNotice(`Downloaded receipt for ${inv.ref}!`)
                        setTimeout(() => setSavedNotice(""), 3500)
                      }}
                      className="h-7 text-xs gap-1"
                    >
                      <Download className="size-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading settings...</div>}>
      <SettingsContent />
    </React.Suspense>
  )
}
