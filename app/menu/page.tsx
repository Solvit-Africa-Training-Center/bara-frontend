"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { useRestaurant } from "@/components/restaurant-provider"
import {
  INITIAL_MENU_ITEMS,
  type MenuItemWithRecipe,
} from "./_lib/menu-data"
import { MenuEditor } from "./_components/menu-editor"
import { MenuCatalog } from "./_components/menu-catalog"
import { MenuSkeleton } from "./_components/menu-skeleton"
import { menuApi, type BackendMenuItem, type BackendRecipeLine } from "./menu-api"
import { offlineStore } from "@/lib/offline-store"

const RECIPES_STORAGE_KEY = "bara_menu_recipes"

function getSavedRecipes(): Record<string, Partial<MenuItemWithRecipe>> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(RECIPES_STORAGE_KEY) || "{}")
  } catch {
    return {}
  }
}

function saveRecipeLocally(item: MenuItemWithRecipe) {
  if (typeof window === "undefined") return
  try {
    const saved = getSavedRecipes()
    const meta: Partial<MenuItemWithRecipe> = {
      ingredients: item.ingredients,
      channels: item.channels,
      iconType: item.iconType,
      recipeStatus: item.recipeStatus,
      lastSavedText: item.lastSavedText,
      category: item.category,
    }
    saved[item.id] = meta
    if (item.name) {
      saved[item.name.toLowerCase().trim()] = meta
    }
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(saved))
  } catch (e) {
    console.error("Error saving recipe locally:", e)
  }
}

function mapBackendToFrontend(
  backendItems: BackendMenuItem[],
  savedRecipes: Record<string, Partial<MenuItemWithRecipe>>
): MenuItemWithRecipe[] {
  const allIngredients = offlineStore.getIngredients()

  return backendItems.map((bItem) => {
    const id = bItem.id || bItem.menu_id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const nameLower = (bItem.name || "").toLowerCase().trim()
    const saved = savedRecipes[id] || savedRecipes[nameLower]

    // Flexible seed matching for Rwandan staples
    const seedMatch = INITIAL_MENU_ITEMS.find((s) => {
      if (s.id === id) return true
      const sLower = s.name.toLowerCase().trim()
      if (sLower === nameLower) return true
      if (nameLower.includes("tilapia") && sLower.includes("tilapia")) return true
      if (nameLower.includes("brochette") && sLower.includes("brochette")) return true
      if (nameLower.includes("sambaza") && (sLower.includes("sambaza") || sLower.includes("fritters") || sLower.includes("fries"))) return true
      if (nameLower.includes("salad") && sLower.includes("salad")) return true
      if ((nameLower.includes("chocolate") || nameLower.includes("lava") || nameLower.includes("cake")) && (sLower.includes("chocolate") || sLower.includes("lava") || sLower.includes("cake") || sLower.includes("mousse"))) return true
      return false
    })

    let ingredients = saved?.ingredients || []
    if (Array.isArray(bItem.recipe_lines) && bItem.recipe_lines.length > 0) {
      ingredients = bItem.recipe_lines.map((rl) => {
        const qty = parseFloat(String(rl.quantity_used)) || 0
        const waste = parseFloat(String(rl.waste_percent || 0))
        const ingMatch = allIngredients.find(
          (ing) =>
            ing.id === rl.ingredient ||
            ing.name.toLowerCase() === (rl.ingredient_name || "").toLowerCase()
        )
        const costPerUnit = ingMatch ? parseFloat(String(ingMatch.cost_per_unit)) || 0 : 0
        const lineCost = Math.round(qty * costPerUnit * (1 + waste / 100))
        return {
          id: rl.id || rl.ingredient,
          ingredientId: rl.ingredient,
          name: rl.ingredient_name || ingMatch?.name || "Ingredient",
          stockQuantity: ingMatch
            ? `${ingMatch.current_quantity ?? 0} ${ingMatch.unit} in stock`
            : "In stock",
          quantity: qty,
          unit: rl.unit || ingMatch?.unit || "unit",
          costPerUnit,
          lineCost,
          wastePercent: waste,
        }
      })
    } else if (ingredients.length === 0 && seedMatch?.ingredients?.length) {
      ingredients = seedMatch.ingredients
    }

    const calculatedLineCost = ingredients.reduce((sum, ing) => sum + (ing.lineCost || 0), 0)
    const costPerServing = bItem.cost_per_serving
      ? parseFloat(bItem.cost_per_serving)
      : calculatedLineCost > 0
      ? calculatedLineCost
      : seedMatch?.ingredients?.length
      ? seedMatch.ingredients.reduce((sum, ing) => sum + (ing.lineCost || 0), 0)
      : undefined

    const price = typeof bItem.price === "number" ? bItem.price : parseFloat(bItem.price) || 0
    const foodCostPercent = bItem.food_cost_percent
      ? parseFloat(bItem.food_cost_percent)
      : costPerServing && price > 0
      ? Number(((costPerServing / price) * 100).toFixed(1))
      : undefined

    const grossProfit = bItem.gross_profit
      ? parseFloat(bItem.gross_profit)
      : costPerServing && price > 0
      ? Math.max(0, price - costPerServing)
      : undefined

    const recipeStatus =
      ingredients.length > 0
        ? "complete"
        : (saved?.recipeStatus || seedMatch?.recipeStatus || "draft")

    const targetFoodCostPercent = bItem.target_food_cost_percent
      ? parseFloat(String(bItem.target_food_cost_percent))
      : undefined
    const availableServings =
      bItem.available_servings !== undefined
        ? bItem.available_servings
        : (seedMatch?.availableServings ?? undefined)

    return {
      id,
      name: bItem.name || "Untitled Item",
      category: bItem.category || seedMatch?.category || "Main dishes",
      price,
      description: bItem.description || seedMatch?.description || "",
      available: bItem.is_available ?? true,
      channels: saved?.channels || seedMatch?.channels || {
        dineIn: true,
        takeaway: true,
        delivery: true,
      },
      iconType: saved?.iconType || seedMatch?.iconType,
      recipeStatus,
      lastSavedText: saved?.lastSavedText || seedMatch?.lastSavedText || "Synced with server",
      ingredients,
      costPerServing,
      foodCostPercent,
      grossProfit,
      targetFoodCostPercent,
      availableServings,
    }
  })
}

function MenuPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { restaurant } = useRestaurant()

  const [items, setItems] = React.useState<MenuItemWithRecipe[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch live menu items on mount
  React.useEffect(() => {
    let isMounted = true

    async function loadMenu() {
      try {
        const backendItems = await menuApi.list()
        if (!isMounted) return

        const savedRecipes = getSavedRecipes()
        if (backendItems && backendItems.length > 0) {
          const mapped = mapBackendToFrontend(backendItems, savedRecipes)
          setItems(mapped)
        } else {
          setItems([])
        }
      } catch (err) {
        console.error("Failed to load menu items from API:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadMenu()

    return () => {
      isMounted = false
    }
  }, [])

  // Default view is the catalog; editing/creating switches to the editor
  const requestedItemId = searchParams.get("item")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const counterRef = React.useRef(Date.now())

  const activeItemId = requestedItemId || selectedId
  const activeItem = activeItemId ? items.find((i) => i.id === activeItemId) : null
  const currentIndex = activeItem ? items.findIndex((i) => i.id === activeItem.id) : -1

  // When active item is opened in the editor, refresh its latest details and recipe lines from backend
  React.useEffect(() => {
    if (!activeItemId || activeItemId.startsWith("item-") || activeItemId.startsWith("seed-")) return
    let isCurrent = true
    menuApi
      .retrieve(activeItemId)
      .then((backendItem) => {
        if (!isCurrent || !backendItem) return
        const savedRecipes = getSavedRecipes()
        const mapped = mapBackendToFrontend([backendItem], savedRecipes)[0]
        if (mapped) {
          setItems((prev) =>
            prev.map((item) => (item.id === mapped.id ? { ...item, ...mapped } : item))
          )
        }
      })
      .catch(() => {})
    return () => {
      isCurrent = false
    }
  }, [activeItemId])

  const handlePreviousItem = () => {
    if (items.length === 0) return
    const prevIndex = (currentIndex - 1 + items.length) % items.length
    const target = items[prevIndex]
    setSelectedId(target.id)
    router.replace(`/menu?item=${target.id}`, { scroll: false })
  }

  const handleNextItem = () => {
    if (items.length === 0) return
    const nextIndex = (currentIndex + 1) % items.length
    const target = items[nextIndex]
    setSelectedId(target.id)
    router.replace(`/menu?item=${target.id}`, { scroll: false })
  }

  const handleSaveItem = async (updated: MenuItemWithRecipe) => {
    const itemToSave: MenuItemWithRecipe = {
      ...updated,
      lastSavedText: "Saved just now",
      recipeStatus: updated.ingredients.length > 0 ? "complete" : "draft",
    }

    // Optimistic UI update
    setItems((prev) => {
      const exists = prev.some((i) => i.id === updated.id)
      if (exists) {
        return prev.map((i) => (i.id === updated.id ? itemToSave : i))
      }
      return [itemToSave, ...prev]
    })

    saveRecipeLocally(itemToSave)

    // Map ingredients to backend recipe_lines format
    const allIngredients = offlineStore.getIngredients()
    const isUUID = (val?: string) =>
      typeof val === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)

    const recipeLines: BackendRecipeLine[] = []
    for (const ing of updated.ingredients || []) {
      let ingredientUuid: string | undefined = undefined

      if (isUUID(ing.ingredientId)) {
        ingredientUuid = ing.ingredientId
      } else if (isUUID(ing.id)) {
        ingredientUuid = ing.id
      } else {
        const match = allIngredients.find(
          (ai) => isUUID(ai.id) && ai.name.toLowerCase().trim() === ing.name.toLowerCase().trim()
        )
        if (match) {
          ingredientUuid = match.id
        }
      }

      if (ingredientUuid && ing.quantity > 0) {
        recipeLines.push({
          ingredient: ingredientUuid,
          quantity_used: String(ing.quantity),
          waste_percent: String(ing.wastePercent || 0),
        })
      }
    }

    // Sync to backend
    try {
      const updatedRes = await menuApi.update(updated.id, {
        name: updated.name,
        description: updated.description,
        price: String(updated.price),
        category: updated.category,
        is_available: updated.available,
        recipe_lines: recipeLines,
        target_food_cost_percent: updated.targetFoodCostPercent,
      })

      if (updatedRes) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === updated.id
              ? {
                  ...i,
                  available: updatedRes.is_available ?? i.available,
                  costPerServing: updatedRes.cost_per_serving
                    ? parseFloat(updatedRes.cost_per_serving)
                    : i.costPerServing,
                  foodCostPercent: updatedRes.food_cost_percent
                    ? parseFloat(updatedRes.food_cost_percent)
                    : i.foodCostPercent,
                  grossProfit: updatedRes.gross_profit
                    ? parseFloat(updatedRes.gross_profit)
                    : i.grossProfit,
                  availableServings:
                    updatedRes.available_servings !== undefined
                      ? updatedRes.available_servings
                      : i.availableServings,
                }
              : i
          )
        )
      }
    } catch {
      // If item was created locally and not on backend yet, create it
      try {
        const created = await menuApi.create({
          name: updated.name,
          description: updated.description,
          price: String(updated.price),
          category: updated.category,
          is_available: updated.available,
          recipe_lines: recipeLines,
          target_food_cost_percent: updated.targetFoodCostPercent,
        })
        if (created.id && created.id !== updated.id) {
          const syncedItem = {
            ...itemToSave,
            id: created.id,
            costPerServing: created.cost_per_serving ? parseFloat(created.cost_per_serving) : itemToSave.costPerServing,
            foodCostPercent: created.food_cost_percent ? parseFloat(created.food_cost_percent) : itemToSave.foodCostPercent,
            grossProfit: created.gross_profit ? parseFloat(created.gross_profit) : itemToSave.grossProfit,
            availableServings: created.available_servings !== undefined ? created.available_servings : itemToSave.availableServings,
          }
          setItems((prev) =>
            prev.map((i) => (i.id === updated.id ? syncedItem : i))
          )
          saveRecipeLocally(syncedItem)
          if (selectedId === updated.id) {
            setSelectedId(created.id)
            router.replace(`/menu?item=${created.id}`, { scroll: false })
          }
        }
      } catch (createErr) {
        console.error("Error creating item on backend:", createErr)
      }
    }
  }

  const handleNewItem = async () => {
    const tempName = "New Recipe Dish"
    const tempPrice = 10000
    const tempCategory = "Main dishes"
    const tempDesc = "Description of the new dish for POS tickets and digital receipts."

    try {
      const created = await menuApi.create({
        name: tempName,
        price: String(tempPrice),
        category: tempCategory,
        description: tempDesc,
        is_available: true,
      })

      const newItem: MenuItemWithRecipe = {
        id: created.id || created.menu_id || `item-custom-${counterRef.current++}`,
        name: created.name || tempName,
        category: created.category || tempCategory,
        price: typeof created.price === "number" ? created.price : parseFloat(created.price) || tempPrice,
        description: created.description || tempDesc,
        available: created.is_available ?? true,
        channels: {
          dineIn: true,
          takeaway: true,
          delivery: true,
        },
        recipeStatus: "in_progress",
        lastSavedText: "Created just now",
        ingredients: [],
      }

      saveRecipeLocally(newItem)
      setItems((prev) => [newItem, ...prev])
      setSelectedId(newItem.id)
      router.replace(`/menu?item=${newItem.id}`, { scroll: false })
    } catch (err) {
      console.error("Backend create failed, fallback to local:", err)
      const newItemId = `item-custom-${counterRef.current++}`
      const newItem: MenuItemWithRecipe = {
        id: newItemId,
        name: tempName,
        category: tempCategory,
        price: tempPrice,
        description: tempDesc,
        available: true,
        channels: {
          dineIn: true,
          takeaway: true,
          delivery: true,
        },
        recipeStatus: "in_progress",
        lastSavedText: "Draft",
        ingredients: [],
      }

      saveRecipeLocally(newItem)
      setItems((prev) => [newItem, ...prev])
      setSelectedId(newItem.id)
      router.replace(`/menu?item=${newItem.id}`, { scroll: false })
    }
  }

  const handleToggleAvailable = async (id: string) => {
    const current = items.find((i) => i.id === id)
    if (!current) return
    const nextAvailable = !current.available

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: nextAvailable } : i))
    )

    try {
      await menuApi.update(id, { is_available: nextAvailable })
    } catch (err) {
      console.error("Failed to toggle availability:", err)
    }
  }

  const handleRefreshAvailability = async (id: string) => {
    try {
      const refreshed = await menuApi.refreshAvailability(id)
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                available: refreshed.is_available ?? i.available,
                availableServings: refreshed.available_servings ?? i.availableServings,
              }
            : i
        )
      )
    } catch (err) {
      console.error("Failed to refresh availability from backend:", err)
    }
  }

  const handleCancelEdit = () => {
    setSelectedId(null)
    router.replace("/menu", { scroll: false })
  }

  const handleSelectFromCatalog = (item: MenuItemWithRecipe) => {
    setSelectedId(item.id)
    router.replace(`/menu?item=${item.id}`, { scroll: false })
  }

  const handleDuplicateItem = async (item: MenuItemWithRecipe) => {
    const copyName = `${item.name} (Copy)`
    try {
      const created = await menuApi.create({
        name: copyName,
        description: item.description,
        price: String(item.price),
        category: item.category,
        is_available: item.available,
      })

      const newItem: MenuItemWithRecipe = {
        ...item,
        id: created.id || created.menu_id || `item-${Date.now()}`,
        name: copyName,
        lastSavedText: "Draft duplicate",
      }
      saveRecipeLocally(newItem)
      setItems((prev) => [newItem, ...prev])
    } catch (err) {
      console.error("Failed to duplicate item on backend, fallback to local:", err)
      const newItem: MenuItemWithRecipe = {
        ...item,
        id: `item-${Date.now()}`,
        name: copyName,
        lastSavedText: "Draft duplicate",
      }
      saveRecipeLocally(newItem)
      setItems((prev) => [newItem, ...prev])
    }
  }

  const handleDeleteItem = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selectedId === id) {
      setSelectedId(null)
      router.replace("/menu", { scroll: false })
    }

    try {
      await menuApi.delete(id)
    } catch (err) {
      console.error("Failed to delete menu item:", err)
    }
  }

  if (isLoading) {
    return <MenuSkeleton />
  }

  if (activeItemId && activeItem) {
    return (
      <div className="space-y-4">
        {/* Quick top bar switch to catalog */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pb-1 border-b border-border/50">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="hover:text-foreground font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>← Back to menu catalog</span>
          </button>
          <span>Bara Recipe Engineering &amp; POS Integration</span>
        </div>

        <MenuEditor
          key={activeItem.id}
          item={activeItem}
          onSave={handleSaveItem}
          onCancel={handleCancelEdit}
          onPreviousItem={handlePreviousItem}
          onNextItem={handleNextItem}
          currency={restaurant.currency || "RWF"}
          targetFoodCost={restaurant.kitchenTarget || 34}
        />
      </div>
    )
  }

  return (
    <MenuCatalog
      items={items}
      onEditItem={handleSelectFromCatalog}
      onNewItem={handleNewItem}
      onToggleAvailable={handleToggleAvailable}
      onDuplicateItem={handleDuplicateItem}
      onDeleteItem={handleDeleteItem}
      onRefreshAvailability={handleRefreshAvailability}
      currency={restaurant.currency || "RWF"}
    />
  )
}

export default function MenuPage() {
  return (
    <React.Suspense fallback={<MenuSkeleton />}>
      <MenuPageContent />
    </React.Suspense>
  )
}


