import * as React from "react"

import { BaraLogoBadge } from "@/components/bara-logo"
import { cn } from "@/lib/utils"

/** Shared input styling for the auth forms (icon sits at the left) */
export const authInputClass =
  "h-11 w-full rounded-lg border border-[#EADFCF] bg-[#FFFBF4] dark:bg-[#251E1A] dark:border-[#3D3028] pl-11 text-sm text-[#3B2F2A] dark:text-[#FAF3E7] placeholder:text-[#A6978C] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"

/** Outlined diamond lattice for the dark brand panel */
export function DarkDiamonds() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="bara-dark-diamonds"
          width="220"
          height="220"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M110 0 L220 110 L110 220 L0 110 Z"
            fill="none"
            stroke="#EA982C"
            strokeOpacity="0.16"
            strokeWidth="1.5"
          />
          <path
            d="M110 28 L192 110 L110 192 L28 110 Z"
            fill="none"
            stroke="#EA982C"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bara-dark-diamonds)" />
    </svg>
  )
}

/** Large tonal diamonds for the cream form panel */
export function LightDiamonds() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-[#F3E8D6] dark:text-[#1B1613]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="bara-light-diamonds"
          width="460"
          height="460"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(-120 -60)"
        >
          <path d="M230 0 L460 230 L230 460 L0 230 Z" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bara-light-diamonds)" />
    </svg>
  )
}

export function AuthShell({
                            eyebrow,
                            eyebrowClassName,
                            heading,
                            description,
                            extra,
                            maxWidthClass = "max-w-[560px]",
                            children,
                          }: {
  eyebrow: string
  eyebrowClassName?: string
  heading: React.ReactNode
  description: string
  /** Chip or checklist shown under the description on the brand panel */
  extra?: React.ReactNode
  /** Max width of the form card column (right side) */
  maxWidthClass?: string
  /** The form card (right side) */
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh w-full grid lg:grid-cols-[45fr_55fr]">
      {/* LEFT: brand panel (pinned to the viewport on large screens) */}
      <div className="relative hidden lg:flex flex-col overflow-hidden lg:sticky lg:top-0 lg:h-dvh bg-[#3A1305] bg-[linear-gradient(170deg,#BA400D_0%,#6C2309_22%,#471806_45%,#3A1305_100%)] p-12 text-white">
        <DarkDiamonds />

        <div className="relative z-10">
          <BaraLogoBadge />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center py-12">
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.08em] text-white",
              eyebrowClassName
            )}
          >
            {eyebrow}
          </p>

          <h2 className="mt-5 text-4xl xl:text-[44px] font-bold leading-[1.12] tracking-tight font-[family-name:var(--font-ubuntu)]">
            {heading}
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
            {description}
          </p>

          {extra}
        </div>

        <p className="relative z-10 text-xs text-white/50">
          Need help? support@bara.rw · +250 788 220 084
        </p>
      </div>

      {/* RIGHT: form panel */}
      <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#FAF3E7] dark:bg-[#151210] p-4 sm:p-8 lg:p-12">
        <LightDiamonds />

        <div className={cn("relative z-10 w-full", maxWidthClass)}>
          {/* Mobile logo (small screens only) */}
          <div className="mb-8 flex justify-center lg:hidden">
            <BaraLogoBadge widthClass="w-28" />
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}