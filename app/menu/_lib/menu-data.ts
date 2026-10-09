export interface RecipeIngredient {
  id: string
  name: string
  stockQuantity: string
  quantity: number
  unit: string
  costPerUnit: number
  lineCost: number
  wastePercent: number
}

export interface MenuItemWithRecipe {
  id: string
  name: string
  category: string
  price: number
  description: string
  image?: string
  available: boolean
  channels: {
    dineIn: boolean
    takeaway: boolean
    delivery: boolean
  }
  recipeStatus: "complete" | "in_progress" | "draft"
  lastSavedText: string
  ingredients: RecipeIngredient[]
}

export const INVENTORY_INGREDIENTS_LIBRARY = [
  { id: "ing-1", name: "Tilapia fillet", stock: "8.6 kg in stock", unit: "g", costPerUnit: 8, defaultWaste: 2 },
  { id: "ing-2", name: "Cooking oil", stock: "4.5 L in stock", unit: "ml", costPerUnit: 3.8, defaultWaste: 2 },
  { id: "ing-3", name: "Lemon", stock: "32 pcs in stock", unit: "pc", costPerUnit: 300, defaultWaste: 0 },
  { id: "ing-4", name: "Garlic", stock: "1.8 kg in stock", unit: "g", costPerUnit: 6, defaultWaste: 0 },
  { id: "ing-5", name: "Mixed vegetables", stock: "6.2 kg in stock", unit: "g", costPerUnit: 3, defaultWaste: 0 },
  { id: "ing-6", name: "House spice blend", stock: "720 g in stock", unit: "g", costPerUnit: 16, defaultWaste: 0 },
  { id: "ing-7", name: "Beef Tenderloin AAA", stock: "12.4 kg in stock", unit: "g", costPerUnit: 14, defaultWaste: 3 },
  { id: "ing-8", name: "Arborio Rice", stock: "15.0 kg in stock", unit: "g", costPerUnit: 5.5, defaultWaste: 0 },
  { id: "ing-9", name: "Wild Forest Mushrooms", stock: "3.2 kg in stock", unit: "g", costPerUnit: 12, defaultWaste: 1 },
  { id: "ing-10", name: "Parmesan Crisp", stock: "2.1 kg in stock", unit: "g", costPerUnit: 18, defaultWaste: 0 },
  { id: "ing-11", name: "Black Truffle Oil", stock: "1.2 L in stock", unit: "ml", costPerUnit: 25, defaultWaste: 0 },
  { id: "ing-12", name: "Jumbo Prawns", stock: "4.8 kg in stock", unit: "g", costPerUnit: 16, defaultWaste: 2 },
  { id: "ing-13", name: "White Wine Reduction", stock: "3.5 L in stock", unit: "ml", costPerUnit: 8, defaultWaste: 0 },
  { id: "ing-14", name: "Hibiscus Flowers Dried", stock: "1.5 kg in stock", unit: "g", costPerUnit: 9, defaultWaste: 0 },
  { id: "ing-15", name: "Fresh Mint Leaves", stock: "850 g in stock", unit: "g", costPerUnit: 4, defaultWaste: 5 },
  { id: "ing-16", name: "Prosecco Spumante", stock: "18 bottles in stock", unit: "ml", costPerUnit: 12, defaultWaste: 0 },
  { id: "ing-17", name: "Heavy Dairy Cream", stock: "5.0 L in stock", unit: "ml", costPerUnit: 4.5, defaultWaste: 1 },
  { id: "ing-18", name: "Butter Unsalted", stock: "6.4 kg in stock", unit: "g", costPerUnit: 9, defaultWaste: 0 },
]

