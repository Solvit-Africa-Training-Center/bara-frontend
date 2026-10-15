"use client"

import * as React from "react"
import { AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Ingredient, IngredientCreate } from "@/lib/api-client"
import { validateData, ingredientSchema } from "@/lib/validations"

interface AddIngredientModalProps {
  isOpen: boolean
  onClose: () => void
  existingIngredients: Ingredient[]
  onSubmit: (data: IngredientCreate) => Promise<void>
}

const COMMON_UNITS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "L", label: "Litres (L)" },
  { value: "ml", label: "Millilitres (ml)" },
  { value: "piece", label: "Pieces (pcs)" },
  { value: "can", label: "Cans / Tins" },
  { value: "bottle", label: "Bottles" },
  { value: "bunch", label: "Bunches / Packs" },
]

export function AddIngredientModal({
  isOpen,
  onClose,
  existingIngredients,
  onSubmit,
}: AddIngredientModalProps) {
  const [name, setName] = React.useState("")
  const [unit, setUnit] = React.useState("kg")
  const [lowStockThreshold, setLowStockThreshold] = React.useState("5")
  const [costPerUnit, setCostPerUnit] = React.useState("3000")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Warn on duplicate name (Section 5.1 edge case: warn but allow)
  const isDuplicateName = existingIngredients.some(
    (i) => i.name.trim().toLowerCase() === name.trim().toLowerCase()
  )

  const [validationError, setValidationError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const payload = {
      name: name.trim(),
      unit: unit.trim(),
      low_stock_threshold: parseFloat(lowStockThreshold) || 0,
      cost_per_unit: parseFloat(costPerUnit) || 0,
    }

    const validation = validateData(ingredientSchema, payload)
    if (!validation.isValid) {
      setValidationError(validation.error || "Please check your ingredient details.")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(payload)
      setName("")
      setLowStockThreshold("5")
      setCostPerUnit("3000")
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
            Add New Ingredient
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Register a raw stock item to track in kitchen inventory and integrate into menu recipes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              <AlertCircle className="size-4 shrink-0 stroke-[2] text-red-600 dark:text-red-400 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Ingredient Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sambaza Fresh, Cassava Leaf (Isombe), Maracuja"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {isDuplicateName && name.trim() && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>An ingredient with this name already exists. You can still save it if tracking different grades.</span>
              </div>
            )}
          </div>

          {/* 2. Unit Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Stock Measuring Unit <span className="text-primary">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              {COMMON_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Threshold & Cost Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Low Stock Alert Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full h-10 px-3.5 pr-10 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 tabular-nums"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground uppercase">
                  {unit}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Flags manager warning when below this level
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Unit Cost (RWF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="50"
                  min="0"
                  required
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="w-full h-10 px-3.5 pr-12 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 tabular-nums"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  RWF
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Estimated purchase cost per {unit}
              </p>
            </div>
          </div>

          <DialogFooter className="pt-3 flex items-center justify-end gap-2">
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
              disabled={isSubmitting || !name.trim()}
              className="h-9 px-5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
            >
              {isSubmitting ? "Creating..." : "Save Ingredient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
