import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export const labelClass = "text-xs font-bold text-[#3B2F2A] dark:text-[#FAF3E7]"
export const inputBase =
  "h-10 w-full rounded-lg border border-[#EADFCF] bg-[#FFFBF4] dark:bg-[#251E1A] dark:border-[#3D3028] text-sm text-[#3B2F2A] dark:text-[#FAF3E7] placeholder:text-[#A6978C] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
export const cardClass =
  "rounded-2xl border border-[#EFE4D6] dark:border-[#382C24] bg-[#FFF9F0] dark:bg-[#1E1815] p-5 shadow-[0_1px_0_#EADFCE,0_14px_28px_-18px_rgba(59,47,42,0.3)] dark:shadow-none"
export const iconClass =
  "pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]"
export const primaryBtn =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#A8380A] active:scale-[0.99] disabled:opacity-60"
export const ghostBtn =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#E4D6C4] bg-[#FFFBF4] px-5 text-sm font-bold text-[#3B2F2A] transition-colors hover:border-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"

export function Field({
                        id,
                        label,
                        children,
                      }: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className={labelClass}>
        {label}
      </Label>
      {children}
    </div>
  )
}

export function StepHeading({
                              step,
                              title,
                              subtitle,
                              center,
                            }: {
  step: number
  title: string
  subtitle: string
  center?: boolean
}) {
  return (
    <div className={cn("mb-6", center && "text-center")}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#C1440E]">
        Step {step} of 4
      </p>
      <h1 className="mt-1.5 font-[family-name:var(--font-ubuntu)] text-3xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF3E7]">
        {title}
      </h1>
      <p
        className={cn(
          "mt-1 text-sm text-[#75665E] dark:text-[#BAACA1]",
          center && "mx-auto max-w-xl"
        )}
      >
        {subtitle}
      </p>
    </div>
  )
}