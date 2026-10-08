"use client"

import * as React from "react"
import Image from "next/image"
import {
  CheckCircle2,
  Download,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useRestaurant } from "@/components/restaurant-provider"

interface MenuItem {
  id: string
  name: string
  category: "Main Kitchen" | "Bar & Cocktails" | "Specials & Desserts"
  price: number
  cogs: number
  portionCostPercent: number
  ordersToday: number
  available: boolean
  image: string
  description: string
}

interface OrderItem {
  item: MenuItem
  quantity: number
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Tenderloin AAA",
    category: "Main Kitchen",
    price: 10000,
    cogs: 3200,
    portionCostPercent: 32.0,
    ordersToday: 42,
    available: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=160&auto=format&fit=crop&q=80",
    description: "Charcoal-grilled prime beef tenderloin with garlic herb butter and charred vegetables.",
  },
  {
    id: "2",
    name: "Mushroom Risotto with Truffle",
    category: "Main Kitchen",
    price: 8000,
    cogs: 2300,
    portionCostPercent: 28.75,
    ordersToday: 36,
    available: true,
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=160&auto=format&fit=crop&q=80",
    description: "Creamy arborio rice, wild forest mushrooms, aged parmesan crisp, black truffle oil.",
  },
  {
    id: "3",
    name: "Hibiscus Citrus Spritz",
    category: "Bar & Cocktails",
    price: 3000,
    cogs: 650,
    portionCostPercent: 21.67,
    ordersToday: 58,
    available: true,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=160&auto=format&fit=crop&q=80",
    description: "House-steeped organic hibiscus flower infusion, fresh lime, prosecco, and tonic.",
  },
  {
    id: "4",
    name: "Garlic Butter Prawns",
    category: "Specials & Desserts",
    price: 8000,
    cogs: 2800,
    portionCostPercent: 35.0,
    ordersToday: 28,
    available: true,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=160&auto=format&fit=crop&q=80",
    description: "Sautéed jumbo prawns in garlic emulsion, white wine reduction, and fresh parsley.",
  },
  {
    id: "5",
    name: "Prime BBQ Beef Ribs",
    category: "Main Kitchen",
    price: 12500,
    cogs: 4100,
    portionCostPercent: 32.8,
    ordersToday: 24,
    available: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=160&auto=format&fit=crop&q=80",
    description: "Slow-roasted tender beef short ribs glazed in house tamarind BBQ reduction.",
  },
  {
    id: "6",
    name: "Passionfruit Mint Mocktail",
    category: "Bar & Cocktails",
    price: 2500,
    cogs: 500,
    portionCostPercent: 20.0,
    ordersToday: 32,
    available: true,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=160&auto=format&fit=crop&q=80",
    description: "Fresh Kigali passionfruit pulp, crushed garden mint, citrus soda, and raw cane sugar.",
  },
  {
    id: "7",
    name: "Artisan Chocolate Fondant",
    category: "Specials & Desserts",
    price: 5500,
    cogs: 1400,
    portionCostPercent: 25.45,
    ordersToday: 19,
    available: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=160&auto=format&fit=crop&q=80",
    description: "Warm molten dark chocolate cake served with Madagascar vanilla bean gelato.",
  },
  {
    id: "8",
    name: "Crispy Calamari Fritti",
    category: "Main Kitchen",
    price: 7000,
    cogs: 2200,
    portionCostPercent: 31.43,
    ordersToday: 21,
    available: false,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=160&auto=format&fit=crop&q=80",
    description: "Tender calamari rings in spiced tempura batter with chili-lime dipping aioli.",
  },
]

