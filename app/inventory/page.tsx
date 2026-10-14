"use client"

import * as React from "react"
import {
  Boxes,
  CheckCircle2,
  FileSpreadsheet,
  PackagePlus,
  RefreshCw,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRestaurant } from "@/components/restaurant-provider"
import {
  ingredientsApi,
  stockMovementsApi,
  Ingredient,
  IngredientCreate,
  StockMovement,
  StockMovementCreate,
} from "@/lib/api-client"
import { InventoryKpiCards } from "./_components/inventory-kpi-cards"
import { IngredientsTable } from "./_components/ingredients-table"
import { StockMovementsTable } from "./_components/stock-movements-table"
import { AddIngredientModal } from "./_components/add-ingredient-modal"
import { AdjustStockModal } from "./_components/adjust-stock-modal"

export default function InventoryPage() {
  const { restaurant, formatCurrency, user } = useRestaurant()

  const [ingredients, setIngredients] = React.useState<Ingredient[]>([])
  const [movements, setMovements] = React.useState<StockMovement[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Modals state
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [showAdjustModal, setShowAdjustModal] = React.useState(false)
  const [selectedIngredientForAdjust, setSelectedIngredientForAdjust] =
    React.useState<Ingredient | null>(null)

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Fetch initial data
  const loadData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [ings, movs] = await Promise.all([
        ingredientsApi.list(),
        stockMovementsApi.list(),
      ])
      setIngredients(ings)
      setMovements(movs)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // Handle adding an ingredient
  const handleAddIngredient = async (data: IngredientCreate) => {
    try {
      const created = await ingredientsApi.create(data)
      setIngredients((prev) => [created, ...prev])
      showToast(`Added ingredient "${created.name}" to inventory catalog.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create ingredient"
      showToast(`Error: ${msg}`)
    }
  }

  // Handle adjusting stock
  const handleRecordMovement = async (data: StockMovementCreate) => {
    try {
      const created = await stockMovementsApi.create(data, user.name || "Kitchen Manager")
      setMovements((prev) => [created, ...prev])
      // Refresh ingredients to reflect updated stock level
      const updatedIngs = await ingredientsApi.list()
      setIngredients(updatedIngs)

      const movementLabel =
        data.movement_type === "in"
          ? "Stock-In (+)"
          : data.movement_type === "waste"
          ? "Waste Log (-)"
          : "Stock-Out (-)"
      showToast(
        `Recorded ${movementLabel} for ${created.ingredient_name || "ingredient"}. Stock levels recalculated!`
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record movement"
      showToast(`Error: ${msg}`)
    }
  }

  // Handle deleting an ingredient
  const handleDeleteIngredient = async (id: string) => {
    const item = ingredients.find((i) => i.id === id)
    if (!confirm(`Are you sure you want to delete ${item?.name || "this ingredient"}?`)) {
      return
    }
    await ingredientsApi.delete(id)
    setIngredients((prev) => prev.filter((i) => i.id !== id))
    showToast(`Removed "${item?.name}" from inventory.`)
  }

  const openAdjustFor = (item: Ingredient) => {
    setSelectedIngredientForAdjust(item)
    setShowAdjustModal(true)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="size-4 shrink-0 text-white" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/80 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Restaurant Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2F2A] dark:text-[#FAF5EE] tracking-tight mt-1">
            Ingredient &amp; Inventory Tracking
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Monitor real-time kitchen ingredient levels, track low stock thresholds, and record audited Stock-In and Kitchen Waste movements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 border-border shadow-2xs"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedIngredientForAdjust(null)
              setShowAdjustModal(true)
            }}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 bg-[#2F5233] hover:bg-[#254228] text-white shadow-xs"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Record Movement</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 bg-[#C1440E] hover:bg-[#A8390B] text-white shadow-xs"
          >
            <PackagePlus className="size-4" />
            <span>Add Ingredient</span>
          </Button>
        </div>
      </div>

      {/* 2. Inventory KPI Summary Cards */}
      <InventoryKpiCards
        ingredients={ingredients}
        movements={movements}
        formatCurrency={formatCurrency}
      />

      {/* 3. Tabs: Ingredients vs Movements Audit Log */}
      <Tabs defaultValue="ingredients" className="w-full space-y-6">
        <TabsList className="h-11 w-full sm:w-auto p-1 bg-muted/80 rounded-2xl grid grid-cols-2 sm:inline-flex border border-border/60">
          <TabsTrigger
            value="ingredients"
            className="rounded-xl px-4.5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-xs"
          >
            <Boxes className="size-4" />
            <span>Ingredients &amp; Stock Levels ({ingredients.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="movements"
            className="rounded-xl px-4.5 py-2 text-xs font-bold gap-2 data-active:bg-card data-active:text-foreground data-active:shadow-xs"
          >
            <FileSpreadsheet className="size-4" />
            <span>Stock Movements Ledger ({movements.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="mt-0">
          <IngredientsTable
            ingredients={ingredients}
            formatCurrency={formatCurrency}
            onAdjustStock={openAdjustFor}
            onDeleteIngredient={handleDeleteIngredient}
          />
        </TabsContent>

        <TabsContent value="movements" className="mt-0">
          <StockMovementsTable movements={movements} />
        </TabsContent>
      </Tabs>

      {/* Add Ingredient Modal */}
      <AddIngredientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        existingIngredients={ingredients}
        onSubmit={handleAddIngredient}
      />

      {/* Adjust Stock Movement Modal */}
      <AdjustStockModal
        isOpen={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false)
          setSelectedIngredientForAdjust(null)
        }}
        ingredient={selectedIngredientForAdjust}
        ingredients={ingredients}
        onSubmit={handleRecordMovement}
      />
    </div>
  )
}
