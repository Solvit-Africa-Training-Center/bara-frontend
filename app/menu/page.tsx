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
import { menuApi, type BackendMenuItem } from "@/lib/api-client"

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
  return backendItems.map((bItem) => {
    const id = bItem.id || bItem.menu_id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const nameLower = (bItem.name || "").toLowerCase().trim()
    const saved = savedRecipes[id] || savedRecipes[nameLower]
    const seedMatch = INITIAL_MENU_ITEMS.find(
      (s) => s.id === id || s.name.toLowerCase().trim() === nameLower
    )

    const ingredients = saved?.ingredients || seedMatch?.ingredients || []
    const recipeStatus =
      saved?.recipeStatus ||
      seedMatch?.recipeStatus ||
      (ingredients.length > 0 ? "complete" : "draft")

    return {
      id,
      name: bItem.name || "Untitled Item",
      category: bItem.category || seedMatch?.category || "Main dishes",
      price: typeof bItem.price === "number" ? bItem.price : parseFloat(bItem.price) || 0,
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
    }
  })
}

function MenuPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { restaurant } = useRestaurant()

  const [items, setItems] = React.useState<MenuItemWithRecipe[]>(INITIAL_MENU_ITEMS)
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
          // If server returned empty, fallback to INITIAL_MENU_ITEMS
          setItems(INITIAL_MENU_ITEMS)
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
  const activeItem = items.find((i) => i.id === activeItemId) || items[0]
  const currentIndex = items.findIndex((i) => i.id === activeItem?.id)

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

    // Sync to backend
    try {
      await menuApi.update(updated.id, {
        name: updated.name,
        description: updated.description,
        price: String(updated.price),
        category: updated.category,
        is_available: updated.available,
      })
    } catch {
      // If item was created locally and not on backend yet, create it
      try {
        const created = await menuApi.create({
          name: updated.name,
          description: updated.description,
          price: String(updated.price),
          category: updated.category,
          is_available: updated.available,
        })
        if (created.id && created.id !== updated.id) {
          const syncedItem = { ...itemToSave, id: created.id }
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


