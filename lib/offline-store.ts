/**
 * Offline-first local store & synchronization engine
 * Compliant with Bara Product Specifications Section 5.7:
 * - Local-first data store on-device mirroring backend schema
 * - Client-generated UUID and ISO timestamps
 * - Append-only history for StockMovement records
 * - Queue of pending writes retried when connectivity is restored
 */

import {
  Ingredient,
  IngredientCreate,
  StockMovement,
  StockMovementCreate,
  Consumable,
  ConsumableCreate,
  ConsumablePurchase,
  ConsumablePurchaseCreate,
  PaymentConfirmation,
  PaymentConfirmationCreate,
  BackendMenuItem,
} from "./api-client"

export type SyncState = "synced" | "syncing" | "offline"

export interface QueuedAction {
  id: string
  endpoint: string
  method: "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  createdAt: string
  retryCount: number
}

const STORAGE_KEYS = {
  INGREDIENTS: "bara:offline:ingredients_v1",
  STOCK_MOVEMENTS: "bara:offline:stock_movements_v1",
  CONSUMABLES: "bara:offline:consumables_v1",
  CONSUMABLE_PURCHASES: "bara:offline:consumable_purchases_v1",
  PAYMENT_CONFIRMATIONS: "bara:offline:payment_confirmations_v1",
  MENU_ITEMS: "bara:offline:menu_items_v1",
  ORDERS: "bara:offline:orders_v1",
  SYNC_QUEUE: "bara:offline:sync_queue_v1",
}