export const INITIAL_MENU_ITEMS: MenuItemWithRecipe[] = [
  {
    id: "item-tilapia",
    name: "Grilled tilapia",
    category: "Main dishes",
    price: 12000,
    description: "Char-grilled tilapia, market vegetables and lemon.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 2 minutes ago",
    ingredients: [
      {
        id: "r-1",
        name: "Tilapia fillet",
        stockQuantity: "8.6 kg in stock",
        quantity: 280,
        unit: "g",
        costPerUnit: 8,
        lineCost: 2240,
        wastePercent: 2,
      },
      {
        id: "r-2",
        name: "Cooking oil",
        stockQuantity: "4.5 L in stock",
        quantity: 25,
        unit: "ml",
        costPerUnit: 3.8,
        lineCost: 95,
        wastePercent: 2,
      },
      {
        id: "r-3",
        name: "Lemon",
        stockQuantity: "32 pcs in stock",
        quantity: 0.5,
        unit: "pc",
        costPerUnit: 300,
        lineCost: 150,
        wastePercent: 0,
      },
      {
        id: "r-4",
        name: "Garlic",
        stockQuantity: "1.8 kg in stock",
        quantity: 8,
        unit: "g",
        costPerUnit: 6,
        lineCost: 48,
        wastePercent: 0,
      },
      {
        id: "r-5",
        name: "Mixed vegetables",
        stockQuantity: "6.2 kg in stock",
        quantity: 180,
        unit: "g",
        costPerUnit: 3,
        lineCost: 540,
        wastePercent: 0,
      },
      {
        id: "r-6",
        name: "House spice blend",
        stockQuantity: "720 g in stock",
        quantity: 12,
        unit: "g",
        costPerUnit: 16,
        lineCost: 192,
        wastePercent: 0,
      },
    ],
  },
  {
    id: "item-tenderloin",
    name: "Grilled Tenderloin AAA",
    category: "Main dishes",
    price: 15000,
    description: "Charcoal-grilled prime beef tenderloin with garlic herb butter and charred vegetables.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 15 minutes ago",
    ingredients: [
      {
        id: "r-7",
        name: "Beef Tenderloin AAA",
        stockQuantity: "12.4 kg in stock",
        quantity: 250,
        unit: "g",
        costPerUnit: 14,
        lineCost: 3500,
        wastePercent: 3,
      },
      {
        id: "r-8",
        name: "Butter Unsalted",
        stockQuantity: "6.4 kg in stock",
        quantity: 30,
        unit: "g",
        costPerUnit: 9,
        lineCost: 270,
        wastePercent: 0,
      },
      {
        id: "r-9",
        name: "Garlic",
        stockQuantity: "1.8 kg in stock",
        quantity: 10,
        unit: "g",
        costPerUnit: 6,
        lineCost: 60,
        wastePercent: 0,
      },
      {
        id: "r-10",
        name: "Mixed vegetables",
        stockQuantity: "6.2 kg in stock",
        quantity: 150,
        unit: "g",
        costPerUnit: 3,
        lineCost: 450,
        wastePercent: 0,
      },
    ],
  },
  {
    id: "item-risotto",
    name: "Mushroom Risotto with Truffle",
    category: "Main dishes",
    price: 11000,
    description: "Creamy arborio rice, wild forest mushrooms, aged parmesan crisp, black truffle oil.",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=400&auto=format&fit=crop&q=80",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 1 hour ago",
    ingredients: [
      {
        id: "r-11",
        name: "Arborio Rice",
        stockQuantity: "15.0 kg in stock",
        quantity: 180,
        unit: "g",
        costPerUnit: 5.5,
        lineCost: 990,
        wastePercent: 0,
      },
      {
        id: "r-12",
        name: "Wild Forest Mushrooms",
        stockQuantity: "3.2 kg in stock",
        quantity: 100,
        unit: "g",
        costPerUnit: 12,
        lineCost: 1200,
        wastePercent: 1,
      },
      {
        id: "r-13",
        name: "Black Truffle Oil",
        stockQuantity: "1.2 L in stock",
        quantity: 15,
        unit: "ml",
        costPerUnit: 25,
        lineCost: 375,
        wastePercent: 0,
      },
      {
        id: "r-14",
        name: "Parmesan Crisp",
        stockQuantity: "2.1 kg in stock",
        quantity: 25,
        unit: "g",
        costPerUnit: 18,
        lineCost: 450,
        wastePercent: 0,
      },
    ],
  },
  {
    id: "item-prawns",
    name: "Garlic Butter Prawns",
    category: "Starters",
    price: 9500,
    description: "Sautéed jumbo prawns in garlic emulsion, white wine reduction, and fresh parsley.",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=80",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved yesterday",
    ingredients: [
      {
        id: "r-15",
        name: "Jumbo Prawns",
        stockQuantity: "4.8 kg in stock",
        quantity: 180,
        unit: "g",
        costPerUnit: 16,
        lineCost: 2880,
        wastePercent: 2,
      },
      {
        id: "r-16",
        name: "White Wine Reduction",
        stockQuantity: "3.5 L in stock",
        quantity: 30,
        unit: "ml",
        costPerUnit: 8,
        lineCost: 240,
        wastePercent: 0,
      },
      {
        id: "r-17",
        name: "Butter Unsalted",
        stockQuantity: "6.4 kg in stock",
        quantity: 25,
        unit: "g",
        costPerUnit: 9,
        lineCost: 225,
        wastePercent: 0,
      },
    ],
  },
  {
    id: "item-spritz",
    name: "Hibiscus Citrus Spritz",
    category: "Bar & Drinks",
    price: 4500,
    description: "House-steeped organic hibiscus flower infusion, fresh lime, prosecco, and tonic.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&fit=crop&q=80",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 3 days ago",
    ingredients: [
      {
        id: "r-18",
        name: "Hibiscus Flowers Dried",
        stockQuantity: "1.5 kg in stock",
        quantity: 15,
        unit: "g",
        costPerUnit: 9,
        lineCost: 135,
        wastePercent: 0,
      },
      {
        id: "r-19",
        name: "Prosecco Spumante",
        stockQuantity: "18 bottles in stock",
        quantity: 60,
        unit: "ml",
        costPerUnit: 12,
        lineCost: 720,
        wastePercent: 0,
      },
      {
        id: "r-20",
        name: "Lemon",
        stockQuantity: "32 pcs in stock",
        quantity: 0.25,
        unit: "pc",
        costPerUnit: 300,
        lineCost: 75,
        wastePercent: 0,
      },
    ],
  },
]

export const MENU_CATEGORIES = [
  "Main dishes",
  "Starters",
  "Bar & Drinks",
  "Specials & Desserts",
  "Sides & Extras",
]
