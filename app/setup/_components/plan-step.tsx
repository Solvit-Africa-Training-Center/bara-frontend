"use client"

import * as React from "react"
import { ArrowLeft, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ANNUAL_DISCOUNT,
  formatRwf,
  plans,
  type Billing,
  type PlanId,
  type SetupData,
} from "../_lib/data"
import { StepHeading, ghostBtn } from "./ui"

export function PlanStep({
                           data,
                           update,
                           onChoose,
                           onBack,
                         }: {
  data: SetupData
  update: (patch: Partial<SetupData>) => void
  onChoose: (id: PlanId) => void
  onBack: () => void
}) {
  const { billing, plan } = data

  return (
    <div className="mx-auto w-full max-w-[1040px]">
      <StepHeading
        center
        step={3}
        title="Choose the tools your restaurant needs"
        subtitle="Start with daily operations, add reporting as you grow, or unlock practical AI analysis. All plans keep your data synced securely."
      />

      <div className="flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 rounded-lg border border-[#EFE4D6] bg-[#FFF9F0] p-1 dark:border-[#382C24] dark:bg-[#1E1815]"
        >
          {(["monthly", "annual"] as Billing[]).map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={billing === b}
              onClick={() => update({ billing: b })}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-2 rounded-md px-4 text-xs font-bold capitalize transition-colors",
                billing === b
                  ? "bg-white text-[#3B2F2A] shadow-sm dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                  : "text-[#75665E] hover:text-[#3B2F2A] dark:text-[#BAACA1]"
              )}
            >
              {b}
              {b === "annual" && (
                <span className="rounded-full bg-[#DDEBDD] px-2 py-0.5 text-[10px] font-bold text-[#2F5233]">
                  Save 10%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3 md:items-stretch">
        {plans.map((p) => {
          const price =
            billing === "annual" ? p.price * (1 - ANNUAL_DISCOUNT) : p.price

          return (
            <section
              key={p.id}
              className={cn(
                "flex flex-col rounded-2xl border p-6 shadow-[0_1px_0_#EADFCE,0_14px_28px_-18px_rgba(59,47,42,0.3)] dark:shadow-none",
                p.highlight
                  ? "border-[#2F5233] bg-[#E6EFE2] dark:border-[#3E6B42] dark:bg-[#1C2A1E]"
                  : "border-[#EFE4D6] bg-[#FFF9F0] dark:border-[#382C24] dark:bg-[#1E1815]",
                plan === p.id && "ring-2 ring-[#C1440E]"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
                  {p.name}
                </h2>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                    p.highlight
                      ? "bg-[#2F5233] text-white"
                      : "bg-[#F1E6D2] text-[#75665E] dark:bg-[#382C24] dark:text-[#BAACA1]"
                  )}
                >
                  {p.badge}
                </span>
              </div>

              <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#3B2F2A] dark:text-[#FAF3E7]">
                {formatRwf(price)}{" "}
                <span className="text-xs font-medium text-[#75665E] dark:text-[#BAACA1]">
                  / month
                </span>
              </p>
              {billing === "annual" && (
                <p className="mt-0.5 text-[11px] text-[#75665E] dark:text-[#BAACA1]">
                  Billed yearly: {formatRwf(price * 12)}
                </p>
              )}

              <p className="mt-3 text-sm text-[#75665E] dark:text-[#BAACA1]">
                {p.blurb}
              </p>

              <ul className="mt-4 flex-1 space-y-2.5 border-t border-[#E4D6C4] pt-4 dark:border-[#3D3028]">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[13px] text-[#3B2F2A] dark:text-[#E8DDD2]"
                  >
                    <Check className="size-3.5 shrink-0 stroke-[2.5] text-[#2F5233] dark:text-[#7DB383]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onChoose(p.id)}
                className={cn(
                  "mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-[0.99]",
                  p.highlight
                    ? "bg-[#C1440E] text-white shadow-sm hover:bg-[#A8380A]"
                    : "border border-[#E4D6C4] bg-[#FFFBF4] text-[#3B2F2A] hover:border-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                )}
              >
                Choose {p.name}
              </button>
            </section>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className={ghostBtn}>
          <ArrowLeft className="size-4 stroke-[2.2]" />
          <span>Back</span>
        </button>
        <a
          href="mailto:support@bara.rw"
          className="text-xs font-bold text-[#C1440E] underline-offset-4 hover:underline"
        >
          Questions? Talk to Bara support
        </a>
      </div>
    </div>
  )
}