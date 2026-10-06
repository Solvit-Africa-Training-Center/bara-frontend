"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Palette,
  Percent,
  Sliders,
  Sparkles,
  UploadCloud,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function RestoSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3 | 4>(1)

  // Step 1: Restaurant Info
  const [restoName, setRestoName] = React.useState("Bara Bistro & Grill")
  const [branchName, setBranchName] = React.useState("Kigali - Nyarutarama Branch")
  const [address, setAddress] = React.useState("KG 9 Ave, Nyarutarama, Kigali, Rwanda")
  const [serviceType, setServiceType] = React.useState("Full-Service Bistro & Bar")
  const [currency, setCurrency] = React.useState("RWF (Rwandan Franc)")
  const [openingTime, setOpeningTime] = React.useState("10:00")
  const [closingTime, setClosingTime] = React.useState("23:30")

  // Step 2: Branding
  const [selectedColor, setSelectedColor] = React.useState("#C85A24")
  const [logoPreview, setLogoPreview] = React.useState("/bara-logo.svg")

  // Step 3: Operations & Margins
  const [kitchenTarget, setKitchenTarget] = React.useState("32")
  const [barTarget, setBarTarget] = React.useState("22")
  const [posSystem, setPosSystem] = React.useState("Toast / Live POS Connected")
  const [aiAssistantEnabled, setAiAssistantEnabled] = React.useState(true)
  const [varianceAlertThreshold, setVarianceAlertThreshold] = React.useState("5")

  // Step 4: Plan
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("monthly")
  const [selectedPlan, setSelectedPlan] = React.useState<"starter" | "pro" | "ai">("ai")
  const [completing, setCompleting] = React.useState(false)

  const handleFinish = () => {
    setCompleting(true)
    setTimeout(() => {
      router.push("/")
    }, 700)
  }

  const steps = [
    { number: 1, title: "Profile", desc: "Branch Details" },
    { number: 2, title: "Branding", desc: "Logo & Colors" },
    { number: 3, title: "Operations", desc: "Margins & AI" },
    { number: 4, title: "Plans", desc: "Subscription" },
  ]

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] dark:bg-[#151210] flex flex-col justify-between text-foreground">
      {/* Top Header with bara-logo.svg and 4-Step Stepper matching Figma Frame 3 & 4 */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo badge with official bara-logo.svg */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="rounded-xl bg-white p-1.5 shadow-xs border border-border/40">
              <Image
                src="/bara-logo.svg"
                alt="Bara"
                width={120}
                height={40}
                priority
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="hidden md:inline-block text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2 border-l border-border/60">
              Venue Setup
            </span>
          </Link>

          {/* Stepper with 4 Steps */}
          <div className="flex items-center gap-2 sm:gap-4">
            {steps.map((s, idx) => {
              const isCompleted = currentStep > s.number
              const isCurrent = currentStep === s.number
              return (
                <div key={s.number} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(s.number as 1 | 2 | 3 | 4)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 text-xs font-bold transition-all",
                      isCurrent
                        ? "bg-[#C85A24] text-white shadow-xs"
                        : isCompleted
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full text-[10px] font-black",
                        isCurrent
                          ? "bg-white text-[#C85A24]"
                          : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <Check className="size-3 stroke-[3]" /> : s.number}
                    </span>
                    <span className="hidden sm:inline">{s.title}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-3 sm:w-6 h-0.5 mx-1",
                        currentStep > idx + 1 ? "bg-emerald-500" : "bg-border"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Skip / Exit link */}
          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Skip to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Brand Multi-color Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#C1440E] via-[#E56A1C] via-[#EA982C] via-[#EBA529] to-[#2F5233]" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* STEP 1: RESTAURANT PROFILE */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Step 1 of 4 • Restaurant Identity
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Set up your restaurant profile
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter your establishment location, service model, and primary operating currency.
              </p>
            </div>

            <Card className="rounded-3xl border-border bg-card shadow-lg p-6 sm:p-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="resto-name">Restaurant or Venue Name</Label>
                  <Input
                    id="resto-name"
                    value={restoName}
                    onChange={(e) => setRestoName(e.target.value)}
                    placeholder="e.g. Bara Bistro & Grill"
                    className="h-10 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="branch-name">Branch / Location Title</Label>
                  <Input
                    id="branch-name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. Nyarutarama Flagship"
                    className="h-10 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="service-type">Hospitality Model</Label>
                  <select
                    id="service-type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:border-ring focus:outline-none"
                  >
                    <option value="Full-Service Bistro & Bar">Full-Service Bistro &amp; Bar</option>
                    <option value="Casual Dining & Grill">Casual Dining &amp; Grill</option>
                    <option value="Specialty Cafe & Bakery">Specialty Cafe &amp; Bakery</option>
                    <option value="Bar & Cocktail Lounge">Bar &amp; Cocktail Lounge</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Physical Street Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="KG 9 Ave, Nyarutarama, Kigali, Rwanda"
                    className="h-10 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currency">Base Ledger Currency</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:border-ring focus:outline-none"
                  >
                    <option value="RWF (Rwandan Franc)">RWF (Rwandan Franc)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="KES (Kenyan Shilling)">KES (Kenyan Shilling)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Daily Operating Rhythm</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      className="h-10 rounded-xl bg-background text-xs"
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      className="h-10 rounded-xl bg-background text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-border/60">
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="h-10.5 px-6 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs gap-2 shadow-md"
                >
                  <span>Continue to Brand Identity</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 2: BRANDING & IDENTITY */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Step 2 of 4 • Visual Branding
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Restaurant Brand &amp; Visual Identity
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Upload your establishment logo and select your restaurant color theme.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Logo Upload Card using bara-logo.svg */}
              <Card className="rounded-3xl border-border bg-card shadow-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <UploadCloud className="size-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">Establishment Logo</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This logo appears on daily POS printouts, invoices, and manager audits.
                  </p>

                  <div className="mt-5 rounded-2xl border-2 border-dashed border-border bg-background/60 p-6 flex flex-col items-center justify-center text-center">
                    <div className="rounded-2xl bg-white p-3 shadow-md border border-border/60">
                      <Image
                        src={logoPreview}
                        alt="Restaurant Logo"
                        width={140}
                        height={50}
                        priority
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <p className="text-xs font-semibold text-foreground mt-3">
                      bara-logo.svg active
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Vector SVG high-resolution format
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 rounded-xl text-xs font-semibold"
                    onClick={() => alert("Upload custom logo simulation: Select file from disk")}
                  >
                    Change Logo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setLogoPreview("/bara-logo.svg")}
                  >
                    Reset
                  </Button>
                </div>
              </Card>

              {/* Brand Palette Card */}
              <Card className="rounded-3xl border-border bg-card shadow-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Palette className="size-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">Brand Color Palette</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select your signature accent color for menu cards and ledger themes.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Bistro Terracotta", hex: "#C85A24" },
                        { name: "Forest Pine", hex: "#2F5233" },
                        { name: "Warm Ochre", hex: "#EA982C" },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setSelectedColor(c.hex)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-2xl p-3 border text-center transition-all cursor-pointer",
                            selectedColor === c.hex
                              ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div
                            className="size-8 rounded-full shadow-xs flex items-center justify-center text-white"
                            style={{ backgroundColor: c.hex }}
                          >
                            {selectedColor === c.hex && <Check className="size-4 stroke-[3]" />}
                          </div>
                          <span className="text-[11px] font-bold text-foreground">{c.name}</span>
                          <span className="text-[10px] text-muted-foreground">{c.hex}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Label htmlFor="custom-hex">Custom Accent Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="size-9 rounded-xl cursor-pointer border border-border p-0.5 bg-background"
                        />
                        <Input
                          id="custom-hex"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="h-9 rounded-xl bg-background font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/60">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(1)}
                    className="h-10 rounded-xl text-xs font-semibold gap-1.5"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back</span>
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="h-10 px-6 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs gap-2 shadow-md"
                  >
                    <span>Next: Operations &amp; Margins</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 3: OPERATIONS & MARGINS (Exact Match to Figma Frame 3) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Step 3 of 4 • Financial Governance
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Configure Operations &amp; Margin Targets
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Establish benchmark food cost targets and enable real-time AI operational oversight.
              </p>
            </div>

            <Card className="rounded-3xl border-border bg-card shadow-lg p-6 sm:p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Cost Targets */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Percent className="size-4 text-emerald-600" />
                    <h2 className="text-sm font-bold text-foreground">
                      Target Food &amp; Beverage Cost %
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="kitchen-target">Kitchen Food Cost Target (% of sales)</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          id="kitchen-target"
                          type="number"
                          value={kitchenTarget}
                          onChange={(e) => setKitchenTarget(e.target.value)}
                          className="h-10 w-24 rounded-xl bg-background font-bold text-sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          Industry benchmark: 28% – 34%
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bar-target">Bar &amp; Beverage Cost Target (% of sales)</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          id="bar-target"
                          type="number"
                          value={barTarget}
                          onChange={(e) => setBarTarget(e.target.value)}
                          className="h-10 w-24 rounded-xl bg-background font-bold text-sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          Industry benchmark: 18% – 24%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* POS & Variance Threshold */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Sliders className="size-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">POS System &amp; Alerts</h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="pos-system">POS Integration Channel</Label>
                      <select
                        id="pos-system"
                        value={posSystem}
                        onChange={(e) => setPosSystem(e.target.value)}
                        className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:border-ring focus:outline-none"
                      >
                        <option value="Toast / Live POS Connected">Toast POS (Live Sync)</option>
                        <option value="Square for Restaurants">Square for Restaurants</option>
                        <option value="Oracle Micros POS">Oracle Micros POS</option>
                        <option value="Manual Daily Shift Ledger">Manual Shift Entry &amp; CSV</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="alert-threshold">AI Variance Anomaly Threshold</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          id="alert-threshold"
                          type="number"
                          value={varianceAlertThreshold}
                          onChange={(e) => setVarianceAlertThreshold(e.target.value)}
                          className="h-10 w-24 rounded-xl bg-background font-bold text-sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          Trigger crimson banner when variance &gt; 5%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom AI Highlight Card matching Figma Frame 3 */}
              <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      Enable Bara AI Operations Assistant
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                        Recommended
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-xl">
                      Automated cost variance detection, daily shift anomaly alerts, recipe portion
                      audits, and supplier par-level restock triggers.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={aiAssistantEnabled}
                    onChange={(e) => setAiAssistantEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(2)}
                  className="h-10 rounded-xl text-xs font-semibold gap-1.5"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back</span>
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="h-10.5 px-6 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs gap-2 shadow-md"
                >
                  <span>Next: Choose Plan</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 4: SUBSCRIPTION PLAN (Exact Match to Figma Frame 4) */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Step 4 of 4 • Select Plan
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Choose the tools your restaurant needs
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                Flexible plans designed for single venues and growing multi-unit hospitality groups.
              </p>

              {/* Billing Cycle Switcher */}
              <div className="pt-2 flex justify-center">
                <div className="inline-flex items-center gap-1 rounded-2xl bg-card border border-border p-1 shadow-xs">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={cn(
                      "rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
                      billingCycle === "monthly"
                        ? "bg-[#C85A24] text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Billed Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={cn(
                      "rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                      billingCycle === "annual"
                        ? "bg-[#C85A24] text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>Billed Annually</span>
                    <span className="rounded-full bg-amber-400 text-[#3B1705] px-1.5 py-0.2 text-[10px] font-black">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Pricing Cards */}
            <div className="grid gap-5 md:grid-cols-3 items-stretch">
              {/* Plan 1: Starter */}
              <div
                onClick={() => setSelectedPlan("starter")}
                className={cn(
                  "rounded-3xl border bg-card p-6 shadow-sm flex flex-col justify-between transition-all cursor-pointer",
                  selectedPlan === "starter"
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Starter</h3>
                    <p className="text-xs text-muted-foreground">
                      For cafes &amp; quick-service counters.
                    </p>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">
                      {billingCycle === "monthly" ? "19,000" : "15,200"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">RWF / mo</span>
                  </div>

                  <div className="mt-5 space-y-2.5 text-xs text-muted-foreground border-t border-border/60 pt-4">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Daily Shift Sales Ledger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Category Margin Breakdown</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>2 Manager Logins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Export CSV Accounting</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Button
                    variant={selectedPlan === "starter" ? "default" : "outline"}
                    className={cn(
                      "w-full h-9 rounded-xl text-xs font-bold",
                      selectedPlan === "starter" && "bg-primary text-white"
                    )}
                  >
                    {selectedPlan === "starter" ? "Selected" : "Select Starter"}
                  </Button>
                </div>
              </div>

              {/* Plan 2: Bara Pro */}
              <div
                onClick={() => setSelectedPlan("pro")}
                className={cn(
                  "rounded-3xl border bg-card p-6 shadow-sm flex flex-col justify-between transition-all cursor-pointer",
                  selectedPlan === "pro"
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Bara Pro</h3>
                    <p className="text-xs text-muted-foreground">
                      Full inventory and multi-station control.
                    </p>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">
                      {billingCycle === "monthly" ? "39,000" : "31,200"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">RWF / mo</span>
                  </div>

                  <div className="mt-5 space-y-2.5 text-xs text-muted-foreground border-t border-border/60 pt-4">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Unlimited Staff Logins &amp; Roles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Live Inventory &amp; Par Levels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>POS Shift Reconciliation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Weekly P&amp;L Executive Summaries</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Button
                    variant={selectedPlan === "pro" ? "default" : "outline"}
                    className={cn(
                      "w-full h-9 rounded-xl text-xs font-bold",
                      selectedPlan === "pro" && "bg-primary text-white"
                    )}
                  >
                    {selectedPlan === "pro" ? "Selected" : "Select Pro"}
                  </Button>
                </div>
              </div>

              {/* Plan 3: Pro + AI (Recommended / Highlighted in green tint) */}
              <div
                onClick={() => setSelectedPlan("ai")}
                className={cn(
                  "relative rounded-3xl border-2 bg-emerald-500/5 p-6 shadow-md flex flex-col justify-between transition-all cursor-pointer",
                  selectedPlan === "ai"
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-xl"
                    : "border-emerald-500/40 hover:border-emerald-600"
                )}
              >
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3.5 py-0.5 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-200" />
                  Most Popular
                </div>

                <div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Pro + AI Intelligence</h3>
                    <p className="text-xs text-muted-foreground">
                      Automated variance prevention &amp; par triggers.
                    </p>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">
                      {billingCycle === "monthly" ? "69,000" : "55,200"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">RWF / mo</span>
                  </div>

                  <div className="mt-5 space-y-2.5 text-xs text-foreground font-medium border-t border-border/60 pt-4">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>All Pro Tier Features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>AI Recipe Portion Cost Auditing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Automated Leakage &amp; Anomaly Alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Supplier Price Comparison</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>Priority 24/7 Hospitality Support</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Button
                    className={cn(
                      "w-full h-10 rounded-xl text-xs font-extrabold shadow-sm",
                      selectedPlan === "ai"
                        ? "bg-[#C85A24] text-white hover:bg-[#B34D1C]"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    )}
                  >
                    {selectedPlan === "ai" ? "Selected (14-Day Free Trial)" : "Select Pro + AI"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Finalize Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(3)}
                className="h-10 rounded-xl text-xs font-semibold gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Operations</span>
              </Button>

              <Button
                onClick={handleFinish}
                disabled={completing}
                className="w-full sm:w-auto h-11 px-8 rounded-2xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-extrabold text-sm gap-2 shadow-lg transition-all"
              >
                {completing ? (
                  "Finalizing Setup..."
                ) : (
                  <>
                    <span>Complete Setup &amp; Launch Dashboard</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-4 px-6 text-center text-xs text-muted-foreground">
        &copy; 2026 Bara Technologies. Powered by automated restaurant intelligence.
      </footer>
    </div>
  )
}
