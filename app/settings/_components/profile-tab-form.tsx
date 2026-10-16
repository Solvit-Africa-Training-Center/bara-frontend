"use client"

import * as React from "react"
import {
  Building2,
  Check,
  Image as ImageIcon,
  Mail,
  MapPin,
  Palette,
  Phone,
  RefreshCw,
  Save,
  Sparkles,
  Store,
  Sun,
  Trash2,
  Upload,
  User,
} from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRestaurant } from "@/components/restaurant-provider"
import {
  PRESET_ACCENTS,
  evaluateDaylightContrast,
  applyRuntimeTheme,
} from "@/lib/runtime-theme"
import { cn } from "@/lib/utils"
import { restaurantSetupApi, userProfileApi } from "../settings-api"

export interface ProfileTabFormProps {
  onSavedNotice: (msg: string) => void
}

export function ProfileTabForm({ onSavedNotice }: ProfileTabFormProps) {
  const { restaurant, user, updateRestaurant, updateUser } = useRestaurant()

  // Track backend database IDs
  const [setupId, setSetupId] = React.useState<string | null>(null)
  const [profileId, setProfileId] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Basic Information
  const [restaurantName, setRestaurantName] = React.useState(restaurant.name)
  const [tradingName, setTradingName] = React.useState(restaurant.tradingName || restaurant.name)
  const [address, setAddress] = React.useState(restaurant.address)
  const [city, setCity] = React.useState(restaurant.city || "Kigali")
  const [phone, setPhone] = React.useState(restaurant.phone || "+250 788 123 456")
  const [currency, setCurrency] = React.useState(restaurant.currency || "RWF")
  const [managerName, setManagerName] = React.useState(user.name)
  const [managerEmail, setManagerEmail] = React.useState(user.email)

  // Runtime Branding Configuration (Section 3.2 per-tenant)
  const [brandColor, setBrandColor] = React.useState(restaurant.brandColor || "#C85A24")
  const [customHex, setCustomHex] = React.useState(restaurant.brandColor || "#C85A24")
  const [logoData, setLogoData] = React.useState<string | undefined>(restaurant.logo)
  const [logoError, setLogoError] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  // Load real setup and user profile on mount
  React.useEffect(() => {
    let mounted = true
    async function loadBackendData() {
      try {
        const [setup, profile] = await Promise.all([
          restaurantSetupApi.getSetup(),
          userProfileApi.getProfile(),
        ])
        if (!mounted) return
        if (setup) {
          setSetupId(setup.id)
          if (setup.name) setRestaurantName(setup.name)
          if (setup.trading_name) setTradingName(setup.trading_name)
          if (setup.business_address) setAddress(setup.business_address)
          if (setup.city) setCity(setup.city)
          if (setup.phone) setPhone(setup.phone)
          if (setup.primary_currency) setCurrency(setup.primary_currency)
          if (setup.accent_color) {
            setBrandColor(setup.accent_color)
            setCustomHex(setup.accent_color)
            applyRuntimeTheme(setup.accent_color)
          }
          if (setup.logo) setLogoData(setup.logo)
        }
        if (profile) {
          setProfileId(profile.id)
          const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
          if (fullName) setManagerName(fullName)
          if (profile.email) setManagerEmail(profile.email)
          if (profile.phone_number && !setup?.phone) setPhone(profile.phone_number)
        }
      } catch {
        /* fallback smoothly to current state */
      }
    }
    loadBackendData()
    return () => {
      mounted = false
    }
  }, [])

  // Compute contrast against daylight
  const contrastInfo = React.useMemo(() => {
    return evaluateDaylightContrast(brandColor)
  }, [brandColor])

  // Handle color change from preset
  const handleSelectPreset = (hex: string) => {
    setBrandColor(hex)
    setCustomHex(hex)
    applyRuntimeTheme(hex)
  }

  // Handle custom hex input
  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setBrandColor(val)
      applyRuntimeTheme(val)
    }
  }

  // Handle logo file upload (with 2MB and format checks per spec)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Format check: PNG, JPG, JPEG, WebP, SVG
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setLogoError("Please upload a PNG, JPG, WebP, or SVG image.")
      return
    }

    // 2. File size limit: Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Logo file size must be under 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setLogoData(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoData(undefined)
    setLogoError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // 1. Persist to backend endpoints if available
    try {
      if (setupId) {
        await restaurantSetupApi.updateSetup(setupId, {
          trading_name: tradingName.trim(),
          business_address: address.trim(),
          city: city.trim(),
          phone: phone.trim(),
          primary_currency: currency,
          accent_color: brandColor,
        })
      }
      if (profileId) {
        const nameParts = managerName.trim().split(" ")
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""
        await userProfileApi.updateProfile(profileId, {
          first_name: firstName,
          last_name: lastName,
          email: managerEmail.trim(),
        })
      }
    } catch (err) {
      console.warn("Backend update failed, persisting locally:", err)
    } finally {
      setIsSaving(false)
    }

    // 2. Update local state and theme
    updateRestaurant({
      name: restaurantName.trim() || restaurant.name,
      tradingName: tradingName.trim() || restaurant.name,
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      currency,
      brandColor,
      logo: logoData,
    })
    updateUser({
      name: managerName.trim() || user.name,
      email: managerEmail.trim() || user.email,
    })
    applyRuntimeTheme(brandColor)
    onSavedNotice("Restaurant branding & profile saved! Applied at runtime for all staff logins.")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Brand Identity & Runtime Theming (Section 3.2 per-tenant branding) */}
      <Card className="rounded-[22px] border-border/70 bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Palette className="size-4.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Brand Identity &amp; Runtime Theming
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Configure your restaurant logo and daylight-readable brand color accent (themes POS and dashboard at runtime)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1 text-[11px] font-semibold text-muted-foreground border border-border/60">
            <Sparkles className="size-3 text-primary" />
            <span>App Themes at Runtime</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Logo Upload Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Restaurant Logo</span>
              <span className="text-[11px] text-muted-foreground">PNG, JPG, SVG up to 2MB</span>
            </label>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-border bg-muted/20">
              {/* Logo Preview */}
              <div className="relative size-16 shrink-0 rounded-2xl border border-border/80 bg-card p-1.5 shadow-2xs flex items-center justify-center overflow-hidden">
                {logoData ? (
                  <img
                    src={logoData}
                    alt="Restaurant Logo"
                    className="h-full w-full object-contain rounded-xl"
                  />
                ) : (
                  <div
                    className="flex size-full items-center justify-center rounded-xl text-white font-black text-sm"
                    style={{ backgroundColor: brandColor }}
                  >
                    {restaurantName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="restaurant-logo-upload"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs font-semibold rounded-xl gap-1.5"
                  >
                    <Upload className="size-3.5" />
                    <span>Upload Logo</span>
                  </Button>

                  {logoData && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="h-8 text-xs text-muted-foreground hover:text-destructive rounded-xl gap-1"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
                {logoError ? (
                  <p className="text-[11px] text-destructive font-medium">{logoError}</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">
                    Shown on top navigation, receipt headers, and shared POS login
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Daylight Contrast Checker Indicator */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Daylight Contrast Verification</span>
              <span className="text-[11px] text-muted-foreground">WCAG Legibility Standard</span>
            </label>

            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Sun className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      Sunlight Contrast Ratio: {contrastInfo.ratio}:1
                    </div>
                    <div className={cn("text-[11px] font-semibold", contrastInfo.statusColor)}>
                      {contrastInfo.ratingLabel}
                    </div>
                  </div>
                </div>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase",
                    contrastInfo.passesAA
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  )}
                >
                  {contrastInfo.passesAAA ? "AAA Ready" : contrastInfo.passesAA ? "AA Ready" : "Warning"}
                </span>
              </div>

              {/* Live Preview Card */}
              <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-muted-foreground">Live Theme Preview:</span>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs transition-all"
                    style={{ backgroundColor: brandColor }}
                  >
                    Button CTA
                  </span>
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold border transition-all"
                    style={{
                      borderColor: brandColor,
                      color: brandColor,
                      backgroundColor: `${brandColor}15`,
                    }}
                  >
                    Active Tag
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Accent Palette Selector */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-foreground">
            Brand Accent Color (Choose Preset or Custom Hex)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {PRESET_ACCENTS.map((preset) => {
              const isSelected = brandColor.toLowerCase() === preset.hex.toLowerCase()
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.hex)}
                  className={cn(
                    "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative cursor-pointer",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 bg-card shadow-xs"
                      : "border-border/70 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className="size-5 rounded-full shadow-2xs border border-black/10 flex items-center justify-center text-white"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </span>
                    <span className="text-[9px] font-semibold text-muted-foreground">
                      {preset.recommendedTag}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground truncate w-full">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {preset.hex}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Custom Hex Color Picker */}
          <div className="flex items-center gap-3 pt-2 max-w-sm">
            <div className="relative flex items-center">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => {
                  setBrandColor(e.target.value)
                  setCustomHex(e.target.value)
                  applyRuntimeTheme(e.target.value)
                }}
                className="size-9 rounded-xl border border-border cursor-pointer bg-background p-1"
                title="Select custom accent color"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={customHex}
                onChange={handleCustomHexChange}
                placeholder="#C85A24"
                maxLength={7}
                className="h-9 w-full rounded-xl border border-border bg-background px-3 font-mono text-xs text-foreground uppercase focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSelectPreset("#C85A24")}
              className="h-9 text-xs rounded-xl gap-1 shrink-0"
              title="Reset to Bara Terracotta"
            >
              <RefreshCw className="size-3" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </Card>

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
          className="h-9.5 gap-1.5 rounded-xl text-white text-xs font-bold px-6 shadow-xs transition-colors"
          style={{ backgroundColor: brandColor }}
        >
          <Save className="size-3.5" />
          <span>Save &amp; Apply Theme</span>
        </Button>
      </div>
    </form>
  )
}
