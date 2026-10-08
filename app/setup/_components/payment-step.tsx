"use client"

import * as React from "react"
import { Lock, Smartphone } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ANNUAL_DISCOUNT,
  GUIDED_FEE,
  formatRwf,
  plans,
  type SetupData,
} from "../_lib/data"
import { Field, StepHeading, cardClass, iconClass, inputBase, primaryBtn } from "./ui"

export function PaymentStep({
                              data,
                              update,
                              paying,
                              onPay,
                              onChangePlan,
                            }: {
  data: SetupData
  update: (patch: Partial<SetupData>) => void
  paying: boolean
  onPay: () => void
  onChangePlan: () => void
}) {
  const selectedPlan = plans.find((p) => p.id === data.plan)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPay()
  }

  const planCharge = selectedPlan
    ? data.billing === "annual"
      ? selectedPlan.price * 12 * (1 - ANNUAL_DISCOUNT)
      : selectedPlan.price
    : 0
  const total = planCharge + (data.guided ? GUIDED_FEE : 0)

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[760px]">
      <StepHeading
        step={4}
        title="Confirm and pay"
        subtitle="Review your plan and pay with mobile money to activate your workspace."
      />

      {!selectedPlan ? (
        <section className={cardClass}>
          <p className="text-sm text-[#3B2F2A] dark:text-[#E8DDD2]">
            You haven&apos;t chosen a plan yet.
          </p>
          <button
            type="button"
            onClick={onChangePlan}
            className={cn(primaryBtn, "mt-4")}
          >
            Choose a plan
          </button>
        </section>
      ) : (
        <div className="grid gap-5 md:grid-cols-[1fr_300px] md:items-start">
          {/* Mobile money */}
          <section className={cardClass}>
            <h2 className="text-sm font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
              Pay with mobile money
            </h2>
            <p className="mt-0.5 text-xs text-[#75665E] dark:text-[#BAACA1]">
              You&apos;ll get a prompt on your phone to approve the payment.
            </p>

            <div
              role="radiogroup"
              aria-label="Mobile money provider"
              className="mt-4 grid grid-cols-2 gap-3"
            >
              {(
                [
                  { id: "mtn", label: "MTN MoMo" },
                  { id: "airtel", label: "Airtel Money" },
                ] as const
              ).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={data.provider === o.id}
                  onClick={() => update({ provider: o.id })}
                  className={cn(
                    "h-11 cursor-pointer rounded-lg border text-sm font-bold transition-colors",
                    data.provider === o.id
                      ? "border-[#C1440E] bg-[#FBEDE4] text-[#C1440E] dark:bg-[#2C1A12]"
                      : "border-[#E4D6C4] bg-[#FFFBF4] text-[#3B2F2A] hover:border-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Field id="momo-phone" label="Mobile money number">
                <div className="relative flex items-center">
                  <Smartphone className={iconClass} />
                  <input
                    id="momo-phone"
                    type="tel"
                    required
                    value={data.momoPhone}
                    onChange={(e) => update({ momoPhone: e.target.value })}
                    placeholder="+250 788 220 084"
                    className={cn(inputBase, "pl-10 pr-4")}
                  />
                </div>
              </Field>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-[#75665E] dark:text-[#A6978C]">
              <Lock className="size-3.5 shrink-0 stroke-[1.8] text-[#5B8C5A]" />
              Your payment details are encrypted and never stored by Bara.
            </p>
          </section>

          {/* Summary */}
          <section className={cardClass}>
            <h2 className="text-sm font-bold text-[#3B2F2A] dark:text-[#FAF3E7]">
              Order summary
            </h2>

            <dl className="mt-4 space-y-2.5 text-[13px] text-[#3B2F2A] dark:text-[#E8DDD2]">
              <div className="flex items-start justify-between gap-3">
                <dt>
                  {selectedPlan.name} plan
                  <span className="block text-[11px] text-[#75665E] dark:text-[#BAACA1]">
                    {data.billing === "annual"
                      ? "Billed yearly (10% off)"
                      : "Billed monthly"}
                  </span>
                </dt>
                <dd className="font-semibold">{formatRwf(planCharge)}</dd>
              </div>
              {data.guided && (
                <div className="flex items-start justify-between gap-3">
                  <dt>
                    Guided onboarding
                    <span className="block text-[11px] text-[#75665E] dark:text-[#BAACA1]">
                      One-time setup session
                    </span>
                  </dt>
                  <dd className="font-semibold">{formatRwf(GUIDED_FEE)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#E4D6C4] pt-3 text-sm font-bold dark:border-[#3D3028]">
                <dt>Due today</dt>
                <dd>{formatRwf(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={paying}
              className={cn(primaryBtn, "mt-5 w-full")}
            >
              {paying ? "Sending request..." : `Pay ${formatRwf(total)}`}
            </button>
            <button
              type="button"
              onClick={onChangePlan}
              className="mt-3 w-full cursor-pointer text-center text-xs font-bold text-[#C1440E] underline-offset-4 hover:underline"
            >
              Change plan
            </button>
          </section>
        </div>
      )}
    </form>
  )
}