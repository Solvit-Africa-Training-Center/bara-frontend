"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Cloud,
  CloudOff,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useRestaurant } from "@/components/restaurant-provider"
import { useAuth } from "@/components/auth-provider"
import { offlineStore, SyncState } from "@/lib/offline-store"
import { cn } from "@/lib/utils"

function SyncStatusBadge() {
  const [status, setStatus] = React.useState<SyncState>("synced")

  React.useEffect(() => {
    return offlineStore.subscribe((newStatus) => {
      setStatus(newStatus)
    })
  }, [])

  if (status === "syncing") {
    return (
      <div
        title="Syncing pending transactions with cloud backend..."
        className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400"
      >
        <RefreshCw className="size-3 animate-spin text-blue-500" />
        <span>Syncing...</span>
      </div>
    )
  }

  if (status === "offline") {
    return (
      <div
        title="Working offline. Local writes queued and will sync when internet restores."
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400"
      >
        <CloudOff className="size-3 text-amber-600 dark:text-amber-400" />
        <span>Offline (Queued)</span>
      </div>
    )
  }

  return (
    <div
      title="Connected to Bara Cloud (Render API). Real-time sync active."
      className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-[#2F5233] dark:text-emerald-400"
    >
      <span className="size-1.5 rounded-full bg-emerald-500" />
      <span>Live Sync</span>
    </div>
  )
}

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { restaurant } = useRestaurant()
  const { isAuthenticated, isLoading } = useAuth()

  const isGuestAuthPage =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/")

  const isPublicOrFlowPage =
    isGuestAuthPage ||
    pathname === "/setup" ||
    pathname.startsWith("/setup/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/errors")

  React.useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !isPublicOrFlowPage) {
      router.replace("/login")
    } else if (isAuthenticated && isGuestAuthPage) {
      router.replace("/")
    }
  }, [isLoading, isAuthenticated, isPublicOrFlowPage, isGuestAuthPage, router])

  // Prevent logged-in users from viewing/interacting with auth pages before clicking logout
  if (isAuthenticated && isGuestAuthPage) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">Redirecting to workspace...</span>
        </div>
      </div>
    )
  }

  if (isPublicOrFlowPage) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        {children}
      </div>
    )
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">Loading workspace...</span>
        </div>
      </div>
    )
  }

  const isGraceState = restaurant.status === "grace"
  const isRestrictedState = restaurant.status === "restricted"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent md:peer-data-[variant=floating]:m-3 md:peer-data-[variant=floating]:ml-0 min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/90 px-3 md:px-5 backdrop-blur-md">
          {/* Left: Trigger & Restaurant Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <SidebarTrigger className="-ml-1 size-8 rounded-lg hover:bg-muted" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[130px] sm:max-w-none">
                {restaurant.name}
              </span>
              {restaurant.activeBranch && (
                <span className="hidden md:inline-flex items-center rounded-md bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/60 truncate max-w-[160px]">
                  {restaurant.activeBranch.replace(/^Bara\s+/i, "")}
                </span>
              )}
            </div>
          </div>

          {/* Central Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-[220px] md:max-w-xs lg:max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ledger, inventory, menu..."
                className="h-8.5 w-full rounded-full border border-border bg-card pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Right Actions: Persistent Sync Indicator (Section 1.4 & 5.7) & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <SyncStatusBadge />

            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>

            <ThemeToggle />
          </div>
        </header>

        {/* Brand Multi-color Accent Bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#C1440E] via-[#E56A1C] via-[#EA982C] via-[#EBA529] to-[#2F5233] opacity-80" />

        {/* Section 4.3 Account States Non-Payment Banners */}
        {isGraceState && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <span>
                <strong>Subscription Overdue (Grace Period Active):</strong> Full access continues for {restaurant.graceDaysLeft || 5} days. Please submit renewal payment.
              </span>
            </div>
            <Link
              href="/settings?tab=billing"
              className="font-bold underline hover:no-underline text-amber-800 dark:text-amber-100 flex items-center gap-1 shrink-0 self-end sm:self-auto"
            >
              <span>Renew Now</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        )}

        {isRestrictedState && (
          <div className="bg-[#A83232]/15 border-b border-[#A83232]/30 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#A83232] dark:text-red-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-[#A83232] shrink-0" />
              <span>
                <strong>Account Restricted (Read-Only):</strong> Modifying menu items and stock is locked due to overdue payment. Reports remain accessible.
              </span>
            </div>
            <Link
              href="/settings?tab=billing"
              className="font-bold underline hover:no-underline text-[#A83232] dark:text-red-100 flex items-center gap-1 shrink-0 self-end sm:self-auto"
            >
              <span>Submit Payment</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        )}

        <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 min-w-0 w-full max-w-full overflow-x-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
