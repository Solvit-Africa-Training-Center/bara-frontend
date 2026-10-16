"use client"

import * as React from "react"
import {
  Beef,
  Cake,
  Carrot,
  Check,
  ChevronDown,
  ChevronRight,
  Drumstick,
  Fish,
  HelpCircle,
  Info,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Salad,
  Search,
  SlidersHorizontal,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  MENU_CATEGORIES,
  type MenuItemWithRecipe,
} from "../_lib/menu-data"

export interface MenuCatalogProps {
  items: MenuItemWithRecipe[]
  onEditItem: (item: MenuItemWithRecipe) => void
  onNewItem: () => void
  onToggleAvailable: (id: string) => void
  onDuplicateItem?: (item: MenuItemWithRecipe) => void
  onDeleteItem?: (id: string) => void
  onRefreshAvailability?: (id: string) => Promise<void> | void
  currency?: string
}

function getFoodIcon(item: MenuItemWithRecipe) {
  const iconType = item.iconType || ""
  const nameLower = item.name.toLowerCase()

  if (iconType === "fish" || nameLower.includes("tilapia") || nameLower.includes("sambaza") || nameLower.includes("fish")) {
    return <Fish className="size-4.5" />
  }
  if (iconType === "chicken" || nameLower.includes("chicken") || nameLower.includes("poultry")) {
    return <Drumstick className="size-4.5" />
  }
  if (iconType === "steak" || iconType === "beef" || nameLower.includes("beef") || nameLower.includes("brochette") || nameLower.includes("tenderloin") || nameLower.includes("pork")) {
    return <Beef className="size-4.5" />
  }
  if (iconType === "veggie" || nameLower.includes("curry") || nameLower.includes("vegetable")) {
    return <Carrot className="size-4.5" />
  }
  if (iconType === "salad" || nameLower.includes("salad") || nameLower.includes("starter")) {
    return <Salad className="size-4.5" />
  }
  if (iconType === "dessert" || nameLower.includes("cake") || nameLower.includes("mousse") || nameLower.includes("fruit") || nameLower.includes("chocolate")) {
    return <Cake className="size-4.5" />
  }
  return <UtensilsCrossed className="size-4.5" />
}

