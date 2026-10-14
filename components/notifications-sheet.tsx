"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Package,
  RefreshCw,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"
import { ingredientsApi, Ingredient } from "@/lib/api-client"
import { offlineStore } from "@/lib/offline-store"
import { loadStaffMembers } from "@/lib/staff-store"

export interface AppNotification {
  id: string
  title: string
  message: string
  category: "inventory" | "billing" | "staff" | "insights" | "system"
  severity: "critical" | "warning" | "info" | "success"
  timestamp: string
  actionLabel?: string
  actionUrl?: string
}

const READ_STORAGE_KEY = "bara:notifications:read_v1"
const DISMISSED_STORAGE_KEY = "bara:notifications:dismissed_v1"

export function NotificationsSheet() {
  const router = useRouter()
  const { restaurant } = useRestaurant()

  const [isOpen, setIsOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<"all" | "unread" | "inventory" | "billing">("all")
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([])
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set())
  const [dismissedIds, setDismissedIds] = React.useState<Set<string>>(new Set())

  // Load persistent read/dismissed state on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const readData = localStorage.getItem(READ_STORAGE_KEY)
      if (readData) {
        setReadIds(new Set(JSON.parse(readData)))
      }
      const dismissedData = localStorage.getItem(DISMISSED_STORAGE_KEY)
      if (dismissedData) {
        setDismissedIds(new Set(JSON.parse(dismissedData)))
      }
    } catch {
      // Storage unavailable
    }
  }, [])

  // Save read IDs
  const persistReadIds = (newSet: Set<string>) => {
    setReadIds(newSet)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(newSet)))
      } catch {}
    }
  }

  // Save dismissed IDs
  const persistDismissedIds = (newSet: Set<string>) => {
    setDismissedIds(newSet)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(Array.from(newSet)))
      } catch {}
    }
  }

  // Fetch live inventory items for notifications
  const refreshIngredients = React.useCallback(() => {
    ingredientsApi
      .list()
      .then((items) => setIngredients(items))
      .catch(() => {
        // Fallback to offline store
        setIngredients(offlineStore.getIngredients())
      })
  }, [])

  React.useEffect(() => {
    refreshIngredients()
    const timer = setInterval(refreshIngredients, 30000)
    return () => clearInterval(timer)
  }, [refreshIngredients])

  // Generate dynamic live notifications based on restaurant state
  const notifications = React.useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = []

    // 1. Inventory Low Stock & Out of Stock Alerts
    ingredients.forEach((item) => {
      const current = parseFloat(String(item.current_quantity || "0"))
      const threshold = parseFloat(String(item.low_stock_threshold || "0"))

      if (current <= 0) {
        list.push({
          id: `stock-out-${item.id}`,
          title: `Stockout: ${item.name}`,
          message: `Current quantity is ${item.current_quantity} ${item.unit}. Kitchen orders cannot deduct from empty inventory.`,
          category: "inventory",
          severity: "critical",
          timestamp: "Just now",
          actionLabel: "Restock in Inventory",
          actionUrl: "/inventory",
        })
      } else if (current <= threshold) {
        list.push({
          id: `stock-low-${item.id}`,
          title: `Low Stock: ${item.name}`,
          message: `Stock level is ${item.current_quantity} ${item.unit} (Threshold is ${item.low_stock_threshold} ${item.unit}). Reorder recommended.`,
          category: "inventory",
          severity: "warning",
          timestamp: "Recently",
          actionLabel: "View in Inventory",
          actionUrl: "/inventory",
        })
      }
    })

    // 2. Billing & Subscription Alerts
    if (restaurant.status === "grace") {
      list.push({
        id: "billing-grace-alert",
        title: "Subscription Grace Period Active",
        message: `Your subscription payment is overdue. Full workspace access remains available for ${restaurant.graceDaysLeft || 5} days before restrictions apply.`,
        category: "billing",
        severity: "critical",
        timestamp: "Active Notice",
        actionLabel: "Submit Renewal Payment",
        actionUrl: "/settings?tab=billing",
      })
    } else if (restaurant.status === "restricted") {
      list.push({
        id: "billing-restricted-alert",
        title: "Workspace Restricted (Non-Payment)",
        message: "Menu changes and inventory adjustments are locked. Settle the outstanding subscription invoice to restore full write capabilities.",
        category: "billing",
        severity: "critical",
        timestamp: "Account Locked",
        actionLabel: "Pay Invoice",
        actionUrl: "/settings?tab=billing",
      })
    } else {
      list.push({
        id: "billing-renewal-notice",
        title: `${(restaurant.plan || "pro").toUpperCase()} Tier Active`,
        message: `Your ${restaurant.name} subscription is active with MoMo / Bank verification enabled. Next cycle renewal in 18 days.`,
        category: "billing",
        severity: "info",
        timestamp: "Account Status",
        actionLabel: "Billing Settings",
        actionUrl: "/settings?tab=billing",
      })
    }

    // 3. Staff Roster & Security
    const staff = loadStaffMembers()
    const activeStaff = staff.filter((s) => s.status === "Active")
    list.push({
      id: "staff-roster-summary",
      title: "Staff Security Roster",
      message: `${activeStaff.length} active staff members configured with unique POS login PINs. Audit trail tracking enabled.`,
      category: "staff",
      severity: "info",
      timestamp: "Today",
      actionLabel: "Manage Staff",
      actionUrl: "/users",
    })

    // 4. AI & Daily Analytics Insights
    list.push({
      id: "ai-weekly-insights",
      title: "Weekly Demand Forecast Ready",
      message: "AI analysis has processed sales patterns from Nyabugogo and Kigali city branches. Restock suggestions prepared.",
      category: "insights",
      severity: "info",
      timestamp: "Today",
      actionLabel: "Open Insights",
      actionUrl: "/insights",
    })

    return list
  }, [ingredients, restaurant])

  // Filter out dismissed notifications
  const activeNotifications = React.useMemo(() => {
    return notifications.filter((n) => !dismissedIds.has(n.id))
  }, [notifications, dismissedIds])

  // Count unread notifications
  const unreadCount = React.useMemo(() => {
    return activeNotifications.filter((n) => !readIds.has(n.id)).length
  }, [activeNotifications, readIds])

  // Filtered by selected category/tab
  const visibleNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return activeNotifications.filter((n) => !readIds.has(n.id))
    }
    if (filter === "inventory") {
      return activeNotifications.filter((n) => n.category === "inventory")
    }
    if (filter === "billing") {
      return activeNotifications.filter((n) => n.category === "billing")
    }
    return activeNotifications
  }, [activeNotifications, filter, readIds])

  // Handlers
  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const next = new Set(readIds)
    next.add(id)
    persistReadIds(next)
  }

  const handleMarkAllAsRead = () => {
    const next = new Set(readIds)
    activeNotifications.forEach((n) => next.add(n.id))
    persistReadIds(next)
  }

  const handleDismiss = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const nextDismissed = new Set(dismissedIds)
    nextDismissed.add(id)
    persistDismissedIds(nextDismissed)

    const nextRead = new Set(readIds)
    nextRead.add(id)
    persistReadIds(nextRead)
  }

  const handleNavigate = (url?: string, id?: string) => {
    if (id) {
      handleMarkAsRead(id)
    }
    setIsOpen(false)
    if (url) {
      router.push(url)
    }
  }

  const handleClearAllRead = () => {
    const readNotifications = activeNotifications.filter((n) => readIds.has(n.id))
    const nextDismissed = new Set(dismissedIds)
    readNotifications.forEach((n) => nextDismissed.add(n.id))
    persistDismissedIds(nextDismissed)
  }

  const renderIcon = (category: AppNotification["category"], severity: AppNotification["severity"]) => {
    if (severity === "critical") {
      return (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive dark:bg-destructive/20">
          <AlertCircle className="size-4.5" />
        </div>
      )
    }
    if (severity === "warning") {
      return (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
          <AlertTriangle className="size-4.5" />
        </div>
      )
    }
    if (category === "billing") {
      return (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          <CreditCard className="size-4.5" />
        </div>
      )
    }
    if (category === "staff") {
      return (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
          <Users className="size-4.5" />
        </div>
      )
    }
    if (category === "insights") {
      return (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-[#2F5233] dark:bg-emerald-500/20 dark:text-emerald-400">
          <Sparkles className="size-4.5" />
        </div>
      )
    }
    return (
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Package className="size-4.5" />
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground"
            title="Notifications & Alerts"
          />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-xs ring-2 ring-background animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : (
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-muted-foreground/40" />
        )}
        <span className="sr-only">Notifications ({unreadCount} unread)</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border/80 bg-card/60 backdrop-blur-xs flex flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base font-bold text-foreground">
                  Notifications
                </SheetTitle>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <SheetDescription className="text-xs text-muted-foreground">
                Operational alerts, stock warnings, and billing updates
              </SheetDescription>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 shrink-0"
              title="Mark all as read"
            >
              <CheckCheck className="size-3.5 mr-1 text-primary" />
              <span>Mark read</span>
            </Button>
          )}
        </SheetHeader>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/60 bg-muted/20 text-xs overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap",
              filter === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All ({activeNotifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              filter === "unread"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  filter === "unread"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-destructive/15 text-destructive"
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter("inventory")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap",
              filter === "inventory"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Inventory
          </button>
          <button
            type="button"
            onClick={() => setFilter("billing")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap",
              filter === "billing"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Billing
          </button>
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {visibleNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[280px]">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted/80 text-muted-foreground mb-3">
                <CheckCircle2 className="size-6 text-emerald-500" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">You&apos;re all caught up!</h4>
              <p className="mt-1 text-xs text-muted-foreground max-w-[240px]">
                {filter === "unread"
                  ? "No unread notifications at the moment."
                  : filter === "inventory"
                  ? "Stock levels are currently above configured safety thresholds."
                  : "No alerts or pending operational notices found."}
              </p>
            </div>
          ) : (
            visibleNotifications.map((notification) => {
              const isRead = readIds.has(notification.id)
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNavigate(notification.actionUrl, notification.id)}
                  className={cn(
                    "group relative flex items-start gap-3 p-4 transition-colors cursor-pointer hover:bg-muted/40",
                    !isRead && "bg-primary/[0.03] dark:bg-primary/[0.06]"
                  )}
                >
                  {/* Category / Severity Icon */}
                  {renderIcon(notification.category, notification.severity)}

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={cn(
                          "text-xs truncate",
                          isRead ? "font-semibold text-foreground/90" : "font-bold text-foreground"
                        )}
                      >
                        {notification.title}
                      </h4>
                      {!isRead && (
                        <span className="size-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-muted-foreground/80 flex items-center gap-1">
                        <Clock className="size-2.5" />
                        {notification.timestamp}
                      </span>

                      {notification.actionLabel && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary group-hover:underline">
                          {notification.actionLabel}
                          <ArrowRight className="size-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dismiss / Mark-Read actions */}
                  <div className="absolute top-3.5 right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        title="Mark as read"
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Check className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDismiss(notification.id, e)}
                      title="Dismiss notification"
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {activeNotifications.length > 0 && (
          <div className="p-3 border-t border-border/80 bg-muted/15 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <span>
              {activeNotifications.length} operational notice{activeNotifications.length > 1 ? "s" : ""}
            </span>
            {readIds.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllRead}
                className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
              >
                <Trash2 className="size-3 mr-1" />
                <span>Clear read</span>
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
