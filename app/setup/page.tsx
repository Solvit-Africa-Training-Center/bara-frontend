"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { OnboardingShell } from "@/components/onboarding-shell"
import { loadDraft, saveDraft } from "@/lib/onboarding"
import { PaymentStep } from "./_components/payment-step"
import { PlanStep } from "./_components/plan-step"
import { RestaurantStep } from "./_components/restaurant-step"
import { initialData, type PlanId, type SetupData } from "./_lib/data"
import { useRestaurant } from "@/components/restaurant-provider"

export default function SetupPage() {
  const router = useRouter()
  const { updateRestaurant, updateUser } = useRestaurant()
  const [step, setStep] = React.useState(1) // 0 Account, 1 Restaurant, 2 Plan, 3 Payment
  const [data, setData] = React.useState<SetupData>(() => {
    if (typeof window === "undefined") return initialData
    const d = loadDraft()
    return {
      ...initialData,
      firstName: d.firstName ?? "",
      lastName: d.lastName ?? "",
      email: d.email ?? "",
      restaurantName: d.restaurantName ?? "",
      tradingName: d.tradingName ?? d.restaurantName ?? "",
      tin: d.tin ?? "",
      phone: d.phone ?? "",
      city: d.city ?? "",
      address: d.address ?? "",
      currency: d.currency ?? initialData.currency,
      brandColor: d.brandColor ?? initialData.brandColor,
      logo: d.logoDataUrl,
      guided: d.guidedOnboarding ?? initialData.guided,
      plan: d.plan ?? null,
      billing: d.billing ?? initialData.billing,
      momoPhone: d.phone ?? "",
    }
  })
  const [paying, setPaying] = React.useState(false)

  const update = React.useCallback(
    (patch: Partial<SetupData>) => setData((d) => ({ ...d, ...patch })),
    []
  )

  const goTo = (index: number) => {
    setStep(index)
    window.scrollTo({ top: 0 })
  }

  // ---- step handlers (save the draft, then move on) ----
  const continueFromAccount = () => {
    saveDraft({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      restaurantName: data.restaurantName.trim(),
    })
    if (!data.tradingName) update({ tradingName: data.restaurantName })
    goTo(1)
  }

  const continueFromRestaurant = () => {
    saveDraft({
      tradingName: data.tradingName,
      tin: data.tin,
      phone: data.phone,
      city: data.city,
      address: data.address,
      currency: data.currency,
      brandColor: data.brandColor,
      logoDataUrl: data.logo,
      guidedOnboarding: data.guided,
    })
    goTo(2)
  }

  const choosePlan = (id: PlanId) => {
    update({ plan: id })
    saveDraft({ plan: id, billing: data.billing })
    goTo(3)
  }

  const pay = () => {
    if (!data.plan) return
    setPaying(true)
    saveDraft({ plan: data.plan, billing: data.billing })

    const restName = data.tradingName.trim() || data.restaurantName.trim()
    if (restName) {
      updateRestaurant({
        name: restName,
        tradingName: restName,
        city: data.city,
        address: data.address,
        phone: data.phone,
        currency: data.currency,
        plan: data.plan,
        billing: data.billing,
      })
    }
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim()
    if (fullName || data.email) {
      updateUser({
        name: fullName || "Alex Rivera",
        email: data.email.trim(),
        initials: `${data.firstName[0] ?? ""}${data.lastName[0] ?? ""}`.toUpperCase() || "AR",
      })
    }

    // TODO: start the mobile money payment with your payments API here
    setTimeout(() => router.push("/"), 800)
  }

  return (
    <OnboardingShell current={step} onStepChange={goTo}>
      {step === 1 && (
        <RestaurantStep
          data={data}
          update={update}
          onContinue={continueFromRestaurant}
        />
      )}
      {step === 2 && (
        <PlanStep
          data={data}
          update={update}
          onChoose={choosePlan}
          onBack={() => goTo(1)}
        />
      )}
      {step === 3 && (
        <PaymentStep
          data={data}
          update={update}
          paying={paying}
          onPay={pay}
          onChangePlan={() => goTo(2)}
        />
      )}
    </OnboardingShell>
  )
}