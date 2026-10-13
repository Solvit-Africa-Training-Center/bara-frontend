"use client"

import * as React from "react"
import { Building2, Mail, MapPin, Phone, Save, Store, User } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRestaurant } from "@/components/restaurant-provider"

export interface ProfileTabFormProps {
  onSavedNotice: (msg: string) => void
}

export function ProfileTabForm({ onSavedNotice }: ProfileTabFormProps) {
  const { restaurant, user, updateRestaurant, updateUser } = useRestaurant()

  const [restaurantName, setRestaurantName] = React.useState(restaurant.name)
  const [tradingName, setTradingName] = React.useState(restaurant.tradingName || restaurant.name)
  const [address, setAddress] = React.useState(restaurant.address)
  const [city, setCity] = React.useState(restaurant.city || "Kigali")
  const [phone, setPhone] = React.useState(restaurant.phone || "+250 788 123 456")
  const [currency, setCurrency] = React.useState(restaurant.currency || "RWF")
  const [managerName, setManagerName] = React.useState(user.name)
  const [managerEmail, setManagerEmail] = React.useState(user.email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateRestaurant({
      name: restaurantName.trim() || restaurant.name,
      tradingName: tradingName.trim() || restaurant.name,
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      currency,
    })
    updateUser({
      name: managerName.trim() || user.name,
      email: managerEmail.trim() || user.email,
    })
    onSavedNotice("Restaurant profile updated successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Restaurant Identity Card */}
        <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Restaurant Identity
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Primary business name and customer-facing branding
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Bara Bistro & Grill"
                className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Legal Trading Name (for Tax &amp; Receipts)
              </label>
              <input
                type="text"
                value={tradingName}
                onChange={(e) => setTradingName(e.target.value)}
                placeholder="e.g. Bara Hospitality Ltd"
                className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Operating Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="RWF">RWF (Rwandan Franc)</option>
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (Kenyan Shilling)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Time Zone
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="Africa/Kigali (GMT+2)"
                  className="mt-1 h-9.5 w-full rounded-xl border border-border bg-muted/60 px-3.5 text-xs text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Location & Contact Card */}
        <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Location &amp; Operations Contact
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Physical address and manager contact for receipts and supplier orders
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. KG 9 Ave, Nyarutarama"
                className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  City / District
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kigali"
                  className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +250 788 123 456"
                  className="mt-1 h-9.5 w-full rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <label className="text-xs font-semibold text-foreground">
                General Manager / Primary Contact
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Full name"
                  className="h-9.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <input
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-9.5 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-9 gap-1.5 rounded-xl bg-[#C85A24] hover:bg-[#B34D1C] text-white text-xs font-bold px-5 shadow-xs"
        >
          <Save className="size-3.5" />
          <span>Save Profile Changes</span>
        </Button>
      </div>
    </form>
  )
}