export function MenuCatalog({
  items,
  onEditItem,
  onNewItem,
  onToggleAvailable,
  onDuplicateItem,
  onDeleteItem,
  onRefreshAvailability,
  currency = "RWF",
}: MenuCatalogProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [availabilityFilter, setAvailabilityFilter] = React.useState<"All" | "Available" | "Unavailable">("All")
  const [recipeFilter, setRecipeFilter] = React.useState<"All" | "Complete" | "Recipe needed">("All")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 6

  // Categories dialog
  const [showCategoriesModal, setShowCategoriesModal] = React.useState(false)
  const [categoriesList, setCategoriesList] = React.useState<string[]>(MENU_CATEGORIES)
  const [newCategoryName, setNewCategoryName] = React.useState("")

  // Help dialog
  const [showHelpModal, setShowHelpModal] = React.useState(false)

  // Notification Toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 3500)
  }

  // Summary KPIs
  const totalItemsCount = items.length
  const availableCount = items.filter((i) => i.available).length
  const recipesCompleteCount = items.filter((i) => i.ingredients.length > 0).length
  const recipesToCompleteCount = items.filter((i) => i.ingredients.length === 0).length
  const firstIncompleteItem = items.find((i) => i.ingredients.length === 0)

  // Categories count
  const allCategories = React.useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => set.add(i.category))
    return Array.from(set)
  }, [items])

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: items.length }
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }, [items])

  // Filtered items
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available" && item.available) ||
        (availabilityFilter === "Unavailable" && !item.available)

      const matchesRecipe =
        recipeFilter === "All" ||
        (recipeFilter === "Complete" && item.ingredients.length > 0) ||
        (recipeFilter === "Recipe needed" && item.ingredients.length === 0)

      return matchesCategory && matchesSearch && matchesAvailability && matchesRecipe
    })
  }, [items, selectedCategory, searchQuery, availabilityFilter, recipeFilter])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedItems.map((i) => i.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    if (categoriesList.includes(newCategoryName.trim())) {
      showToast("Category already exists.")
      return
    }
    setCategoriesList([...categoriesList, newCategoryName.trim()])
    setNewCategoryName("")
    showToast("Category added successfully.")
  }

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-primary text-primary-foreground px-4 py-3 shadow-lg border border-primary/20 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="size-4 text-primary-foreground shrink-0 stroke-[2.5]" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF5EE]">
            Menu management
          </h1>
          <p className="text-xs text-[#78716C] dark:text-[#A89A90] mt-0.5">
            Manage your items, recipes and selling availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium">
            <span className="size-2 rounded-full bg-[#10B981]" />
            <span>Online · Synced now</span>
          </div>

          {/* Add menu item */}
          <Button
            onClick={onNewItem}
            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Add menu item</span>
          </Button>

          {/* Help question button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="size-9 rounded-xl border border-[#E5E0D5] dark:border-border/60 bg-white dark:bg-card flex items-center justify-center text-[#78716C] hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            title="Help and guide"
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total items */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Total items
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {totalItemsCount}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            Across {allCategories.length} categories
          </span>
        </div>

        {/* Card 2: Available for sale (Dynamic Theme Brand Color) */}
        <div className="rounded-2xl bg-primary text-primary-foreground p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-xs text-primary-foreground/80 font-medium">Available for sale</span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-primary-foreground">
              {availableCount}
            </span>
          </div>
          <span className="text-xs text-primary-foreground/80">Visible on POS and online</span>
        </div>

        {/* Card 3: Recipes complete */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Recipes complete
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {recipesCompleteCount}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground">
            Costing linked to inventory
          </span>
        </div>

        {/* Card 4: Recipes to complete */}
        <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-xs text-[#78716C] dark:text-muted-foreground font-medium">
            Recipes to complete
          </span>
          <div className="my-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-foreground">
              {recipesToCompleteCount}
            </span>
          </div>
          <span className="text-xs text-[#78716C] dark:text-muted-foreground truncate">
            {firstIncompleteItem
              ? `Add ingredients to ${firstIncompleteItem.name}`
              : totalItemsCount === 0
              ? "No items created yet"
              : "All recipes fully configured"}
          </span>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              setSelectedCategory("All")
              setCurrentPage(1)
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-transparent text-[#78716C] hover:text-[#1C1917] dark:text-muted-foreground dark:hover:text-foreground hover:bg-[#FAF8F5] dark:hover:bg-muted/40"
            )}
          >
            All items <span className="ml-1 opacity-90">{items.length}</span>
          </button>

          {["Main dishes", "Starters", "Desserts"].map((cat) => {
            const count = categoryCounts[cat] || 0
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setCurrentPage(1)
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-transparent text-[#78716C] hover:text-[#1C1917] dark:text-muted-foreground dark:hover:text-foreground hover:bg-[#FAF8F5] dark:hover:bg-muted/40"
                )}
              >
                {cat} <span className="ml-1 opacity-90">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Right Action: Manage Categories */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCategoriesModal(true)}
          className="h-8.5 px-3 rounded-xl border-[#E5E0D5] dark:border-border text-xs font-semibold text-[#1C1917] dark:text-foreground hover:bg-[#FAF8F5] dark:hover:bg-muted/40 gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <SlidersHorizontal className="size-3.5 text-[#78716C]" />
          <span>Manage categories</span>
        </Button>
      </div>

      {/* Table Container Card */}
      <div className="rounded-2xl bg-white dark:bg-card border border-[#EBE7DF] dark:border-border shadow-xs overflow-hidden">
        {/* Search & Filters Row */}
        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F0ECE1] dark:border-border/60">
          {/* Search bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A8A29E] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search menu items..."
              className="h-9 w-full rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border pl-9.5 pr-3 text-xs text-foreground placeholder:text-[#A8A29E] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Availability filter */}
            <div className="relative">
              <select
                value={availabilityFilter}
                onChange={(e) => {
                  setAvailabilityFilter(e.target.value as "All" | "Available" | "Unavailable")
                  setCurrentPage(1)
                }}
                className="h-9 pl-3 pr-8 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="All">All availability</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C] pointer-events-none" />
            </div>

            {/* Recipes filter */}
            <div className="relative">
              <select
                value={recipeFilter}
                onChange={(e) => {
                  setRecipeFilter(e.target.value as "All" | "Complete" | "Recipe needed")
                  setCurrentPage(1)
                }}
                className="h-9 pl-3 pr-8 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#E5E0D5] dark:border-border text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="All">All recipes</option>
                <option value="Complete">Complete</option>
                <option value="Recipe needed">Recipe needed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#78716C] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-muted/30 border-b border-[#EBE7DF] dark:border-border text-[#78716C]">
                <th className="py-3 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedItems.length > 0 &&
                      paginatedItems.every((i) => selectedIds.includes(i.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-[#D6D0C4] accent-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 font-semibold text-[11px] uppercase tracking-wider">
                  MENU ITEM
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  SELLING PRICE
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  RECIPE COST
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  RECIPE
                </th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">
                  AVAILABILITY
                </th>
                <th className="py-3 pr-5 text-right font-semibold text-[11px] uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE6] dark:divide-border/40">
              {paginatedItems.map((item) => {
                const totalRecipeCost = item.ingredients.reduce(
                  (sum, ing) =>
                    sum +
                    (ing.lineCost > 0
                      ? ing.lineCost
                      : Math.round(ing.quantity * (ing.costPerUnit || 0) * (1 + (ing.wastePercent || 0) / 100))),
                  0
                )
                const effectiveCost =
                  totalRecipeCost > 0
                    ? totalRecipeCost
                    : item.costPerServing && item.costPerServing > 0
                    ? item.costPerServing
                    : 0

                const foodCostPercent =
                  item.price > 0 && effectiveCost > 0
                    ? ((effectiveCost / item.price) * 100).toFixed(1)
                    : item.foodCostPercent
                    ? String(item.foodCostPercent)
                    : null
                const isChecked = selectedIds.includes(item.id)

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF8F5]/60 dark:hover:bg-muted/20 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                        className="rounded border-[#D6D0C4] accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Menu Item */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-[#FEF5E7] text-[#B45309] dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center shrink-0 border border-[#FDE68A]/50">
                          {getFoodIcon(item)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1C1917] dark:text-foreground">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#78716C] dark:text-muted-foreground mt-0.5">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-xs text-[#1C1917] dark:text-foreground">
                        {currency} {item.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Recipe Cost */}
                    <td className="py-3.5 px-4">
                      {effectiveCost > 0 ? (
                        <div>
                          <div className="font-semibold text-xs text-[#1C1917] dark:text-foreground">
                            {currency} {Math.round(effectiveCost).toLocaleString()}
                          </div>
                          <div className="text-[11px] text-[#78716C] dark:text-muted-foreground mt-0.5">
                            {foodCostPercent ? `${foodCostPercent}% food cost` : "Calculated"}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-xs text-[#78716C] dark:text-muted-foreground">
                            —
                          </div>
                          <div className="text-[11px] text-[#78716C] dark:text-muted-foreground mt-0.5">
                            Not calculated
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Recipe Badge */}
                    <td className="py-3.5 px-4">
                      {item.ingredients.length > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EAF5EC] border border-[#C6E6CD] text-[#1E743A] text-xs font-medium">
                          {item.ingredients.length} ingredients
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FEF4E6] border border-[#FADBB2] text-[#B45309] text-xs font-medium">
                          Recipe needed
                        </span>
                      )}
                    </td>

                    {/* Availability Badge */}
                    <td className="py-3.5 px-4">
                      <div>
                        {item.available ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EAF5EC] border border-[#C6E6CD] text-[#1E743A] text-xs font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FEF4E6] border border-[#FADBB2] text-[#B45309] text-xs font-medium">
                            Unavailable
                          </span>
                        )}
                        {item.availableServings !== undefined && item.availableServings !== null && (
                          <div className="text-[11px] text-[#78716C] dark:text-muted-foreground mt-0.5">
                            {item.availableServings} {Number(item.availableServings) === 1 ? "serving left" : "servings left"}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditItem(item)}
                          className="size-7 rounded-lg text-primary hover:bg-[#FAF8F5] dark:hover:bg-muted/40 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit recipe & details"
                        >
                          <Pencil className="size-3.5" />
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button
                                className="size-7 rounded-lg hover:bg-muted/60 flex items-center justify-center text-[#78716C] hover:text-foreground transition-colors cursor-pointer"
                                title="More options"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl">
                            <DropdownMenuItem
                              onClick={() => onEditItem(item)}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <Pencil className="size-3.5 text-muted-foreground" />
                              <span>Edit recipe &amp; details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                onToggleAvailable(item.id)
                                showToast(
                                  `${item.name} marked as ${item.available ? "Unavailable" : "Available"}.`
                                )
                              }}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <Check className="size-3.5 text-muted-foreground" />
                              <span>
                                {item.available ? "Mark as unavailable" : "Mark as available"}
                              </span>
                            </DropdownMenuItem>
                            {onRefreshAvailability && (
                              <DropdownMenuItem
                                onClick={async () => {
                                  await onRefreshAvailability(item.id)
                                  showToast(`Recalculated availability for ${item.name}.`)
                                }}
                                className="gap-2 cursor-pointer text-xs"
                              >
                                <RefreshCw className="size-3.5 text-muted-foreground" />
                                <span>Recalculate availability</span>
                              </DropdownMenuItem>
                            )}
                            {onDuplicateItem && (
                              <DropdownMenuItem
                                onClick={() => {
                                  onDuplicateItem(item)
                                  showToast(`Duplicated ${item.name}.`)
                                }}
                                className="gap-2 cursor-pointer text-xs"
                              >
                                <Plus className="size-3.5 text-muted-foreground" />
                                <span>Duplicate item</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {onDeleteItem && (
                              <DropdownMenuItem
                                onClick={() => {
                                  onDeleteItem(item.id)
                                  showToast(`Deleted ${item.name}.`)
                                }}
                                variant="destructive"
                                className="gap-2 cursor-pointer text-xs text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete item</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                        <UtensilsCrossed className="size-5" />
                      </div>
                      <p className="font-semibold text-foreground text-sm">No menu items yet</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">
                        Start building your menu by adding dishes and linking recipe ingredients to track food costs and auto-deduct stock.
                      </p>
                      <Button
                        size="sm"
                        onClick={onNewItem}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 h-8 gap-1.5"
                      >
                        <Plus className="size-3.5" />
                        Create Menu Item
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No menu items found matching your filters.
                    <div className="mt-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedCategory("All")
                          setAvailabilityFilter("All")
                          setRecipeFilter("All")
                        }}
                        className="h-7 text-xs rounded-lg"
                      >
                        Reset filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-3.5 px-5 bg-[#FAF8F5]/60 dark:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EBE7DF] dark:border-border text-xs text-[#78716C]">
          <div>
            Showing {filteredItems.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2.5 py-1 rounded-lg border border-[#E5E0D5] dark:border-border bg-white dark:bg-card text-xs font-medium text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "size-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer",
                  safePage === page
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-transparent text-[#78716C] hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-[#E5E0D5] dark:border-border bg-white dark:bg-card text-xs font-medium text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Alert Banner */}
      <div className="rounded-2xl border border-[#EBE7DF] dark:border-border bg-[#FAF8F5] dark:bg-muted/30 p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-muted-foreground">
          <Info className="size-4 text-[#A8A29E] shrink-0" />
          <span>Complete recipes to track ingredient usage and calculate food cost automatically.</span>
        </div>

        {firstIncompleteItem && (
          <button
            onClick={() => onEditItem(firstIncompleteItem)}
            className="text-xs font-bold text-primary hover:underline self-start sm:self-auto cursor-pointer flex items-center gap-1"
          >
            <span>Complete {firstIncompleteItem.name}</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>

      {/* Modal 1: Manage Categories */}
      <Dialog open={showCategoriesModal} onOpenChange={setShowCategoriesModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Manage categories</DialogTitle>
            <DialogDescription className="text-xs">
              Organize your restaurant menu categories displayed across Bara Web and POS terminals.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <form onSubmit={handleAddCategory} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="New category name (e.g. Beverages)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <Button
                type="submit"
                className="h-9 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Add</span>
              </Button>
            </form>

            <div className="divide-y divide-border/60 rounded-xl border border-border/80 overflow-hidden">
              {categoriesList.map((cat) => (
                <div
                  key={cat}
                  className="p-3 flex items-center justify-between text-xs bg-card hover:bg-muted/30"
                >
                  <span className="font-semibold text-foreground">{cat}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {categoryCounts[cat] || 0} items
                  </span>
                </div>
              ))}
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                onClick={() => setShowCategoriesModal(false)}
                className="h-8.5 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Help & Guide */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              <span>Menu &amp; Recipe Management Guide</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              How recipe costing and POS synchronization works in Bara.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2 text-xs text-muted-foreground leading-relaxed">
            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground">1. Recipe Portions &amp; Inventory Depletion</div>
              <p className="text-[11px] mt-1">
                When you add ingredients to a dish, Bara automatically calculates the food cost percentage and decrements stock in real-time each time an order is rung up on the POS.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground">2. Availability Control</div>
              <p className="text-[11px] mt-1">
                Toggle items between Available and Unavailable. Unavailable dishes are 86&apos;d on POS touchscreens and online ordering portals instantly.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-muted/30 border border-[#EBE7DF] dark:border-border">
              <div className="font-bold text-foreground">3. Live Cloud Sync</div>
              <p className="text-[11px] mt-1">
                Any changes made here sync live to kitchen displays, cashier terminals, and waiter handhelds.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="h-8.5 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