export default function MenuPage() {
  const { restaurant, formatCurrency } = useRestaurant()
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(initialMenuItems)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All")
  const [selectedTable, setSelectedTable] = React.useState("Table 4")
  const [savedNotice, setSavedNotice] = React.useState("")

  // Active Order Ticket State (matching Figma Frame with POS drawer)
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([
    { item: initialMenuItems[0], quantity: 2 },
    { item: initialMenuItems[2], quantity: 2 },
  ])

  // Dialog state for adding items
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newItemName, setNewItemName] = React.useState("")
  const [newItemCategory, setNewItemCategory] = React.useState<MenuItem["category"]>("Main Kitchen")
  const [newItemPrice, setNewItemPrice] = React.useState("")
  const [newItemCost, setNewItemCost] = React.useState("")
  const [newItemDesc, setNewItemDesc] = React.useState("")

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Add dish to order ticket
  const addToOrder = (item: MenuItem) => {
    if (!item.available) return
    setOrderItems((prev) => {
      const existing = prev.find((oi) => oi.item.id === item.id)
      if (existing) {
        return prev.map((oi) =>
          oi.item.id === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((oi) => {
          if (oi.item.id === itemId) {
            const nextQty = oi.quantity + delta
            return nextQty > 0 ? { ...oi, quantity: nextQty } : null
          }
          return oi
        })
        .filter(Boolean) as OrderItem[]
    )
  }

  const clearOrder = () => {
    setOrderItems([])
  }

  const handlePlaceOrder = () => {
    if (orderItems.length === 0) return
    setSavedNotice(`Order sent to kitchen for ${selectedTable}! Ticket ref: TRX-${Math.floor(1000 + Math.random() * 9000)}`)
    setOrderItems([])
    setTimeout(() => setSavedNotice(""), 4000)
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseFloat(newItemPrice) || 0
    const costNum = parseFloat(newItemCost) || 0
    if (!newItemName.trim() || priceNum <= 0) return

    const portionCost = priceNum > 0 ? (costNum / priceNum) * 100 : 0

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      price: priceNum,
      cogs: costNum,
      portionCostPercent: parseFloat(portionCost.toFixed(1)),
      ordersToday: 0,
      available: true,
      image:
        newItemCategory === "Bar & Cocktails"
          ? "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=160&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1544025162-d76694265947?w=160&auto=format&fit=crop&q=80",
      description: newItemDesc.trim() || "Freshly crafted dish using local ingredients.",
    }

    setMenuItems([item, ...menuItems])
    setShowAddModal(false)
    setNewItemName("")
    setNewItemPrice("")
    setNewItemCost("")
    setNewItemDesc("")
    setSavedNotice(`Added ${item.name} to the menu!`)
    setTimeout(() => setSavedNotice(""), 3500)
  }

  // Calculations for order ticket
  const ticketSubtotal = orderItems.reduce(
    (sum, oi) => sum + oi.item.price * oi.quantity,
    0
  )
  const ticketCost = orderItems.reduce(
    (sum, oi) => sum + oi.item.cogs * oi.quantity,
    0
  )
  const ticketMarginPercent =
    ticketSubtotal > 0
      ? (((ticketSubtotal - ticketCost) / ticketSubtotal) * 100).toFixed(1)
      : "0"

  const exportCSV = () => {
    const headers = `Name,Category,Price (${restaurant.currency}),COGS (${restaurant.currency}),Food Cost %,Orders Today,Status\n`
    const rows = menuItems
      .map(
        (m) =>
          `"${m.name}","${m.category}",${m.price},${m.cogs},${m.portionCostPercent}%,${m.ordersToday},"${m.available ? "Active" : "Sold Out"}"`
      )
      .join("\n")

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "bara_menu_items.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">
      {/* 1. Top Operations Bar matching Figma Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Menu &amp; POS Orders
            </h1>
            <Badge variant="accent" className="font-bold text-[10px]">
              {menuItems.length} Dishes &amp; Drinks
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select items to dispatch orders for {restaurant.name} ({restaurant.activeBranch}) or audit live recipe portion margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Table Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-2xs">
            {["Table 1", "Table 4", "Bar", "Takeaway"].map((tbl) => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                  selectedTable === tbl
                    ? "bg-[#C85A24] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tbl}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="h-8.5 text-xs rounded-xl gap-1.5 font-semibold"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="h-8.5 gap-1.5 rounded-xl bg-[#234D3A] text-white hover:bg-[#1A3B2C] text-xs font-bold px-3.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 2. Search & Category Filter Pills matching Figma */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 w-full rounded-xl border border-border bg-background pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Main Kitchen", "Bar & Cocktails", "Specials & Desserts"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                categoryFilter === cat
                  ? "bg-[#C85A24] text-white shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat === "All" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Grid: Left 3/4 Food Cards with Circular Photos + Right 1/4 Order Ticket Panel */}
      <div className="grid gap-5 lg:grid-cols-12 items-start">
        {/* Left Side: Dish Cards Grid (8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((dish) => (
              <Card
                key={dish.id}
                onClick={() => addToOrder(dish)}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-2xs transition-all cursor-pointer hover:shadow-md hover:border-[#C85A24]/40 active:scale-[0.99]",
                  !dish.available && "opacity-60 cursor-not-allowed"
                )}
              >
                <div>
                  {/* Circular Dish Image matching Figma */}
                  <div className="flex justify-center mb-3">
                    <div className="relative size-24 rounded-full overflow-hidden border-2 border-border shadow-xs group-hover:scale-105 transition-transform duration-200">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {!dish.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                          Sold Out
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1">
                      {dish.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1 text-[10px] font-medium py-0">
                      {dish.category}
                    </Badge>
                    <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Order Action Button */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-[#C85A24] dark:text-[#E07A3E]">
                      {formatCurrency(dish.price)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Cost: {dish.portionCostPercent}%
                    </p>
                  </div>

                  <Button
                    size="sm"
                    disabled={!dish.available}
                    className="size-7 p-0 rounded-full bg-[#C85A24] hover:bg-[#B34D1C] text-white shadow-2xs"
                    title="Add to Ticket"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                No menu items found. Try a different search term or category.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Order Ticket Panel (matching Figma Screen with Live Cart) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <Card className="rounded-2xl border-border bg-card shadow-md overflow-hidden">
            <CardHeader className="p-4 border-b border-border/60 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">
                      Active Ticket
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedTable} • Order #8822
                    </p>
                  </div>
                </div>

                {orderItems.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOrder}
                    className="h-7 text-[11px] text-muted-foreground hover:text-destructive px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Order Items List */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-border/50 pr-1">
                {orderItems.map((oi) => (
                  <div key={oi.item.id} className="py-2.5 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground truncate">{oi.item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatCurrency(oi.item.price)} each
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(oi.item.id, -1)}
                        className="flex size-6 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-foreground">
                        {oi.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(oi.item.id, 1)}
                        className="flex size-6 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <div className="text-right shrink-0 w-20">
                      <span className="font-bold text-foreground">
                        {formatCurrency(oi.item.price * oi.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

                {orderItems.length === 0 && (
                  <div className="py-10 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                    <ShoppingCart className="size-8 text-muted-foreground/40" />
                    <p>No dishes in ticket yet.</p>
                    <p className="text-[11px]">Click any dish card on the left to add.</p>
                  </div>
                )}
              </div>

              {/* Order Summary & Financials */}
              {orderItems.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(ticketSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT &amp; Service (18% incl.)</span>
                    <span>{formatCurrency(Math.round(ticketSubtotal * 0.18))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-extrabold text-foreground pt-1 border-t border-border/40">
                    <span>Total Amount</span>
                    <span className="text-[#C85A24] dark:text-[#E07A3E] text-base">
                      {formatCurrency(ticketSubtotal)}
                    </span>
                  </div>

                  {/* AI Margin indicator on this order */}
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3" />
                      Ticket Food Margin
                    </span>
                    <span>{ticketMarginPercent}% gross profit</span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full h-10 rounded-xl bg-[#C85A24] hover:bg-[#B34D1C] text-white font-bold text-xs shadow-md mt-2"
                  >
                    Confirm Order &amp; Send to Kitchen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Add Menu Item Modal using shadcn Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Create a dish or beverage recipe with price and portion food cost.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddItem} className="space-y-3.5 mt-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Dish / Item Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Honey Glazed Salmon"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as MenuItem["category"])}
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="Main Kitchen">Main Kitchen</option>
                <option value="Bar & Cocktails">Bar &amp; Cocktails</option>
                <option value="Specials & Desserts">Specials &amp; Desserts</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Selling Price ({restaurant.currency})
                </label>
                <input
                  type="number"
                  required
                  placeholder="9000"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Recipe COGS ({restaurant.currency})
                </label>
                <input
                  type="number"
                  required
                  placeholder="2700"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Description &amp; Recipe Notes</label>
              <textarea
                rows={2}
                placeholder="Key ingredients, spices, accompaniments..."
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="h-8 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8 text-xs rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold px-4"
              >
                Save Recipe
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
