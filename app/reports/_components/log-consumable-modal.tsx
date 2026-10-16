"use client"

import * as React from "react"
import { Layers, Plus, Receipt } from "lucide-react"
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
  consumablesApi,
  consumablePurchasesApi,
  Consumable,
  ConsumablePurchaseCreate,
} from "../reports-api"

interface LogConsumableModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export function LogConsumableModal({
  isOpen,
  onClose,
  onSuccess,
}: LogConsumableModalProps) {
  const [consumables, setConsumables] = React.useState<Consumable[]>([])
  const [selectedConsumableId, setSelectedConsumableId] = React.useState<string>("")
  const [quantity, setQuantity] = React.useState<string>("1")
  const [cost, setCost] = React.useState<string>("50000")
  const [purchaseDate, setPurchaseDate] = React.useState<string>(
    () => new Date().toISOString().split("T")[0]
  )
  const [note, setNote] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // New consumable inline creation state
  const [isCreatingItem, setIsCreatingItem] = React.useState(false)
  const [newItemName, setNewItemName] = React.useState("")
  const [newItemCategory, setNewItemCategory] = React.useState("Kitchen Operations")

  const loadConsumables = React.useCallback(async () => {
    const list = await consumablesApi.list()
    setConsumables(list)
    if (list.length > 0 && !selectedConsumableId) {
      setSelectedConsumableId(list[0].id)
    }
  }, [selectedConsumableId])

  React.useEffect(() => {
    if (isOpen) {
      loadConsumables()
    }
  }, [isOpen, loadConsumables])

  const handleCreateNewConsumableItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    const created = await consumablesApi.create({
      name: newItemName.trim(),
      category: newItemCategory.trim(),
    })
    setConsumables((prev) => [created, ...prev])
    setSelectedConsumableId(created.id)
    setIsCreatingItem(false)
    setNewItemName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConsumableId || !cost) return

    setIsSubmitting(true)
    try {
      await consumablePurchasesApi.create({
        consumable: selectedConsumableId,
        quantity: parseFloat(quantity) || 1,
        cost: parseFloat(cost) || 0,
        purchase_date: purchaseDate,
        note: note.trim() || undefined,
      })
      const selectedItem = consumables.find((c) => c.id === selectedConsumableId)
      onSuccess(
        `Logged purchase of ${selectedItem?.name || "consumable"} (${parseFloat(cost).toLocaleString()} RWF). Added to COGS summary.`
      )
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Layers className="size-4" />
            <span>Section 5.5 Specification</span>
          </div>
          <DialogTitle className="text-lg font-bold text-[#3B2F2A] dark:text-[#FAF5EE] mt-1">
            Log Consumable Purchase
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Record recurring non-food restaurant overheads (gas, packaging, cleaning supplies).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Consumable Item Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Consumable Supply Item <span className="text-primary">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingItem((prev) => !prev)}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" />
                <span>{isCreatingItem ? "Select existing" : "New consumable item"}</span>
              </button>
            </div>

            {isCreatingItem ? (
              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Cooking Gas 38kg, Takeaway Bags"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <div className="flex gap-2">
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="flex-1 h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none"
                  >
                    <option value="Fuel & Energy">Fuel &amp; Energy (Gas, Charcoal)</option>
                    <option value="Packaging">Takeaway Packaging</option>
                    <option value="Cleaning & Sanitation">Cleaning &amp; Sanitation</option>
                    <option value="Dining Supplies">Dining Supplies (Napkins, Straws)</option>
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateNewConsumableItem}
                    disabled={!newItemName.trim()}
                    className="h-8.5 text-xs font-bold bg-primary text-primary-foreground"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <select
                value={selectedConsumableId}
                onChange={(e) => setSelectedConsumableId(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              >
                {consumables.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category || "General"})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quantity & Cost */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Quantity Purchased
              </label>
              <input
                type="number"
                step="1"
                min="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Total Cost (RWF) <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="0"
                  required
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full h-10 px-3.5 pr-12 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary tabular-nums"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  RWF
                </span>
              </div>
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Purchase Date
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Supplier / Receipt Note
              </label>
              <input
                type="text"
                placeholder="e.g. SP Gas Nyarutarama"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
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
              disabled={isSubmitting || !cost}
              className="h-9 px-5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
            >
              {isSubmitting ? "Logging..." : "Record Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
