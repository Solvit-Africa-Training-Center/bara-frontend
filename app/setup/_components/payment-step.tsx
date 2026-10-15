"use client"

import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  Smartphone,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ANNUAL_DISCOUNT,
  GUIDED_FEE,
  formatRwf,
  plans,
  type SetupData,
} from "../_lib/data"

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
  const activePlan = plans.find((p) => p.id === data.plan) || plans[2] // Fallback to Premium
  const [paymentMethod, setPaymentMethod] = React.useState<"momo" | "card">(
    data.paymentMethod || "momo"
  )
  const [accountHolder, setAccountHolder] = React.useState(
    data.accountHolder ||
      (data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : "Aline Mukamana")
  )
  const [cardNumber, setCardNumber] = React.useState("")
  const [cardExpiry, setCardExpiry] = React.useState("")
  const [cardCvc, setCardCvc] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    update({ paymentMethod, accountHolder })
    onPay()
  }

  const planCharge = activePlan
    ? data.billing === "annual"
      ? activePlan.price * 12 * (1 - ANNUAL_DISCOUNT)
      : activePlan.price
    : 49000
  const total = planCharge + (data.guided ? GUIDED_FEE : 0)

  const restaurantDisplayName =
    data.tradingName?.trim() ||
    data.restaurantName?.trim() ||
    "Kigali Heights Bistro"

  return (
    <div className="mx-auto w-full max-w-[1080px] pb-10">
      {/* Centered Step 4 Header */}
      <div className="mb-8 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#C1440E]">
          STEP 4 OF 4
        </p>
        <h1 className="mt-1.5 font-[family-name:var(--font-ubuntu)] text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-[#2D221D] dark:text-[#FAF3E7]">
          You&apos;re one step away from Bara
        </h1>
        <p className="mx-auto mt-1.5 max-w-lg text-xs sm:text-sm text-[#75665E] dark:text-[#BAACA1]">
          Confirm your plan and complete your payment to get your restaurant up and running.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN: Payment Method Box */}
          <div className="lg:col-span-7">
            <div className="rounded-[22px] border border-[#EBE1D4] bg-[#FFFBF5] p-6 sm:p-7 shadow-[0_2px_14px_rgba(45,34,29,0.04)] dark:border-[#382C24] dark:bg-[#1E1815]">
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight text-[#2D221D] dark:text-[#FAF3E7]">
                  Payment method
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5D5048] dark:text-[#BAACA1]">
                  <Lock className="size-3.5 stroke-[2] text-primary" />
                  <span>Secure payment</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-[#75665E] dark:text-[#BAACA1]">
                Choose how you would like to pay for your subscription.
              </p>

              {/* Main Payment Method Switchers (2 options) */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {/* Option 1: Mobile money */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("momo")
                    update({ paymentMethod: "momo" })
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl p-3.5 text-left transition-all cursor-pointer",
                    paymentMethod === "momo"
                      ? "border-2 border-primary bg-primary/10 dark:bg-primary/20"
                      : "border border-[#E4D6C4] bg-[#FFFDF9] hover:border-primary/60 dark:border-[#3D3028] dark:bg-[#251E1A]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Smartphone
                      className={cn(
                        "size-4.5 shrink-0 stroke-[2]",
                        paymentMethod === "momo"
                          ? "text-primary"
                          : "text-[#75665E]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold truncate",
                        paymentMethod === "momo"
                          ? "font-bold text-primary dark:text-[#E8F3ED]"
                          : "text-[#3B2F2A] dark:text-[#FAF3E7]"
                      )}
                    >
                      Mobile money
                    </span>
                  </div>
                  <div
                    className={cn(
                      "size-4 rounded-full flex items-center justify-center shrink-0 ml-1.5",
                      paymentMethod === "momo"
                        ? "border-2 border-primary bg-primary dark:border-primary dark:bg-primary"
                        : "border-2 border-[#D1C2B2] bg-transparent"
                    )}
                  >
                    {paymentMethod === "momo" && (
                      <span className="size-1.5 rounded-full bg-white dark:bg-[#151210]" />
                    )}
                  </div>
                </button>

                {/* Option 2: Debit / credit card */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card")
                    update({ paymentMethod: "card" })
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl p-3.5 text-left transition-all cursor-pointer",
                    paymentMethod === "card"
                      ? "border-2 border-primary bg-primary/10 dark:bg-primary/20"
                      : "border border-[#E4D6C4] bg-[#FFFDF9] hover:border-primary/60 dark:border-[#3D3028] dark:bg-[#251E1A]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CreditCard
                      className={cn(
                        "size-4.5 shrink-0 stroke-[1.8]",
                        paymentMethod === "card"
                          ? "text-primary"
                          : "text-[#75665E]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium truncate",
                        paymentMethod === "card"
                          ? "font-bold text-primary dark:text-[#E8F3ED]"
                          : "text-[#3B2F2A] dark:text-[#FAF3E7]"
                      )}
                    >
                      Debit / credit card
                    </span>
                  </div>
                  <div
                    className={cn(
                      "size-4 rounded-full flex items-center justify-center shrink-0 ml-1.5",
                      paymentMethod === "card"
                        ? "border-2 border-primary bg-primary dark:border-primary dark:bg-primary"
                        : "border-2 border-[#D1C2B2] bg-transparent"
                    )}
                  >
                    {paymentMethod === "card" && (
                      <span className="size-1.5 rounded-full bg-white dark:bg-[#151210]" />
                    )}
                  </div>
                </button>
              </div>

              {/* DETAILS WHEN MOBILE MONEY IS SELECTED */}
              {paymentMethod === "momo" && (
                <div className="mt-5 space-y-4">
                  {/* Provider Radio Pills */}
                  <div>
                    <label className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                      Mobile money provider
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {/* MTN Mobile Money */}
                      <button
                        type="button"
                        onClick={() => update({ provider: "mtn" })}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer",
                          data.provider === "mtn"
                            ? "border-[#C1440E] bg-[#FFFDF9] dark:bg-[#251E1A] text-[#2D221D] ring-1 ring-[#C1440E]"
                            : "border-[#E4D6C4] bg-[#FFFDF9] dark:bg-[#251E1A] text-[#75665E] hover:border-[#C1440E]/60"
                        )}
                      >
                        <div
                          className={cn(
                            "size-3.5 rounded-full flex items-center justify-center shrink-0",
                            data.provider === "mtn"
                              ? "border-2 border-[#C1440E]"
                              : "border-2 border-[#D1C2B2]"
                          )}
                        >
                          {data.provider === "mtn" && (
                            <span className="size-1.5 rounded-full bg-[#C1440E]" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                          MTN Mobile Money
                        </span>
                      </button>

                      {/* Airtel Money */}
                      <button
                        type="button"
                        onClick={() => update({ provider: "airtel" })}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer",
                          data.provider === "airtel"
                            ? "border-[#C1440E] bg-[#FFFDF9] dark:bg-[#251E1A] text-[#2D221D] ring-1 ring-[#C1440E]"
                            : "border-[#E4D6C4] bg-[#FFFDF9] dark:bg-[#251E1A] text-[#75665E] hover:border-[#C1440E]/60"
                        )}
                      >
                        <div
                          className={cn(
                            "size-3.5 rounded-full flex items-center justify-center shrink-0",
                            data.provider === "airtel"
                              ? "border-2 border-[#C1440E]"
                              : "border-2 border-[#D1C2B2]"
                          )}
                        >
                          {data.provider === "airtel" && (
                            <span className="size-1.5 rounded-full bg-[#C1440E]" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-[#75665E] dark:text-[#A6978C]">
                          Airtel Money
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Phone input */}
                  <div>
                    <label
                      htmlFor="momo-phone"
                      className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]"
                    >
                      Mobile money number
                    </label>
                    <input
                      id="momo-phone"
                      type="tel"
                      required
                      value={data.momoPhone}
                      onChange={(e) => update({ momoPhone: e.target.value })}
                      placeholder="+250 78X XXX XXX"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-3.5 text-xs sm:text-sm text-[#2D221D] placeholder:text-[#A6978C] outline-none transition-all focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                    />
                    <span className="mt-1.5 block text-[11px] text-[#8F8179] dark:text-[#A6978C]">
                      Use a number registered with your selected mobile money provider.
                    </span>
                  </div>

                  {/* Account holder name */}
                  <div>
                    <label
                      htmlFor="holder-name"
                      className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]"
                    >
                      Account holder name
                    </label>
                    <input
                      id="holder-name"
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => {
                        setAccountHolder(e.target.value)
                        update({ accountHolder: e.target.value })
                      }}
                      placeholder="Aline Mukamana"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-3.5 text-xs sm:text-sm text-[#2D221D] placeholder:text-[#A6978C] outline-none transition-all focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                    />
                  </div>

                  {/* Peach Instruction Callout Box */}
                  <div className="mt-5 flex items-start gap-3.5 rounded-xl border border-[#F6D5BF] bg-[#FFF1E8] p-4 dark:border-[#4B2C1F] dark:bg-[#2D1B13]">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8A33D]/40 bg-[#FFF7F0] text-[#C1440E] dark:border-[#633A25] dark:bg-[#3D251A]">
                      <Smartphone className="size-4 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                        Approve the payment on your phone
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#75665E] dark:text-[#BAACA1]">
                        After you select Pay &amp; activate, a payment request will be sent to this
                        number. Enter your mobile money PIN on your phone to confirm.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS WHEN DEBIT / CREDIT CARD IS SELECTED */}
              {paymentMethod === "card" && (
                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="card-num"
                      className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]"
                    >
                      Card number
                    </label>
                    <input
                      id="card-num"
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-3.5 text-xs sm:text-sm text-[#2D221D] placeholder:text-[#A6978C] outline-none transition-all focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="card-exp"
                        className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]"
                      >
                        Expiry date
                      </label>
                      <input
                        id="card-exp"
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-3.5 text-xs sm:text-sm text-[#2D221D] placeholder:text-[#A6978C] outline-none transition-all focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="card-cvc"
                        className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]"
                      >
                        CVC
                      </label>
                      <input
                        id="card-cvc"
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-3.5 text-xs sm:text-sm text-[#2D221D] placeholder:text-[#A6978C] outline-none transition-all focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="card-holder"
                      className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]"
                    >
                      Cardholder name
                    </label>
                    <input
                      id="card-holder"
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => {
                        setAccountHolder(e.target.value)
                        update({ accountHolder: e.target.value })
                      }}
                      placeholder="Aline Mukamana"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-3.5 text-xs sm:text-sm text-[#2D221D] placeholder:text-[#A6978C] outline-none transition-all focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
                    />
                  </div>

                  <div className="mt-5 flex items-start gap-3.5 rounded-xl border border-[#F6D5BF] bg-[#FFF1E8] p-4 dark:border-[#4B2C1F] dark:bg-[#2D1B13]">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E8A33D]/40 bg-[#FFF7F0] text-[#C1440E] dark:border-[#633A25] dark:bg-[#3D251A]">
                      <Lock className="size-4 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                        Bank 3D-Secure Authorization
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#75665E] dark:text-[#BAACA1]">
                        You will be redirected to your card issuer to authenticate this subscription
                        charge safely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Terms Disclaimer */}
              <p className="mt-5 text-[11px] leading-normal text-[#8F8179] dark:text-[#A6978C]">
                By continuing, you agree to Bara&apos;s Terms of service and Privacy policy. Your
                subscription renews monthly. You can change plans at any time.
              </p>

              {/* Pay & Activate CTA Button */}
              <button
                type="submit"
                disabled={paying}
                className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C1440E] text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-[#A8380A] active:scale-[0.99] disabled:opacity-70"
              >
                <Lock className="size-4 stroke-[2]" />
                <span>
                  {paying
                    ? "Sending payment request..."
                    : `Pay ${formatRwf(total)} & activate`}
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Plan Card & Order Summary */}
          <div className="space-y-5 lg:col-span-5">
            {/* Card 1: Selected Plan Details Card */}
            <div className="rounded-[20px] border-2 border-primary bg-primary/5 p-5 sm:p-6 shadow-xs">
              {/* Header */}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-xl font-extrabold tracking-tight text-[#2D221D] dark:text-[#FAF3E7]">
                  {activePlan.name}
                </h3>
                <span className="text-xs font-semibold capitalize text-[#75665E] dark:text-[#A6978C]">
                  {data.billing === "annual" ? "Annual" : "Monthly"}
                </span>
              </div>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2D221D] dark:text-[#FAF3E7]">
                  {formatRwf(planCharge)}
                </span>
                <span className="text-xs font-semibold text-[#75665E] dark:text-[#A6978C]">
                  / {data.billing === "annual" ? "year" : "month"}
                </span>
              </div>

              {/* Blurb */}
              <p className="mt-2 text-xs leading-relaxed text-[#75665E] dark:text-[#BAACA1]">
                {activePlan.blurb}
              </p>

              {/* Features checklist */}
              <div className="mt-4 space-y-2 border-t border-[#EBE1D4] pt-4 dark:border-[#382C24]">
                {activePlan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-xs font-medium text-[#2D221D] dark:text-[#FAF3E7]"
                  >
                    <Check className="mt-0.5 size-3.5 shrink-0 stroke-[2.5] text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Change plan link */}
              <button
                type="button"
                onClick={onChangePlan}
                className="mt-4 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#C1440E] hover:underline"
              >
                <span>Change plan</span>
                <ArrowRight className="size-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Card 2: Order summary */}
            <div className="rounded-[20px] border border-[#EBE1D4] bg-[#FFFBF5] p-5 sm:p-6 shadow-xs dark:border-[#382C24] dark:bg-[#1E1815]">
              <h3 className="text-sm sm:text-base font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                Order summary
              </h3>

              {/* Restaurant name & branch/account code */}
              <div className="mt-3">
                <p className="text-xs font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                  {restaurantDisplayName}
                </p>
                <p className="text-[11px] text-[#75665E] dark:text-[#A6978C]">
                  #RW-402
                </p>
              </div>

              {/* Line items */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[#75665E] dark:text-[#BAACA1]">
                  <span>
                    {activePlan.name} - {data.billing === "annual" ? "yearly" : "monthly"}
                  </span>
                  <span className="font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                    {formatRwf(planCharge)}
                  </span>
                </div>

                {data.guided && (
                  <div className="flex items-center justify-between text-[#75665E] dark:text-[#BAACA1]">
                    <span>Guided onboarding</span>
                    <span className="font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                      {formatRwf(GUIDED_FEE)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#75665E] dark:text-[#BAACA1]">
                  <span>VAT</span>
                  <span className="font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                    Included
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-[#EBE1D4] dark:border-[#382C24]" />

              {/* Due today total */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#2D221D] dark:text-[#FAF3E7]">
                  Due today
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#2D221D] dark:text-[#FAF3E7]">
                  {formatRwf(total)}
                </span>
              </div>

              {/* Note */}
              <p className="mt-3 text-[11px] leading-relaxed text-[#8F8179] dark:text-[#A6978C]">
                Your first month begins when payment is confirmed. A receipt will be available in
                Billing.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* BOTTOM FOOTER BAR */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#EBE1D4] pt-4 sm:flex-row dark:border-[#382C24]">
        <button
          type="button"
          onClick={onChangePlan}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E4D6C4] bg-[#FFFDF9] px-4 py-2 text-xs font-bold text-[#2D221D] transition-colors hover:bg-muted/60 dark:border-[#3D3028] dark:bg-[#251E1A] dark:text-[#FAF3E7]"
        >
          <ArrowLeft className="size-3.5 stroke-[2]" />
          <span>Back to plans</span>
        </button>

        <a
          href="mailto:support@bara.rw"
          className="text-xs font-bold text-[#C1440E] hover:underline cursor-pointer"
        >
          Questions? Talk to Bara support
        </a>
      </div>
    </div>
  )
}