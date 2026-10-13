"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, CreditCard, Percent, Store, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRestaurant } from "@/components/restaurant-provider"
import {
  SettingsHeader,
  ProfileTabForm,
  OperationsTargetsTab,
  BillingPlansTab,
  SettingsSkeleton,
} from "./_components"

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const { restaurant } = useRestaurant()

  React.useEffect(() => {
    if (tabParam === "users") {
      router.replace("/users")
    }
  }, [tabParam, router])

  const activeTab =
    tabParam === "billing"
      ? "billing"
      : tabParam === "targets"
      ? "targets"
      : "profile"

  const handleTabChange = (value: string) => {
    router.replace(`/settings?tab=${value}`, { scroll: false })
  }

  const [savedNotice, setSavedNotice] = React.useState("")
  const handleNotice = React.useCallback((msg: string) => {
    setSavedNotice(msg)
    setTimeout(() => {
      setSavedNotice((prev) => (prev === msg ? "" : prev))
    }, 3500)
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Toast Feedback */}
      {savedNotice && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-white" />
          <span>{savedNotice}</span>
          <button
            onClick={() => setSavedNotice("")}
            className="ml-2 text-white/80 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header matching other tabs */}
      <SettingsHeader
        restaurantName={restaurant.name}
        planName={restaurant.plan || "pro"}
      />

      {/* 2. Cohesive Navigation Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-6"
      >
        <TabsList className="h-11 w-full sm:w-auto p-1 bg-muted/80 rounded-2xl grid grid-cols-3 sm:inline-flex border border-border/60">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-4.5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-xs"
          >
            <Store className="size-4" />
            <span className="truncate">Restaurant Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="targets"
            className="rounded-xl px-4.5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-xs"
          >
            <Percent className="size-4" />
            <span className="truncate">Food Cost &amp; Margins</span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-xl px-4.5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-xs"
          >
            <CreditCard className="size-4" />
            <span className="truncate">Subscription &amp; Plans</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <ProfileTabForm onSavedNotice={handleNotice} />
        </TabsContent>

        <TabsContent value="targets" className="mt-0">
          <OperationsTargetsTab onSavedNotice={handleNotice} />
        </TabsContent>

        <TabsContent value="billing" className="mt-0">
          <BillingPlansTab onSavedNotice={handleNotice} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </React.Suspense>
  )
}

