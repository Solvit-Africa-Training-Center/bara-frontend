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
import { GlobalSearchDialog } from "@/components/global-search-dialog"
import { NotificationsSheet } from "@/components/notifications-sheet"

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
  const [searchOpen, setSearchOpen] = React.useState(false)

  // Listen for Cmd+K / Ctrl+K keyboard shortcut to open global search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
              {restaurant.logo ? (
                <div className="size-6.5 rounded-lg overflow-hidden border border-border/80 bg-card p-0.5 shrink-0 flex items-center justify-center">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="h-full w-full object-contain rounded-sm"
                  />
                </div>
              ) : (
                <span
                  className="size-2 rounded-full shrink-0 transition-colors"
                  style={{ backgroundColor: restaurant.brandColor || "var(--primary)" }}
                />
              )}
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

          {/* Central Search Bar (interactive trigger with shortcut badge) */}
          <div className="hidden sm:flex flex-1 max-w-[220px] md:max-w-xs lg:max-w-sm mx-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group relative flex h-8.5 w-full items-center justify-between rounded-full border border-border bg-card px-3 text-xs text-muted-foreground shadow-2xs hover:border-primary/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all text-left cursor-pointer"
              title="Search menu, inventory, staff, and actions (Ctrl+K / ⌘K)"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="truncate">Search inventory, menu, staff...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground/90 shrink-0">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right Actions: Search (mobile), Sync Indicator & Notifications Sheet */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="sm:hidden size-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Search"
            >
              <Search className="size-4" />
              <span className="sr-only">Search</span>
            </Button>

            <SyncStatusBadge />

            {/* Notifications slide-out drawer with real-time operational alerts */}
            <NotificationsSheet />

            <ThemeToggle />
          </div>
        </header>

        {/* Brand Multi-color Accent Bar - Dynamically themes with restaurant.brandColor */}
        <div
          className="h-[2px] w-full opacity-85 transition-colors duration-300"
          style={{
            background: `linear-gradient(to right, ${restaurant.brandColor || "#C85A24"}, #E56A1C, #EA982C, #EBA529, #2F5233)`,
          }}
        />

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

        {/* Global Spotlight Search Dialog (Cmd+K / Ctrl+K) */}
        <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </SidebarInset>
    </SidebarProvider>
  )
}
