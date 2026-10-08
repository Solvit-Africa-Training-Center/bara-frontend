"use client"

import * as React from "react"
import {
  ArrowRight,
  Banknote,
  ChevronDown,
  MapPin,
  Store,
  Upload,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  MAX_LOGO_BYTES,
  GUIDED_FEE,
  brandColors,
  currencies,
  formatRwf,
  type SetupData,
} from "../_lib/data"
import {
  Field,
  StepHeading,
  cardClass,
  iconClass,
  inputBase,
  labelClass,
  primaryBtn,
} from "./ui"

export function RestaurantStep({
                                 data,
                                 update,
                                 onContinue,
                               }: {
  data: SetupData
  update: (patch: Partial<SetupData>) => void
  onContinue: () => void
}) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [logoError, setLogoError] = React.useState("")

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setLogoError("Please choose a PNG or JPG image.")
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("The logo must be 5 MB or smaller.")
      return
    }
    setLogoError("")
    const reader = new FileReader()
    reader.onload = () => update({ logo: reader.result as string })
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
  }

  const name = data.restaurantName || "your restaurant"

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[1040px]">
      <StepHeading
        step={2}
        title={`Set up ${name}`}
        subtitle="These details shape your receipts, workspace and first operating setup."
      />

      <div className="grid gap-5 lg:grid-cols-[340px_1fr] lg:items-start">
        {/* Identity */}
        <section className={cardClass}>
          <h2 className="text-sm font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
            Restaurant identity
          </h2>
          <p className="mt-0.5 text-xs text-[#75665E] dark:text-[#BAACA1]">
            Upload a clear square logo for the POS and receipts.
          </p>

          <div className="mt-4 flex flex-col items-center gap-4 rounded-xl border border-dashed border-[#DCCDB8] px-4 py-6 dark:border-[#4A3B31]">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
              {data.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.logo}
                  alt="Restaurant logo preview"
                  className="size-full object-contain"
                />
              ) : (
                <Store className="size-8 stroke-[1.4] text-[#B9A998]" />
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogo}
              className="sr-only"
              aria-label="Upload restaurant logo"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#E4D6C4] bg-[#FFFBF4] px-4 text-xs font-bold text-[#3B2F2A] transition-colors hover:border-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
            >
              <Upload className="size-3.5 stroke-[2]" />
              {data.logo ? "Replace logo" : "Upload restaurant logo"}
            </button>
            <p className="text-[11px] text-[#8F8179]">PNG or JPG · up to 5 MB</p>
            {logoError && (
              <p className="text-xs font-semibold text-[#C1440E]">{logoError}</p>
            )}
          </div>

          <div className="mt-5">
            <p className={labelClass}>Color palette</p>
            <div className="mt-2.5 flex items-center gap-2.5">
              {brandColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update({ brandColor: color })}
                  aria-label={`Use brand color ${color}`}
                  aria-pressed={data.brandColor === color}
                  className={cn(
                    "size-8 cursor-pointer rounded-lg border-2 border-transparent transition-all",
                    data.brandColor === color &&
                    "ring-2 ring-offset-2 ring-offset-[#FFF9F0] dark:ring-offset-[#1E1815]"
                  )}
                  style={{
                    backgroundColor: color,
                    ...(data.brandColor === color
                      ? ({ "--tw-ring-color": color } as React.CSSProperties)
                      : {}),
                  }}
                />
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-[#8F8179]">
              Used as the accent color on receipts and in your workspace.
            </p>
          </div>
        </section>

        {/* Details */}
        <div className="space-y-5">
          <section className={cardClass}>
            <h2 className="text-sm font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
              Business details
            </h2>
            <p className="mt-0.5 text-xs text-[#75665E] dark:text-[#BAACA1]">
              Used for invoices, receipts and support.
            </p>

            <div className="mt-4 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field id="trading-name" label="Trading name">
                  <input
                    id="trading-name"
                    required
                    value={data.tradingName}
                    onChange={(e) => update({ tradingName: e.target.value })}
                    placeholder="Ikaze Bistro"
                    className={cn(inputBase, "px-3.5")}
                  />
                </Field>
                <Field id="tin" label="TIN">
                  <input
                    id="tin"
                    inputMode="numeric"
                    value={data.tin}
                    onChange={(e) => update({ tin: e.target.value })}
                    placeholder="103 884 291"
                    className={cn(inputBase, "px-3.5")}
                  />
                </Field>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field id="phone" label="Phone">
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => update({ phone: e.target.value })}
                    placeholder="+250 788 220 084"
                    className={cn(inputBase, "px-3.5")}
                  />
                </Field>
                <Field id="city" label="City">
                  <input
                    id="city"
                    required
                    value={data.city}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="Kigali"
                    className={cn(inputBase, "px-3.5")}
                  />
                </Field>
              </div>

              <Field id="address" label="Business address">
                <div className="relative flex items-center">
                  <MapPin className={iconClass} />
                  <input
                    id="address"
                    required
                    value={data.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="KG 9 Ave, Kimihurura, Kigali"
                    className={cn(inputBase, "pl-10 pr-4")}
                  />
                </div>
              </Field>

              <Field id="currency" label="Primary currency">
                <div className="relative flex items-center">
                  <Banknote className={iconClass} />
                  <select
                    id="currency"
                    value={data.currency}
                    onChange={(e) => update({ currency: e.target.value })}
                    className={cn(
                      inputBase,
                      "cursor-pointer appearance-none pl-10 pr-10"
                    )}
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
                </div>
              </Field>
            </div>
          </section>

          {/* Guided onboarding */}
          <section className="rounded-2xl border border-[#EBD9AE] bg-[#F8EBCB] p-5 dark:border-[#4A3B1F] dark:bg-[#2C2415]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
                Need help with setup?
              </h2>
              <button
                type="button"
                role="switch"
                aria-checked={data.guided}
                aria-label="Add Bara guided onboarding"
                onClick={() => update({ guided: !data.guided })}
                className={cn(
                  "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
                  data.guided ? "bg-[#2F5233]" : "bg-[#D6CBC0]"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                    data.guided && "translate-x-5"
                  )}
                />
              </button>
            </div>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
                  Bara guided onboarding
                </p>
                <p className="text-[11px] text-[#75665E] dark:text-[#BAACA1]">
                  Remote setup session · up to 2 hours
                </p>
              </div>
              <p className="text-sm font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
                {formatRwf(GUIDED_FEE)}
              </p>
            </div>
          </section>

          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#75665E] dark:text-[#A6978C]">
              You can edit these details later in Settings.
            </p>
            <button type="submit" className={primaryBtn}>
              <ArrowRight className="size-4 stroke-[2.2]" />
              <span>Continue to choose plan</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}