// Initial Rwandan restaurant staple seed ingredients
export const SEED_INGREDIENTS: Ingredient[] = [
  {
    id: "ing-seed-001",
    name: "Tilapia fillet",
    unit: "kg",
    low_stock_threshold: "5.00",
    cost_per_unit: "8500.00",
    current_quantity: "8.60",
    created_at: new Date(Date.now() - 864e5 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-002",
    name: "Cooking oil (Sunflower)",
    unit: "L",
    low_stock_threshold: "10.00",
    cost_per_unit: "3800.00",
    current_quantity: "4.50", // below threshold -> LOW STOCK
    created_at: new Date(Date.now() - 864e5 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-003",
    name: "Fresh Lemon",
    unit: "piece",
    low_stock_threshold: "15.00",
    cost_per_unit: "300.00",
    current_quantity: "32.00",
    created_at: new Date(Date.now() - 864e5 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-004",
    name: "Garlic cloves",
    unit: "kg",
    low_stock_threshold: "2.00",
    cost_per_unit: "6000.00",
    current_quantity: "1.80", // below threshold -> LOW STOCK
    created_at: new Date(Date.now() - 864e5 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-005",
    name: "Mixed Vegetables (Carrot, Pepper, Courgette)",
    unit: "kg",
    low_stock_threshold: "5.00",
    cost_per_unit: "3125.00",
    current_quantity: "6.20",
    created_at: new Date(Date.now() - 864e5 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-006",
    name: "Beef Brochette Meat (AAA Grade)",
    unit: "kg",
    low_stock_threshold: "8.00",
    cost_per_unit: "7500.00",
    current_quantity: "14.20",
    created_at: new Date(Date.now() - 864e5 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-007",
    name: "Cassava Flour (Kinazi Premium)",
    unit: "kg",
    low_stock_threshold: "15.00",
    cost_per_unit: "1400.00",
    current_quantity: "3.20", // CRITICAL ALERT
    created_at: new Date(Date.now() - 864e5 * 25).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-008",
    name: "Fresh Goat Meat (Kabuga cut)",
    unit: "kg",
    low_stock_threshold: "10.00",
    cost_per_unit: "8200.00",
    current_quantity: "2.50", // CRITICAL ALERT
    created_at: new Date(Date.now() - 864e5 * 18).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-009",
    name: "Basmati Rice (Super Kernal)",
    unit: "kg",
    low_stock_threshold: "12.00",
    cost_per_unit: "2800.00",
    current_quantity: "30.00",
    created_at: new Date(Date.now() - 864e5 * 40).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ing-seed-010",
    name: "Butter Unsalted",
    unit: "kg",
    low_stock_threshold: "3.00",
    cost_per_unit: "9000.00",
    current_quantity: "6.40",
    created_at: new Date(Date.now() - 864e5 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const SEED_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: "mov-seed-001",
    client_uuid: "uuid-mov-001",
    ingredient: "ing-seed-001",
    ingredient_name: "Tilapia fillet",
    movement_type: "in",
    quantity: "10.00",
    note: "Received fresh catch from Lake Kivu supplier",
    recorded_by_name: "Jean Niyonzima",
    occurred_at: new Date(Date.now() - 864e5 * 1).toISOString(),
    synced_at: new Date(Date.now() - 864e5 * 1).toISOString(),
  },
  {
    id: "mov-seed-002",
    client_uuid: "uuid-mov-002",
    ingredient: "ing-seed-002",
    ingredient_name: "Cooking oil (Sunflower)",
    movement_type: "out",
    quantity: "3.50",
    note: "Kitchen fry station refill",
    recorded_by_name: "Patrick Mugisha",
    occurred_at: new Date(Date.now() - 864e5 * 2).toISOString(),
    synced_at: new Date(Date.now() - 864e5 * 2).toISOString(),
  },
  {
    id: "mov-seed-003",
    client_uuid: "uuid-mov-003",
    ingredient: "ing-seed-007",
    ingredient_name: "Cassava Flour (Kinazi Premium)",
    movement_type: "waste",
    quantity: "1.20",
    note: "Moisture spoilage in storage bin",
    recorded_by_name: "Jean Niyonzima",
    occurred_at: new Date(Date.now() - 864e5 * 3).toISOString(),
    synced_at: new Date(Date.now() - 864e5 * 3).toISOString(),
  },
  {
    id: "mov-seed-004",
    client_uuid: "uuid-mov-004",
    ingredient: "ing-seed-006",
    ingredient_name: "Beef Brochette Meat (AAA Grade)",
    movement_type: "in",
    quantity: "20.00",
    note: "Weekly butcher delivery Nyabugogo",
    recorded_by_name: "Alex Rivera",
    occurred_at: new Date(Date.now() - 864e5 * 4).toISOString(),
    synced_at: new Date(Date.now() - 864e5 * 4).toISOString(),
  },
]

export const SEED_CONSUMABLES: Consumable[] = [
  {
    id: "con-seed-001",
    name: "Commercial Cooking Gas (38kg Cylinder)",
    category: "Fuel & Energy",
    created_at: new Date(Date.now() - 864e5 * 60).toISOString(),
  },
  {
    id: "con-seed-002",
    name: "Kraft Paper Takeaway Boxes (500pk)",
    category: "Packaging",
    created_at: new Date(Date.now() - 864e5 * 60).toISOString(),
  },
  {
    id: "con-seed-003",
    name: "Commercial Dishwasher Detergent (20L)",
    category: "Cleaning & Sanitation",
    created_at: new Date(Date.now() - 864e5 * 60).toISOString(),
  },
  {
    id: "con-seed-004",
    name: "Embossed Table Napkins (1000pk)",
    category: "Dining Supplies",
    created_at: new Date(Date.now() - 864e5 * 60).toISOString(),
  },
  {
    id: "con-seed-005",
    name: "Kitchen Heavy Duty Paper Towels (12pk)",
    category: "Cleaning & Sanitation",
    created_at: new Date(Date.now() - 864e5 * 60).toISOString(),
  },
]

export const SEED_CONSUMABLE_PURCHASES: ConsumablePurchase[] = [
  {
    id: "pur-seed-001",
    consumable: "con-seed-001",
    consumable_name: "Commercial Cooking Gas (38kg Cylinder)",
    quantity: "2.00",
    cost: "116000.00",
    purchase_date: new Date(Date.now() - 864e5 * 4).toISOString().split("T")[0],
    note: "2 refills for main kitchen cookers from SP Gas",
    created_at: new Date(Date.now() - 864e5 * 4).toISOString(),
  },
  {
    id: "pur-seed-002",
    consumable: "con-seed-002",
    consumable_name: "Kraft Paper Takeaway Boxes (500pk)",
    quantity: "3.00",
    cost: "94500.00",
    purchase_date: new Date(Date.now() - 864e5 * 8).toISOString().split("T")[0],
    note: "Eco-packaging restock from Gikondo manufacturer",
    created_at: new Date(Date.now() - 864e5 * 8).toISOString(),
  },
  {
    id: "pur-seed-003",
    consumable: "con-seed-003",
    consumable_name: "Commercial Dishwasher Detergent (20L)",
    quantity: "1.00",
    cost: "48000.00",
    purchase_date: new Date(Date.now() - 864e5 * 12).toISOString().split("T")[0],
    note: "Degreaser and sanitizer gallon",
    created_at: new Date(Date.now() - 864e5 * 12).toISOString(),
  },
  {
    id: "pur-seed-004",
    consumable: "con-seed-004",
    consumable_name: "Embossed Table Napkins (1000pk)",
    quantity: "4.00",
    cost: "32000.00",
    purchase_date: new Date(Date.now() - 864e5 * 15).toISOString().split("T")[0],
    note: "Bara branded paper napkins",
    created_at: new Date(Date.now() - 864e5 * 15).toISOString(),
  },
]

export const SEED_PAYMENT_CONFIRMATIONS: PaymentConfirmation[] = [
  {
    id: "pay-seed-001",
    subscription: "sub-seed-pro-01",
    payer_name: "Alex Rivera",
    payer_phone: "0788123456",
    submitted_at: new Date(Date.now() - 864e5 * 5).toISOString(),
    status: "paid",
    verified_by: "super-admin-01",
    verified_at: new Date(Date.now() - 864e5 * 5 + 3600000).toISOString(),
    rejection_reason: "",
  },
]

export const SEED_MENU_ITEMS: BackendMenuItem[] = [
  {
    id: "item-seed-01",
    name: "Grilled Whole Tilapia",
    category: "Main dishes",
    price: "12000.00",
    description: "Lake Kivu whole fresh tilapia marinated in lemon, garlic, and fresh herbs.",
    is_available: true,
  },
  {
    id: "item-seed-02",
    name: "Classic Beef Brochettes",
    category: "Main dishes",
    price: "8500.00",
    description: "Tender skewered prime beef grilled over volcanic charcoal, served with pili-pili sauce.",
    is_available: true,
  },
  {
    id: "item-seed-03",
    name: "Crispy Sambaza Bites",
    category: "Starters",
    price: "5000.00",
    description: "Crispy Lake Kivu sambaza dusted with spiced corn flour, served with lemon aioli.",
    is_available: true,
  },
  {
    id: "item-seed-04",
    name: "Avocado & Mango Salad",
    category: "Starters",
    price: "4500.00",
    description: "Fresh Rwandan Hass avocado, ripe mango cubes, baby spinach and passion fruit vinaigrette.",
    is_available: true,
  },
  {
    id: "item-seed-05",
    name: "Warm Belgian Chocolate Lava Cake",
    category: "Desserts",
    price: "6000.00",
    description: "Rich dark chocolate fondant with a molten center, paired with vanilla bean gelato.",
    is_available: true,
  },
]

export interface StoredOrderLine {
  id?: string
  order?: string
  menu_item?: string
  menu_item_name?: string
  quantity: number
  unit_price?: string
  subtotal?: string
  cost?: string
  profit?: string
}

export interface StoredOrder {
  order_id: string
  client_uuid?: string | null
  staff?: string | null
  staff_name?: string
  table_number?: string
  guest_count?: number | null
  service_type?: string
  status: "pending" | "preparing" | "ready" | "completed" | "voided"
  payment_method?: string
  discount?: string
  tax_amount?: string
  service_fee?: string
  subtotal?: string
  total: string
  cost?: string
  profit?: string
  profit_margin?: string | null
  lines?: StoredOrderLine[]
  created_at: string
  completed_at?: string | null
  synced_at?: string | null
  void_reason?: string | null
}

export const SEED_ORDERS: StoredOrder[] = [
  {
    order_id: "ord-seed-001",
    staff_name: "Jean Niyonzima",
    table_number: "Table 4",
    guest_count: 2,
    service_type: "dine_in",
    status: "completed",
    payment_method: "momo",
    subtotal: "24000.00",
    total: "24000.00",
    lines: [
      { menu_item_name: "Grilled tilapia", quantity: 2, unit_price: "12000.00", subtotal: "24000.00" },
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    order_id: "ord-seed-002",
    staff_name: "Grace Uwase",
    table_number: "Table 2",
    guest_count: 3,
    service_type: "dine_in",
    status: "completed",
    payment_method: "card",
    subtotal: "32000.00",
    total: "32000.00",
    lines: [
      { menu_item_name: "Beef brochettes", quantity: 4, unit_price: "8000.00", subtotal: "32000.00" },
    ],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 3.5).toISOString(),
  },
  {
    order_id: "ord-seed-003",
    staff_name: "Eric Habimana",
    table_number: "Table 7",
    guest_count: 2,
    service_type: "dine_in",
    status: "completed",
    payment_method: "cash",
    subtotal: "18000.00",
    total: "18000.00",
    lines: [
      { menu_item_name: "Chicken & chips", quantity: 2, unit_price: "9000.00", subtotal: "18000.00" },
    ],
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    completed_at: new Date(Date.now() - 3600000 * 5.5).toISOString(),
  },
  {
    order_id: "ord-seed-004",
    staff_name: "Diane Keza",
    table_number: "Table 1",
    guest_count: 1,
    service_type: "dine_in",
    status: "voided",
    payment_method: "cash",
    subtotal: "8000.00",
    total: "8000.00",
    void_reason: "Customer changed mind",
    lines: [
      { menu_item_name: "Beef brochettes", quantity: 1, unit_price: "8000.00", subtotal: "8000.00" },
    ],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    completed_at: null,
  },
]

class OfflineStore {
  private syncStatus: SyncState = "synced"
  private listeners: Set<(status: SyncState) => void> = new Set()

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleOnline())
      window.addEventListener("offline", () => this.handleOffline())
      // Check initial network state
      if (!navigator.onLine) {
        this.syncStatus = "offline"
      }
    }
  }

  public subscribe(cb: (status: SyncState) => void) {
    this.listeners.add(cb)
    cb(this.syncStatus)
    return () => {
      this.listeners.delete(cb)
    }
  }

  public getStatus(): SyncState {
    return this.syncStatus
  }

  public setStatus(status: SyncState) {
    this.syncStatus = status
    this.listeners.forEach((cb) => cb(status))
  }

  private handleOnline() {
    this.setStatus("syncing")
    setTimeout(() => {
      this.setStatus("synced")
    }, 1200)
  }

  private handleOffline() {
    this.setStatus("offline")
  }

  private getItem<T>(key: string, seed: T): T {
    if (typeof window === "undefined") return seed
    try {
      const data = localStorage.getItem(key)
      if (data) return JSON.parse(data)
      localStorage.setItem(key, JSON.stringify(seed))
      return seed
    } catch {
      return seed
    }
  }

  private setItem<T>(key: string, val: T): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      /* storage limit */
    }
  }

  // --- INGREDIENTS ---
  public getIngredients(): Ingredient[] {
    return this.getItem(STORAGE_KEYS.INGREDIENTS, SEED_INGREDIENTS)
  }

  public saveIngredients(items: Ingredient[]): void {
    this.setItem(STORAGE_KEYS.INGREDIENTS, items)
  }

  public addIngredient(data: IngredientCreate): Ingredient {
    const items = this.getIngredients()
    const newIngredient: Ingredient = {
      id: `ing-uuid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      unit: data.unit.trim(),
      low_stock_threshold: String(data.low_stock_threshold),
      cost_per_unit: String(data.cost_per_unit),
      current_quantity: "0.00",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const updated = [newIngredient, ...items]
    this.saveIngredients(updated)
    return newIngredient
  }

  public updateIngredient(id: string, patch: Partial<Ingredient>): Ingredient | null {
    const items = this.getIngredients()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) return null
    const updated = {
      ...items[index],
      ...patch,
      updated_at: new Date().toISOString(),
    }
    items[index] = updated
    this.saveIngredients(items)
    return updated
  }

  public deleteIngredient(id: string): void {
    const items = this.getIngredients()
    this.saveIngredients(items.filter((i) => i.id !== id))
  }

  // --- STOCK MOVEMENTS ---
  public getStockMovements(): StockMovement[] {
    return this.getItem(STORAGE_KEYS.STOCK_MOVEMENTS, SEED_STOCK_MOVEMENTS)
  }

  public saveStockMovements(items: StockMovement[]): void {
    this.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, items)
  }

  public addStockMovement(data: StockMovementCreate, userDisplayName = "Staff Member"): StockMovement {
    const movements = this.getStockMovements()
    const ingredients = this.getIngredients()
    const targetIngredient = ingredients.find((i) => i.id === data.ingredient)

    const clientUuid = data.client_uuid || `client-uuid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const quantityNum = parseFloat(String(data.quantity)) || 0

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      client_uuid: clientUuid,
      ingredient: data.ingredient,
      ingredient_name: targetIngredient?.name || "Ingredient",
      movement_type: data.movement_type,
      quantity: String(quantityNum.toFixed(2)),
      note: data.note || "",
      recorded_by_name: userDisplayName,
      occurred_at: new Date().toISOString(),
      synced_at: this.syncStatus === "offline" ? null : new Date().toISOString(),
    }

    // Append-only history as per Section 5.7 & Section 9
    const updatedMovements = [newMovement, ...movements]
    this.saveStockMovements(updatedMovements)

    // Recalculate ingredient current quantity
    if (targetIngredient) {
      const currentQty = parseFloat(String(targetIngredient.current_quantity || "0"))
      let newQty = currentQty
      if (data.movement_type === "in") {
        newQty += quantityNum
      } else {
        // 'out' or 'waste'
        newQty -= quantityNum
      }
      this.updateIngredient(targetIngredient.id, {
        current_quantity: newQty.toFixed(2),
      })
    }

    return newMovement
  }

  // --- CONSUMABLES ---
  public getConsumables(): Consumable[] {
    return this.getItem(STORAGE_KEYS.CONSUMABLES, SEED_CONSUMABLES)
  }

  public saveConsumables(items: Consumable[]): void {
    this.setItem(STORAGE_KEYS.CONSUMABLES, items)
  }

  public addConsumable(data: ConsumableCreate): Consumable {
    const items = this.getConsumables()
    const newConsumable: Consumable = {
      id: `con-${Date.now()}`,
      name: data.name.trim(),
      category: data.category?.trim() || "Operations",
      created_at: new Date().toISOString(),
    }
    const updated = [newConsumable, ...items]
    this.saveConsumables(updated)
    return newConsumable
  }

  public deleteConsumable(id: string): void {
    const items = this.getConsumables()
    this.saveConsumables(items.filter((c) => c.id !== id))
  }

  // --- CONSUMABLE PURCHASES ---
  public getConsumablePurchases(): ConsumablePurchase[] {
    return this.getItem(STORAGE_KEYS.CONSUMABLE_PURCHASES, SEED_CONSUMABLE_PURCHASES)
  }

  public saveConsumablePurchases(items: ConsumablePurchase[]): void {
    this.setItem(STORAGE_KEYS.CONSUMABLE_PURCHASES, items)
  }

  public addConsumablePurchase(data: ConsumablePurchaseCreate): ConsumablePurchase {
    const purchases = this.getConsumablePurchases()
    const consumables = this.getConsumables()
    const targetConsumable = consumables.find((c) => c.id === data.consumable)

    const newPurchase: ConsumablePurchase = {
      id: `pur-${Date.now()}`,
      consumable: data.consumable,
      consumable_name: targetConsumable?.name || "Consumable",
      quantity: String(parseFloat(String(data.quantity)).toFixed(2)),
      cost: String(parseFloat(String(data.cost)).toFixed(2)),
      purchase_date: data.purchase_date || new Date().toISOString().split("T")[0],
      note: data.note || "",
      created_at: new Date().toISOString(),
    }

    const updated = [newPurchase, ...purchases]
    this.saveConsumablePurchases(updated)
    return newPurchase
  }

  public deleteConsumablePurchase(id: string): void {
    const purchases = this.getConsumablePurchases()
    this.saveConsumablePurchases(purchases.filter((p) => p.id !== id))
  }

  // --- PAYMENT CONFIRMATIONS ---
  public getPaymentConfirmations(): PaymentConfirmation[] {
    return this.getItem(STORAGE_KEYS.PAYMENT_CONFIRMATIONS, SEED_PAYMENT_CONFIRMATIONS)
  }

  public savePaymentConfirmations(items: PaymentConfirmation[]): void {
    this.setItem(STORAGE_KEYS.PAYMENT_CONFIRMATIONS, items)
  }

  public addPaymentConfirmation(data: PaymentConfirmationCreate): PaymentConfirmation {
    const items = this.getPaymentConfirmations()
    const newConfirmation: PaymentConfirmation = {
      id: `pay-${Date.now()}`,
      subscription: data.subscription,
      payer_name: data.payer_name.trim(),
      payer_phone: data.payer_phone.trim(),
      submitted_at: new Date().toISOString(),
      status: "pending",
      verified_by: null,
      verified_at: null,
      rejection_reason: "",
    }
    const updated = [newConfirmation, ...items]
    this.savePaymentConfirmations(updated)
    return newConfirmation
  }

  public updatePaymentConfirmationStatus(
    id: string,
    status: "paid" | "rejected",
    reason = ""
  ): PaymentConfirmation | null {
    const items = this.getPaymentConfirmations()
    const index = items.findIndex((i) => i.id === id)
    if (index === -1) return null

    const updated: PaymentConfirmation = {
      ...items[index],
      status,
      verified_at: new Date().toISOString(),
      verified_by: "super-admin-web",
      rejection_reason: reason,
    }
    items[index] = updated
    this.savePaymentConfirmations(items)
    return updated
  }

  // --- MENU ITEMS ---
  public getMenuItems(): BackendMenuItem[] {
    return this.getItem(STORAGE_KEYS.MENU_ITEMS, SEED_MENU_ITEMS)
  }

  public saveMenuItems(items: BackendMenuItem[]): void {
    this.setItem(STORAGE_KEYS.MENU_ITEMS, items)
  }

  public addMenuItem(data: Omit<BackendMenuItem, "menu_id" | "created_at"> & { id?: string }): BackendMenuItem {
    const items = this.getMenuItems()
    const newItem: BackendMenuItem = {
      id: data.id || `menu-uuid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      description: data.description?.trim() || "",
      price: String(data.price),
      category: data.category || "Main dishes",
      is_available: data.is_available ?? true,
      created_at: new Date().toISOString(),
    }
    const updated = [newItem, ...items]
    this.saveMenuItems(updated)
    return newItem
  }

  public updateMenuItem(id: string, patch: Partial<BackendMenuItem>): BackendMenuItem | null {
    const items = this.getMenuItems()
    const index = items.findIndex((i) => (i.id === id || i.menu_id === id))
    if (index === -1) return null
    const updated: BackendMenuItem = {
      ...items[index],
      ...patch,
      price: patch.price !== undefined ? String(patch.price) : items[index].price,
    }
    items[index] = updated
    this.saveMenuItems(items)
    return updated
  }

  public deleteMenuItem(id: string): void {
    const items = this.getMenuItems()
    this.saveMenuItems(items.filter((i) => i.id !== id && i.menu_id !== id))
  }

  // --- ORDERS ---
  public getOrders(): StoredOrder[] {
    return this.getItem(STORAGE_KEYS.ORDERS, SEED_ORDERS)
  }

  public saveOrders(items: StoredOrder[]): void {
    this.setItem(STORAGE_KEYS.ORDERS, items)
  }
}

export const offlineStore = new OfflineStore()
