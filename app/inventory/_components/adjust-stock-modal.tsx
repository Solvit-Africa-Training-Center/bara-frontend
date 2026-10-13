"use client"

import * as React from "react"
import { AlertTriangle, ArrowDown, ArrowUp, Minus, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Ingredient, MovementTypeEnum, StockMovementCreate } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface AdjustStockModalProps {
  isOpen: boolean
  onClose: () => void
  ingredient: Ingredient | null
  ingredients: Ingredient[]
  onSubmit: (data: StockMovementCreate) => Promise<void>
}

export function AdjustStockModal({
  isOpen,
  onClose,
  ingredient,
  ingredients,
  onSubmit,
}: AdjustStockModalProps) {
  const [selectedIngredientId, setSelectedIngredientId] = React.useState<string>(
    ingredient?.id || (ingredients[0]?.id ?? "")
  )
  const [movementType, setMovementType] = React.useState<MovementTypeEnum>("in")
  const [quantity, setQuantity] = React.useState<number>(1)
  const [note, setNote] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (ingredient) {
      setSelectedIngredientId(ingredient.id)
    } else if (ingredients.length > 0 && !selectedIngredientId) {
      setSelectedIngredientId(ingredients[0].id)
    }
  }, [ingredient, ingredients, selectedIngredientId])

  const activeIngredient =
    ingredients.find((i) => i.id === selectedIngredientId) || ingredient

  const handleStep = (delta: number) => {
    setQuantity((prev) => Math.max(0.1, parseFloat((prev + delta).toFixed(2))))
  }

  const handleFastStep = (delta: number) => {
    setQuantity((prev) => Math.max(0.1, parseFloat((prev + delta).toFixed(2))))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIngredientId || quantity <= 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        ingredient: selectedIngredientId,
        movement_type: movementType,
        quantity: quantity,
        note: note.trim() || undefined,
      })
      setQuantity(1)
      setNote("")
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-lg font-bold text-[#3B2F2A] dark:text-[#FAF5EE]">
            Record Stock Movement
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Update raw kitchen stock levels, log deliveries, or record kitchen waste audit logs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Ingredient Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Select Ingredient
            </label>
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              {ingredients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.current_quantity ?? 0} {item.unit} available)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Movement Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Movement Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMovementType("in")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                  movementType === "in"
                    ? "border-[#2F5233] bg-[#2F5233]/10 text-[#2F5233] dark:text-emerald-400 dark:border-emerald-500/60 shadow-xs"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                )}
              >
                <ArrowUp className="size-4 mb-1 text-[#2F5233] dark:text-emerald-400" />
                <span>Stock In (+)</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Delivery / Restock</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType("out")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                  movementType === "out"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                )}
              >
                <ArrowDown className="size-4 mb-1 text-primary" />
                <span>Stock Out (-)</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Kitchen Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType("waste")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                  movementType === "waste"
                    ? "border-[#A83232] bg-[#A83232]/10 text-[#A83232] shadow-xs"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                )}
              >
                <Trash2 className="size-4 mb-1 text-[#A83232]" />
                <span>Waste (-)</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Spoilage / Drops</span>
              </button>
            </div>
          </div>

          {/* 3. Large Numeric Stepper (Touch-First Spec Section 1.4 & 5.1) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span>Quantity to Record</span>
              <span className="text-muted-foreground">
                Unit: <span className="text-foreground uppercase">{activeIngredient?.unit || "units"}</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-2xl border border-border/80 bg-muted/30">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFastStep(-5)}
                  className="size-9 rounded-xl border border-border bg-card flex items-center justify-center text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-transform"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-transform"
                >
                  <Minus className="size-5" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center px-4">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-24 text-center text-2xl font-black bg-transparent text-[#3B2F2A] dark:text-[#FAF5EE] focus:outline-none tabular-nums"
                />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  {activeIngredient?.unit || "units"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="size-11 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-transform"
                >
                  <Plus className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFastStep(5)}
                  className="size-9 rounded-xl border border-border bg-card flex items-center justify-center text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-transform"
                >
                  +5
                </button>
              </div>
            </div>
          </div>

          {/* 4. Reason / Note Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Optional Movement Note
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly delivery from Lake Kivu supplier, prep drop, power loss"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-9.5 px-3.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Dialog Action Buttons */}
          <DialogFooter className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || quantity <= 0}
              className={cn(
                "h-9 px-5 rounded-xl text-xs font-bold text-white shadow-xs",
                movementType === "in"
                  ? "bg-[#2F5233] hover:bg-[#254228]"
                  : movementType === "waste"
                  ? "bg-[#A83232] hover:bg-[#8D2828]"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isSubmitting ? "Recording..." : "Confirm Movement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
