"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Boxes,
  Calendar,
  ChefHat,
  ChevronRight,
  CreditCard,
  FileSpreadsheet,
  HelpCircle,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Store,
  UserPlus,
  Users,
  UtensilsCrossed,
  X,
  AlertTriangle,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ingredientsApi, Ingredient } from "@/lib/api-client"
import { loadStaffMembers, StaffMember } from "@/lib/staff-store"
import { useRestaurant } from "@/components/restaurant-provider"

interface SearchResultItem {
  id: string
  title: string
  subtitle?: string
  category: "Navigation" | "Inventory & Stock" | "Staff & Team" | "Quick Actions"
  url: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: "default" | "destructive" | "outline" | "warning"
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { restaurant, formatCurrency } = useRestaurant()
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([])
  const [staff, setStaff] = React.useState<StaffMember[]>([])

  // Load searchable data on open
  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)

      // Fetch live ingredients & staff
      ingredientsApi
        .list()
        .then((items) => setIngredients(items))
        .catch(() => {})

      setStaff(loadStaffMembers())
    }
  }, [open])

  // Build searchable index
  const results = React.useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase()

    // 1. Core Navigation Pages
    const pages: SearchResultItem[] = [
      {
        id: "nav-dashboard",
        title: "Dashboard Overview",
        subtitle: "Daily gross sales, orders, and real-time operations",
        category: "Navigation",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        id: "nav-menu",
        title: "Menu & Recipes",
        subtitle: "Menu items, pricing, availability, and recipe ingredient costing",
        category: "Navigation",
        url: "/menu",
        icon: UtensilsCrossed,
      },
      {
        id: "nav-reports",
        title: "Financial & Operational Reports",
        subtitle: "Sales trends, top/bottom sellers, consumables spend, and voids",
        category: "Navigation",
        url: "/reports",
        icon: FileSpreadsheet,
        badge: "Pro",
      },
      {
        id: "nav-insights",
        title: "AI Insights & Demand Forecasting",
        subtitle: "AI weekly summaries, restock predictions, and anomaly alerts",
        category: "Navigation",
        url: "/ai-insights",
        icon: Sparkles,
        badge: "AI",
      },
      {
        id: "nav-users",
        title: "Users & Staff Roster",
        subtitle: "Staff roles, unique POS shift PINs, and access status",
        category: "Navigation",
        url: "/users",
        icon: Users,
        badge: "Owner",
      },
      {
        id: "nav-settings-profile",
        title: "Store Profile Settings",
        subtitle: "Restaurant name, logo, accent color, and currency",
        category: "Navigation",
        url: "/settings?tab=profile",
        icon: Store,
      },
      {
        id: "nav-settings-billing",
        title: "Subscription & Billing Plans",
        subtitle: "Active plan tier, payment history, and tier upgrade",
        category: "Navigation",
        url: "/settings?tab=billing",
        icon: CreditCard,
      },
    ]

    // 2. Quick Actions
    const quickActions: SearchResultItem[] = [
      {
        id: "act-manage-menu",
        title: "Manage Menu Items & Prices",
        subtitle: "Update dishes, pricing, recipes, and availability",
        category: "Quick Actions",
        url: "/menu",
        icon: UtensilsCrossed,
      },
      {
        id: "act-add-staff",
        title: "Add New Staff Member",
        subtitle: "Assign role and generate a unique POS tablet login PIN",
        category: "Quick Actions",
        url: "/users",
        icon: UserPlus,
      },
      {
        id: "act-log-consumable",
        title: "Log Consumable Expense",
        subtitle: "Record packaging boxes, gas cylinders, and operational supplies",
        category: "Quick Actions",
        url: "/reports",
        icon: Receipt,
      },
      {
        id: "act-upgrade-plan",
        title: "Manage Subscription Tier",
        subtitle: "Switch between Basic (Single), Pro (Team), and Premium (AI)",
        category: "Quick Actions",
        url: "/settings?tab=billing",
        icon: CreditCard,
      },
    ]

    // 3. Dynamic Ingredients from Live API
    const ingredientItems: SearchResultItem[] = ingredients.map((ing) => {
      const current = parseFloat(String(ing.current_quantity || "0"))
      const threshold = parseFloat(String(ing.low_stock_threshold || "0"))
      const isLow = current <= threshold && threshold > 0

      return {
        id: `ing-${ing.id}`,
        title: ing.name,
        subtitle: `Stock: ${current} ${ing.unit} · Unit Cost: ${formatCurrency(
          Number(ing.cost_per_unit || 0)
        )} · Threshold: ${threshold} ${ing.unit}`,
        category: "Inventory & Stock",
        url: `/menu`,
        icon: Boxes,
        badge: isLow ? "Low Stock" : "In Stock",
        badgeVariant: isLow ? "destructive" : "outline",
      }
    })

    // 4. Dynamic Staff Members
    const staffItems: SearchResultItem[] = staff.map((st) => ({
      id: `staff-${st.id}`,
      title: st.name,
      subtitle: `${st.role} · ${st.platformAccess} · Status: ${st.status}`,
      category: "Staff & Team",
      url: `/users`,
      icon: Users,
      badge: st.role,
      badgeVariant: st.isOwner ? "default" : "outline",
    }))

    const all = [...pages, ...quickActions, ...ingredientItems, ...staffItems]

    if (!q) {
      // Default view: show Navigation + Quick Actions + Top Ingredients
      return [...pages, ...quickActions, ...ingredientItems.slice(0, 4)]
    }

    return all.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      )
    })
  }, [query, ingredients, staff, formatCurrency])

  // Reset selected index when results change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleSelect = React.useCallback(
    (item: SearchResultItem) => {
      onOpenChange(false)
      router.push(item.url)
    },
    [router, onOpenChange]
  )

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex, handleSelect])

  // Group results by category
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResultItem[]> = {}
    results.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })
    return groups
  }, [results])

  let runningIndex = -1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl border border-border shadow-2xl bg-card">
        <DialogHeader className="sr-only">
          <DialogTitle>Quick Search</DialogTitle>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border/80 gap-3 bg-background">
          <Search className="size-4.5 text-[#C1440E] shrink-0 stroke-[2.2]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ingredients, staff, reports, menu, pages..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="size-5 rounded-md text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/60 text-[10px] font-mono text-muted-foreground">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
              <Search className="size-8 text-muted-foreground/40 mx-auto stroke-[1.5]" />
              <p className="font-semibold text-foreground text-sm pt-2">No matching results</p>
              <p>Try searching for an ingredient name, team member, or page.</p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {category}
                </div>
                {items.map((item) => {
                  runningIndex++
                  const currentIndex = runningIndex
                  const isSelected = selectedIndex === currentIndex
                  const Icon = item.icon

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer group",
                        isSelected
                          ? "bg-[#C1440E]/10 text-foreground dark:bg-[#C1440E]/20"
                          : "hover:bg-muted/60 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                        <div
                          className={cn(
                            "size-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                            isSelected
                              ? "bg-[#C1440E] text-white border-[#C1440E]"
                              : "bg-muted/70 text-muted-foreground border-border/80 group-hover:border-primary/40 group-hover:text-primary"
                          )}
                        >
                          <Icon className="size-4 stroke-[2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs text-foreground truncate flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.badge && (
                              <span
                                className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider",
                                  item.badgeVariant === "destructive"
                                    ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                                    : "bg-muted text-muted-foreground border border-border"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          "size-3.5 shrink-0 transition-transform",
                          isSelected
                            ? "text-[#C1440E] translate-x-0.5"
                            : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Keyboard Footer */}
        <div className="px-4 py-2.5 border-t border-border/80 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-mono">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-mono">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">
            Bara Operations Search
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
