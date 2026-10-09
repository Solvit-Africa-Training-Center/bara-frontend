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

function MenuPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { restaurant } = useRestaurant()

  const [items, setItems] = React.useState<MenuItemWithRecipe[]>(INITIAL_MENU_ITEMS)
  
  // Default view is the catalog; editing/creating switches to the editor
  const requestedItemId = searchParams.get("item")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const counterRef = React.useRef(items.length + 1)

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

  const handleSaveItem = (updated: MenuItemWithRecipe) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === updated.id)
      if (exists) {
        return prev.map((i) => (i.id === updated.id ? updated : i))
      }
      return [updated, ...prev]
    })
  }

  const handleNewItem = () => {
    const newItemId = `item-custom-${counterRef.current++}`
    const newItem: MenuItemWithRecipe = {
      id: newItemId,
      name: "New Recipe Dish",
      category: "Main dishes",
      price: 10000,
      description: "Description of the new dish for POS tickets and digital receipts.",
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

    setItems((prev) => [newItem, ...prev])
    setSelectedId(newItem.id)
    router.replace(`/menu?item=${newItem.id}`, { scroll: false })
  }

  const handleToggleAvailable = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    )
  }

  const handleCancelEdit = () => {
    setSelectedId(null)
    router.replace("/menu", { scroll: false })
  }

  const handleSelectFromCatalog = (item: MenuItemWithRecipe) => {
    setSelectedId(item.id)
    router.replace(`/menu?item=${item.id}`, { scroll: false })
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

  const handleDuplicateItem = (item: MenuItemWithRecipe) => {
    const newItem: MenuItemWithRecipe = {
      ...item,
      id: `item-${Date.now()}`,
      name: `${item.name} (Copy)`,
      lastSavedText: "Draft duplicate",
    }
    setItems((prev) => [newItem, ...prev])
  }

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
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
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading menu management...</div>}>
      <MenuPageContent />
    </React.Suspense>
  )
}
