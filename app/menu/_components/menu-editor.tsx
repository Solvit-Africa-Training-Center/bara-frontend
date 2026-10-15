"use client"

import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Fish,
  HelpCircle,
  Image as ImageIcon,
  Plus,
  Save,
  Search,
  Trash2,
  Utensils,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  INVENTORY_INGREDIENTS_LIBRARY,
  MENU_CATEGORIES,
  type MenuItemWithRecipe,
  type RecipeIngredient,
} from "../_lib/menu-data"
import { ingredientsApi } from "@/lib/api-client"

export interface MenuEditorProps {
  item: MenuItemWithRecipe
  onSave: (updatedItem: MenuItemWithRecipe) => void
  onCancel: () => void
  onPreviousItem?: () => void
  onNextItem?: () => void
  currency?: string
  targetFoodCost?: number
}

export function MenuEditor({
  item: initialItem,
  onSave,
  onCancel,
  onPreviousItem,
  onNextItem,
  currency = "RWF",
  targetFoodCost = 34,
}: MenuEditorProps) {
  const [item, setItem] = React.useState<MenuItemWithRecipe>(initialItem)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showAddMenu, setShowAddMenu] = React.useState(false)
  const [showHelpDialog, setShowHelpDialog] = React.useState(false)
  const [savedToast, setSavedToast] = React.useState(false)
  const [availableLibrary, setAvailableLibrary] = React.useState(INVENTORY_INGREDIENTS_LIBRARY)
  const idCounterRef = React.useRef(1)

  React.useEffect(() => {
    ingredientsApi.list().then((live) => {
      if (!live || live.length === 0) return
      const mapped = live.map((ing) => ({
        id: ing.id,
        name: ing.name,
        stock: `${ing.current_quantity ?? 0} ${ing.unit} in stock`,
        unit: ing.unit,
        costPerUnit: parseFloat(ing.cost_per_unit) || 10,
        defaultWaste: 0,
      }))
      const merged = [...mapped]
      INVENTORY_INGREDIENTS_LIBRARY.forEach((seed) => {
        if (!merged.some((m) => m.name.toLowerCase() === seed.name.toLowerCase())) {
          merged.push(seed)
        }
      })
      setAvailableLibrary(merged)
    })
  }, [])

  // Calculations
  const costPerServing = Math.round(
    item.ingredients.reduce((acc, ing) => acc + ing.lineCost, 0)
  )
  const foodCostPercent =
    item.price > 0
      ? Number(((costPerServing / item.price) * 100).toFixed(1))
      : 0
  const grossProfit = Math.max(0, item.price - costPerServing)
  const isWithinTarget = foodCostPercent <= targetFoodCost

  // Ingredient updates
  const handleQuantityChange = (id: string, newQty: number) => {
    setItem((prev) => {
      const updated = prev.ingredients.map((ing) => {
        if (ing.id !== id) return ing
        const cleanQty = Math.max(0, newQty)
        const newLineCost = Math.round(cleanQty * ing.costPerUnit * (1 + (ing.wastePercent || 0) / 100))
        return {
          ...ing,
          quantity: cleanQty,
          lineCost: newLineCost,
        }
      })
      return { ...prev, ingredients: updated }
    })
  }

  const handleUnitChange = (id: string, newUnit: string) => {
    setItem((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) =>
        ing.id === id ? { ...ing, unit: newUnit } : ing
      ),
    }))
  }

  const handleDeleteIngredient = (id: string) => {
    setItem((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id),
    }))
  }

  const handleAddIngredient = (invItem: (typeof INVENTORY_INGREDIENTS_LIBRARY)[0]) => {
    const existing = item.ingredients.find((i) => i.name === invItem.name)
    if (existing) {
      handleQuantityChange(existing.id, existing.quantity + 50)
      setShowAddMenu(false)
      setSearchQuery("")
      return
    }

    const defaultQty = invItem.unit === "g" ? 100 : invItem.unit === "ml" ? 50 : 1
    const newLineCost = Math.round(defaultQty * invItem.costPerUnit * (1 + invItem.defaultWaste / 100))

    const newIngId = `r-${invItem.id}-${idCounterRef.current++}`
    const newIng: RecipeIngredient = {
      id: newIngId,
      name: invItem.name,
      stockQuantity: invItem.stock,
      quantity: defaultQty,
      unit: invItem.unit,
      costPerUnit: invItem.costPerUnit,
      lineCost: newLineCost,
      wastePercent: invItem.defaultWaste,
    }

    setItem((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIng],
    }))
    setShowAddMenu(false)
    setSearchQuery("")
  }

  const handleSave = () => {
    onSave(item)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  const filteredLibrary = availableLibrary.filter((inv) =>
    inv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 max-w-[1360px] mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#2C221E] dark:text-[#FAF5EE]">
            Edit menu item
          </h1>
          <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
            Menu / {item.category} / <span className="font-semibold text-foreground">{item.name}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online · Synced now</span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-9 px-4 rounded-xl border-[#E4D6C4] dark:border-[#3D3028] text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] cursor-pointer hover:bg-muted/80"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="size-3.5 stroke-[2.2]" />
            <span>Save changes</span>
          </Button>

          <button
            type="button"
            onClick={() => setShowHelpDialog(true)}
            className="size-9 rounded-xl border border-[#E4D6C4] dark:border-[#3D3028] bg-card flex items-center justify-center text-[#75665E] hover:text-[#2C221E] dark:hover:text-[#FAF5EE] transition-colors cursor-pointer"
            aria-label="Help & Guide"
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Menu item updated and synchronized with POS terminals!</span>
        </div>
      )}

      {/* Sub-header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Badge
            variant="success"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
          >
            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Recipe complete</span>
          </Badge>
          <span className="text-xs text-[#8C7D73] dark:text-[#A89A90]">
            {item.lastSavedText || "Last saved 2 minutes ago"}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onPreviousItem && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPreviousItem}
              className="h-8 rounded-xl border-[#E4D6C4] dark:border-[#3D3028] text-xs font-bold gap-1 cursor-pointer hover:bg-muted/60"
            >
              <ArrowLeft className="size-3" />
              <span>Previous item</span>
            </Button>
          )}
          {onNextItem && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onNextItem}
              className="h-8 rounded-xl border-[#E4D6C4] dark:border-[#3D3028] text-xs font-bold gap-1 cursor-pointer hover:bg-muted/60"
            >
              <span>Next item</span>
              <ArrowRight className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: Item Details & Selling Status (5 of 12 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Item details */}
          <div className="rounded-[22px] border border-[#EBE1D4] dark:border-[#382C24] bg-[#FFFBF5] dark:bg-[#1E1815] p-6 shadow-[0_2px_12px_rgba(45,34,29,0.03)] space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Item details
              </h2>
              <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
                How this item appears on the POS and receipts.
              </p>
            </div>

            {/* Photo Box */}
            <div className="flex items-center gap-4 pt-1">
              <div className="size-20 rounded-2xl bg-[#FFF3DC] dark:bg-[#34271B] border border-[#F5E2C4] dark:border-[#4D3927] flex items-center justify-center shrink-0 text-[#E8A33D] overflow-hidden">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <Fish className="size-9 stroke-[1.6]" />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] block">
                  Item photo
                </span>
                <p className="text-[11px] text-[#8C7D73] dark:text-[#A89A90]">
                  JPG or PNG · Recommended 800 × 600px
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = prompt(
                      "Enter image URL for this dish:",
                      item.image || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80"
                    )
                    if (url !== null) {
                      setItem((prev) => ({ ...prev, image: url.trim() }))
                    }
                  }}
                  className="h-7.5 px-3 rounded-lg border-[#E4D6C4] dark:border-[#3D3028] text-xs font-bold gap-1.5 mt-1 cursor-pointer"
                >
                  <ImageIcon className="size-3.5 text-[#75665E]" />
                  <span>Replace photo</span>
                </Button>
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label
                htmlFor="item-name"
                className="text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] block"
              >
                Item name
              </label>
              <input
                id="item-name"
                type="text"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-[#E4D6C4] bg-background px-3.5 text-xs sm:text-sm text-[#2C221E] dark:text-[#FAF5EE] font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:border-[#3D3028]"
                placeholder="e.g. Grilled tilapia"
              />
            </div>

            {/* Selling price & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="selling-price"
                  className="text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] block"
                >
                  Selling price
                </label>
                <div className="relative mt-1">
                  <input
                    id="selling-price"
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      setItem({ ...item, price: Number(e.target.value) || 0 })
                    }
                    className="h-10 w-full rounded-xl border border-[#E4D6C4] bg-background pl-3.5 pr-14 text-xs sm:text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:border-[#3D3028]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
                    {currency}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] block"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={item.category}
                  onChange={(e) => setItem({ ...item, category: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-[#E4D6C4] bg-background px-3 text-xs sm:text-sm font-medium text-[#2C221E] dark:text-[#FAF5EE] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:border-[#3D3028]"
                >
                  {MENU_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* POS Description */}
            <div>
              <label
                htmlFor="pos-description"
                className="text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] block"
              >
                POS description
              </label>
              <textarea
                id="pos-description"
                rows={3}
                value={item.description}
                onChange={(e) =>
                  setItem({ ...item, description: e.target.value })
                }
                placeholder="Char-grilled tilapia, market vegetables and lemon."
                className="mt-1 w-full rounded-xl border border-[#E4D6C4] bg-background p-3 text-xs text-[#2C221E] dark:text-[#FAF5EE] font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none dark:border-[#3D3028]"
              />
            </div>
          </div>

          {/* Card 2: Selling status */}
          <div className="rounded-[22px] border border-[#EBE1D4] dark:border-[#382C24] bg-[#FFFBF5] dark:bg-[#1E1815] p-6 shadow-[0_2px_12px_rgba(45,34,29,0.03)] space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                Selling status
              </h2>
              <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
                Control where and when this item can be ordered.
              </p>
            </div>

            {/* Available for sale toggle row */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-[#2C221E] dark:text-[#FAF5EE] block">
                  Available for sale
                </span>
                <span className="text-[11px] text-[#8C7D73] dark:text-[#A89A90]">
                  Visible on POS and online ordering
                </span>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={item.available}
                onClick={() => setItem({ ...item, available: !item.available })}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none",
                  item.available
                    ? "bg-primary"
                    : "bg-[#D9CFC5] dark:bg-[#3D3028]"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition-transform mt-0.5 ml-0.5",
                    item.available ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Channels Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(
                [
                  { key: "dineIn", label: "Dine-in" },
                  { key: "takeaway", label: "Takeaway" },
                  { key: "delivery", label: "Delivery" },
                ] as const
              ).map(({ key, label }) => {
                const isSelected = item.channels[key]
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setItem({
                        ...item,
                        channels: {
                          ...item.channels,
                          [key]: !isSelected,
                        },
                      })
                    }
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                      isSelected
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-[#234D3A] dark:text-emerald-400"
                        : "border border-[#E4D6C4] bg-background text-[#8C7D73] hover:border-primary/60 dark:border-[#3D3028] dark:text-[#A89A90]"
                    )}
                  >
                    {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recipe builder Card (7 of 12 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-[22px] border border-[#EBE1D4] dark:border-[#382C24] bg-[#FFFBF5] dark:bg-[#1E1815] p-6 shadow-[0_2px_12px_rgba(45,34,29,0.03)] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  Recipe builder
                </h2>
                <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
                  Ingredients are deducted from stock for each serving sold.
                </p>
              </div>

              <Badge
                variant="success"
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
              >
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>{item.ingredients.length} ingredients</span>
              </Badge>
            </div>

            {/* Search & Add ingredient bar */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8C7D73]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowAddMenu(true)
                  }}
                  onFocus={() => setShowAddMenu(true)}
                  placeholder="Search inventory ingredients..."
                  className="h-10 w-full rounded-xl border border-[#E4D6C4] bg-background pl-9 pr-24 text-xs text-[#2C221E] dark:text-[#FAF5EE] font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:border-[#3D3028]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8C7D73] pointer-events-none">
                  238 available
                </span>

                {/* Dropdown inventory picker */}
                {showAddMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[#E4D6C4] bg-card p-1 shadow-lg z-20 space-y-1 dark:border-[#3D3028]">
                    {filteredLibrary.length > 0 ? (
                      filteredLibrary.map((inv) => (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => handleAddIngredient(inv)}
                          className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="font-bold text-foreground">{inv.name}</p>
                            <p className="text-[10px] text-muted-foreground">{inv.stock}</p>
                          </div>
                          <span className="text-[11px] font-semibold text-primary">
                            + Add to recipe
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="p-3 text-center text-xs text-muted-foreground">
                        No matching ingredients in inventory.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="size-4 stroke-[2.5]" />
                <span>Add ingredient</span>
              </Button>
            </div>

            {/* Ingredients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EBE1D4] dark:border-[#382C24] text-[10px] font-extrabold uppercase tracking-wider text-[#8C7D73] dark:text-[#A89A90]">
                    <th className="py-2.5 font-bold">INGREDIENT</th>
                    <th className="py-2.5 px-3 font-bold text-center">QTY PER SERVING</th>
                    <th className="py-2.5 px-3 font-bold text-right">LINE COST</th>
                    <th className="py-2.5 px-3 font-bold text-right">WASTE</th>
                    <th className="py-2.5 pl-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE1D4]/70 dark:divide-[#382C24]">
                  {item.ingredients.map((ing) => (
                    <tr key={ing.id} className="group hover:bg-muted/30 transition-colors">
                      {/* Ingredient Name & Stock */}
                      <td className="py-3 pr-2">
                        <p className="font-bold text-xs text-[#2C221E] dark:text-[#FAF5EE]">
                          {ing.name}
                        </p>
                        <p className="text-[11px] text-[#8C7D73] dark:text-[#A89A90]">
                          {ing.stockQuantity}
                        </p>
                      </td>

                      {/* Qty & Unit Input */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center rounded-lg border border-[#E4D6C4] bg-background overflow-hidden dark:border-[#3D3028]">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={ing.quantity}
                            onChange={(e) =>
                              handleQuantityChange(ing.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-14 sm:w-16 h-8 px-2 text-xs font-bold text-center text-[#2C221E] dark:text-[#FAF5EE] outline-none"
                          />
                          <select
                            value={ing.unit}
                            onChange={(e) => handleUnitChange(ing.id, e.target.value)}
                            aria-label={`Unit of measurement for ${ing.name}`}
                            className="h-8 border-l border-[#E4D6C4] bg-muted/40 px-1 text-[11px] font-semibold text-muted-foreground outline-none cursor-pointer dark:border-[#3D3028]"
                          >
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="pc">pc</option>
                            <option value="kg">kg</option>
                            <option value="L">L</option>
                          </select>
                        </div>
                      </td>

                      {/* Line Cost */}
                      <td className="py-3 px-3 text-right font-bold text-xs text-[#2C221E] dark:text-[#FAF5EE] whitespace-nowrap">
                        {currency} {ing.lineCost.toLocaleString()}
                      </td>

                      {/* Waste % */}
                      <td className="py-3 px-3 text-right text-xs text-[#8C7D73] dark:text-[#A89A90] whitespace-nowrap">
                        {ing.wastePercent}%
                      </td>

                      {/* Trash action */}
                      <td className="py-3 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteIngredient(ing.id)}
                          aria-label={`Remove ${ing.name} from recipe`}
                          className="text-destructive/70 hover:text-destructive transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="size-4 stroke-[1.8]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Metrics Summary Bar */}
            <div className="mt-4 pt-4 border-t border-[#EBE1D4] dark:border-[#382C24] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7D73] dark:text-[#A89A90] block">
                  Cost per serving
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[#2C221E] dark:text-[#FAF5EE] mt-0.5 block">
                  {currency} {costPerServing.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7D73] dark:text-[#A89A90] block">
                  Food cost
                </span>
                <span
                  className={cn(
                    "text-base sm:text-lg font-extrabold mt-0.5 block",
                    isWithinTarget
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  )}
                >
                  {foodCostPercent}%
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7D73] dark:text-[#A89A90] block">
                  Gross profit
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[#2C221E] dark:text-[#FAF5EE] mt-0.5 block">
                  {currency} {grossProfit.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7D73] dark:text-[#A89A90] block">
                  Target food cost
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      isWithinTarget ? "bg-emerald-600" : "bg-amber-600"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isWithinTarget
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    )}
                  >
                    {isWithinTarget ? "Within target" : "Above target"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POS Sync Info Modal */}
      {showHelpDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Utensils className="size-5" />
              <h3 className="text-base">Recipe &amp; POS Integration</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When kitchen staff rings up <strong>{item.name}</strong> on any Bara POS terminal,
              the ingredients listed in this Recipe Builder are automatically deducted from your
              inventory stock in real-time.
            </p>
            <div className="rounded-xl bg-muted/50 p-3 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span>Cost per serving:</span>
                <span>{currency} {costPerServing.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Selling price:</span>
                <span>{currency} {item.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-600">
                <span>Target threshold:</span>
                <span>Max {targetFoodCost}%</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={() => setShowHelpDialog(false)}
                className="h-8 rounded-xl text-xs font-bold"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
