"use client"

import * as React from "react"
import {
  CheckCircle2,
  Percent,
  Save,
  Store,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [savedNotice, setSavedNotice] = React.useState("")
  const [restaurantName, setRestaurantName] = React.useState("Bara Bistro & Grill")
  const [currency, setCurrency] = React.useState("RWF (Rwandan Franc)")
  const [kitchenTarget, setKitchenTarget] = React.useState("32")
  const [barTarget, setBarTarget] = React.useState("22")
  const [aiAlerts, setAiAlerts] = React.useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedNotice("Settings saved successfully!")
    setTimeout(() => setSavedNotice(""), 3500)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Restaurant Settings
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Configure restaurant parameters, operational food cost targets, and team permissions.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="h-8 gap-1.5 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] text-xs font-bold shadow-xs"
        >
          <Save className="size-3.5" />
          <span>Save Changes</span>
        </Button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Main Settings Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Branch & General Profile */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Store className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
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
            <h2 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
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
                  Industry standard benchmark: 28% – 34%
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
                  Industry standard benchmark: 18% – 24%
                </span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiAlerts}
                  onChange={(e) => setAiAlerts(e.target.checked)}
                  className="size-4 rounded accent-primary"
                />
                <span className="text-xs font-medium text-foreground">
                  Enable AI variance alerts when cost exceeds target by &gt; 5%
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Team Members & Roles */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-[#234D3A]" />
              <h2 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Authorized Team Members
              </h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const email = prompt("Enter team member email to invite:", "staff@barabistro.rw")
                if (email) {
                  setSavedNotice(`Invitation sent to ${email} with floor staff access!`)
                  setTimeout(() => setSavedNotice(""), 3500)
                }
              }}
              className="h-7 text-xs rounded-lg"
            >
              + Invite Member
            </Button>
          </div>

          <div className="divide-y divide-border/50">
            {[
              {
                name: "Alex Rivera",
                role: "Floor Manager & Operations",
                email: "alex@barabistro.rw",
                level: "Manager (Full Access)",
                active: true,
              },
              {
                name: "Jean-Paul Habimana",
                role: "Head Chef & Kitchen Lead",
                email: "jp@barabistro.rw",
                level: "Kitchen & Inventory",
                active: true,
              },
              {
                name: "Grace Uwase",
                role: "Head Bartender & Cellar",
                email: "grace@barabistro.rw",
                level: "Bar Inventory & Sales",
                active: true,
              },
            ].map((member) => (
              <div key={member.email} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                    {member.level}
                  </span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                    Edit Role
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
