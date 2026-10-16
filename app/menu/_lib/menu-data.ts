export interface RecipeIngredient {
  id: string
  ingredientId?: string
  name: string
  stockQuantity: string
  quantity: number
  unit: string
  costPerUnit: number
  lineCost: number
  wastePercent: number
}

export type FoodIconType = "fish" | "beef" | "chicken" | "steak" | "veggie" | "salad" | "dessert"

export interface MenuItemWithRecipe {
  id: string
  name: string
  category: "Main dishes" | "Starters" | "Desserts" | string
  price: number
  description: string
  image?: string
  iconType?: FoodIconType
  available: boolean
  channels: {
    dineIn: boolean
    takeaway: boolean
    delivery: boolean
  }
  recipeStatus: "complete" | "in_progress" | "draft"
  lastSavedText: string
  ingredients: RecipeIngredient[]
  availableServings?: number | string
  costPerServing?: number
  grossProfit?: number
  foodCostPercent?: number
  targetFoodCostPercent?: number
}

export const INVENTORY_INGREDIENTS_LIBRARY = [
  { id: "ing-1", name: "Tilapia fillet", stock: "8.6 kg in stock", unit: "g", costPerUnit: 10, defaultWaste: 2 },
  { id: "ing-2", name: "Cooking oil", stock: "4.5 L in stock", unit: "ml", costPerUnit: 3.8, defaultWaste: 2 },
  { id: "ing-3", name: "Lemon", stock: "32 pcs in stock", unit: "pc", costPerUnit: 300, defaultWaste: 0 },
  { id: "ing-4", name: "Garlic", stock: "1.8 kg in stock", unit: "g", costPerUnit: 6, defaultWaste: 0 },
  { id: "ing-5", name: "Mixed vegetables", stock: "6.2 kg in stock", unit: "g", costPerUnit: 3, defaultWaste: 0 },
  { id: "ing-6", name: "House spice blend", stock: "720 g in stock", unit: "g", costPerUnit: 16, defaultWaste: 0 },
  { id: "ing-7", name: "Beef Brochette Meat", stock: "14.2 kg in stock", unit: "g", costPerUnit: 12, defaultWaste: 3 },
  { id: "ing-8", name: "Chicken Thigh Fillet", stock: "10.0 kg in stock", unit: "g", costPerUnit: 9, defaultWaste: 2 },
  { id: "ing-9", name: "Potato Hand Cut", stock: "25.0 kg in stock", unit: "g", costPerUnit: 1.5, defaultWaste: 5 },
  { id: "ing-10", name: "Prime Beef Tenderloin AAA", stock: "12.4 kg in stock", unit: "g", costPerUnit: 18, defaultWaste: 3 },
  { id: "ing-11", name: "Coconut Milk & Spices", stock: "6.0 L in stock", unit: "ml", costPerUnit: 4, defaultWaste: 0 },
  { id: "ing-12", name: "Butter Unsalted", stock: "6.4 kg in stock", unit: "g", costPerUnit: 9, defaultWaste: 0 },
  { id: "ing-13", name: "Onions & Peppers", stock: "18.0 kg in stock", unit: "g", costPerUnit: 2, defaultWaste: 2 },
  { id: "ing-14", name: "Basmati Rice", stock: "30.0 kg in stock", unit: "g", costPerUnit: 2.5, defaultWaste: 0 },
  { id: "ing-15", name: "Dark Belgian Chocolate", stock: "4.5 kg in stock", unit: "g", costPerUnit: 15, defaultWaste: 0 },
  { id: "ing-16", name: "Heavy Cream", stock: "5.0 L in stock", unit: "ml", costPerUnit: 4.5, defaultWaste: 1 },
]

export const MENU_CATEGORIES = [
  "Main dishes",
  "Starters",
  "Desserts",
]

export const INITIAL_MENU_ITEMS: MenuItemWithRecipe[] = [
  // 1. Grilled tilapia (Main dishes)
  {
    id: "item-tilapia",
    name: "Grilled tilapia",
    category: "Main dishes",
    price: 12000,
    description: "Char-grilled fresh tilapia, seasonal market vegetables, lemon herb butter.",
    iconType: "fish",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 2 minutes ago",
    ingredients: [
      { id: "t-1", name: "Tilapia fillet", stockQuantity: "8.6 kg in stock", quantity: 300, unit: "g", costPerUnit: 10, lineCost: 3000, wastePercent: 2 },
      { id: "t-2", name: "Cooking oil", stockQuantity: "4.5 L in stock", quantity: 25, unit: "ml", costPerUnit: 3.8, lineCost: 95, wastePercent: 2 },
      { id: "t-3", name: "Lemon", stockQuantity: "32 pcs in stock", quantity: 0.5, unit: "pc", costPerUnit: 300, lineCost: 150, wastePercent: 0 },
      { id: "t-4", name: "Garlic", stockQuantity: "1.8 kg in stock", quantity: 8, unit: "g", costPerUnit: 6, lineCost: 48, wastePercent: 0 },
      { id: "t-5", name: "Mixed vegetables", stockQuantity: "6.2 kg in stock", quantity: 160, unit: "g", costPerUnit: 3.125, lineCost: 500, wastePercent: 0 },
      { id: "t-6", name: "House spice blend", stockQuantity: "720 g in stock", quantity: 12, unit: "g", costPerUnit: 16, lineCost: 192, wastePercent: 0 },
    ],
  },

  // 2. Beef brochettes (Main dishes)
  {
    id: "item-beef-brochettes",
    name: "Beef brochettes",
    category: "Main dishes",
    price: 8000,
    description: "Tender beef cubes marinated with pili pili spices and grilled over acacia charcoal.",
    iconType: "beef",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 1 hour ago",
    ingredients: [
      { id: "b-1", name: "Beef Brochette Meat", stockQuantity: "14.2 kg in stock", quantity: 160, unit: "g", costPerUnit: 12, lineCost: 1920, wastePercent: 3 },
      { id: "b-2", name: "Onions & Peppers", stockQuantity: "18.0 kg in stock", quantity: 60, unit: "g", costPerUnit: 2, lineCost: 120, wastePercent: 2 },
      { id: "b-3", name: "Cooking oil", stockQuantity: "4.5 L in stock", quantity: 15, unit: "ml", costPerUnit: 3.8, lineCost: 60, wastePercent: 0 },
      { id: "b-4", name: "House spice blend", stockQuantity: "720 g in stock", quantity: 10, unit: "g", costPerUnit: 16, lineCost: 160, wastePercent: 0 },
      { id: "b-5", name: "Garlic", stockQuantity: "1.8 kg in stock", quantity: 23, unit: "g", costPerUnit: 6, lineCost: 140, wastePercent: 0 },
    ],
  },

  // 3. Chicken & chips (Main dishes)
  {
    id: "item-chicken-chips",
    name: "Chicken & chips",
    category: "Main dishes",
    price: 9000,
    description: "Golden fried seasoned chicken thigh cuts served with crunchy hand-cut potato chips.",
    iconType: "chicken",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 3 hours ago",
    ingredients: [
      { id: "c-1", name: "Chicken Thigh Fillet", stockQuantity: "10.0 kg in stock", quantity: 220, unit: "g", costPerUnit: 8.5, lineCost: 1870, wastePercent: 2 },
      { id: "c-2", name: "Potato Hand Cut", stockQuantity: "25.0 kg in stock", quantity: 250, unit: "g", costPerUnit: 1.5, lineCost: 375, wastePercent: 5 },
      { id: "c-3", name: "Frying oil", stockQuantity: "12.0 L in stock", quantity: 50, unit: "ml", costPerUnit: 3.8, lineCost: 190, wastePercent: 0 },
      { id: "c-4", name: "Chicken seasoning", stockQuantity: "1.5 kg in stock", quantity: 10, unit: "g", costPerUnit: 12, lineCost: 120, wastePercent: 0 },
      { id: "c-5", name: "Garlic dip", stockQuantity: "2.0 kg in stock", quantity: 30, unit: "g", costPerUnit: 5, lineCost: 150, wastePercent: 0 },
      { id: "c-6", name: "Coleslaw garnish", stockQuantity: "3.5 kg in stock", quantity: 40, unit: "g", costPerUnit: 2.25, lineCost: 90, wastePercent: 0 },
      { id: "c-7", name: "Lemon wedge", stockQuantity: "32 pcs in stock", quantity: 0.25, unit: "pc", costPerUnit: 340, lineCost: 85, wastePercent: 0 },
    ],
  },

  // 4. Beef tenderloin (Main dishes, Unavailable)
  {
    id: "item-beef-tenderloin",
    name: "Beef tenderloin",
    category: "Main dishes",
    price: 14000,
    description: "Center-cut prime beef tenderloin medallion, pan-seared garlic butter, roasted vegetables.",
    iconType: "steak",
    available: false,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved yesterday",
    ingredients: [
      { id: "bt-1", name: "Prime Beef Tenderloin AAA", stockQuantity: "12.4 kg in stock", quantity: 220, unit: "g", costPerUnit: 17, lineCost: 3740, wastePercent: 3 },
      { id: "bt-2", name: "Butter Unsalted", stockQuantity: "6.4 kg in stock", quantity: 35, unit: "g", costPerUnit: 9, lineCost: 315, wastePercent: 0 },
      { id: "bt-3", name: "Garlic", stockQuantity: "1.8 kg in stock", quantity: 12, unit: "g", costPerUnit: 6, lineCost: 72, wastePercent: 0 },
      { id: "bt-4", name: "Mixed vegetables", stockQuantity: "6.2 kg in stock", quantity: 120, unit: "g", costPerUnit: 3, lineCost: 360, wastePercent: 0 },
      { id: "bt-5", name: "Rosemary sprig", stockQuantity: "500 g in stock", quantity: 5, unit: "g", costPerUnit: 18, lineCost: 90, wastePercent: 0 },
      { id: "bt-6", name: "Black pepper cracked", stockQuantity: "800 g in stock", quantity: 8, unit: "g", costPerUnit: 22.875, lineCost: 183, wastePercent: 0 },
    ],
  },

  // 5. Vegetable curry (Main dishes)
  {
    id: "item-veg-curry",
    name: "Vegetable curry",
    category: "Main dishes",
    price: 6000,
    description: "Creamy coconut and yellow curry stew simmered with seasonal veggies, served with rice.",
    iconType: "veggie",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 4 hours ago",
    ingredients: [
      { id: "vc-1", name: "Mixed vegetables", stockQuantity: "6.2 kg in stock", quantity: 180, unit: "g", costPerUnit: 3, lineCost: 540, wastePercent: 0 },
      { id: "vc-2", name: "Coconut Milk & Spices", stockQuantity: "6.0 L in stock", quantity: 90, unit: "ml", costPerUnit: 4, lineCost: 360, wastePercent: 0 },
      { id: "vc-3", name: "Basmati Rice", stockQuantity: "30.0 kg in stock", quantity: 150, unit: "g", costPerUnit: 2.5, lineCost: 375, wastePercent: 0 },
      { id: "vc-4", name: "Cooking oil", stockQuantity: "4.5 L in stock", quantity: 15, unit: "ml", costPerUnit: 3.8, lineCost: 57, wastePercent: 0 },
      { id: "vc-5", name: "Curry powder blend", stockQuantity: "1.2 kg in stock", quantity: 12, unit: "g", costPerUnit: 12, lineCost: 144, wastePercent: 0 },
      { id: "vc-6", name: "Onions & Peppers", stockQuantity: "18.0 kg in stock", quantity: 40, unit: "g", costPerUnit: 2, lineCost: 80, wastePercent: 0 },
      { id: "vc-7", name: "Garlic & Ginger paste", stockQuantity: "1.5 kg in stock", quantity: 10, unit: "g", costPerUnit: 7, lineCost: 70, wastePercent: 0 },
      { id: "vc-8", name: "Fresh coriander", stockQuantity: "400 g in stock", quantity: 6, unit: "g", costPerUnit: 9, lineCost: 54, wastePercent: 0 },
    ],
  },

  // 6. Garden salad (Starters, Recipe Needed)
  {
    id: "item-garden-salad",
    name: "Garden salad",
    category: "Starters",
    price: 4000,
    description: "Crisp local greens, vine ripe tomatoes, cucumber ribbons, and tangy house dressing.",
    iconType: "salad",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "draft",
    lastSavedText: "No recipe configured yet",
    ingredients: [],
  },

  // 7. Pork chops grilled (Main dishes - Page 2)
  {
    id: "item-pork-chops",
    name: "Grilled pork chops",
    category: "Main dishes",
    price: 10000,
    description: "Honey-mustard glazed bone-in pork chops served with seasoned roasted potatoes.",
    iconType: "steak",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 2 days ago",
    ingredients: [
      { id: "pc-1", name: "Bone-in pork chops", stockQuantity: "8.5 kg in stock", quantity: 240, unit: "g", costPerUnit: 9.5, lineCost: 2280, wastePercent: 3 },
      { id: "pc-2", name: "Potato Hand Cut", stockQuantity: "25.0 kg in stock", quantity: 200, unit: "g", costPerUnit: 1.5, lineCost: 300, wastePercent: 2 },
      { id: "pc-3", name: "Honey mustard glaze", stockQuantity: "2.4 kg in stock", quantity: 30, unit: "g", costPerUnit: 11, lineCost: 330, wastePercent: 0 },
      { id: "pc-4", name: "Cooking oil", stockQuantity: "4.5 L in stock", quantity: 15, unit: "ml", costPerUnit: 3.8, lineCost: 57, wastePercent: 0 },
      { id: "pc-5", name: "House spices", stockQuantity: "720 g in stock", quantity: 8, unit: "g", costPerUnit: 16.625, lineCost: 133, wastePercent: 0 },
    ],
  },

  // 8. Sambaza lake fritters (Starters - Page 2)
  {
    id: "item-sambaza",
    name: "Lake Kivu sambaza fritters",
    category: "Starters",
    price: 5500,
    description: "Crispy battered Lake Kivu small fish served with spicy peri-peri mayo and lime.",
    iconType: "fish",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 1 day ago",
    ingredients: [
      { id: "sz-1", name: "Fresh Sambaza", stockQuantity: "6.2 kg in stock", quantity: 180, unit: "g", costPerUnit: 6.5, lineCost: 1170, wastePercent: 2 },
      { id: "sz-2", name: "Seasoned flour batter", stockQuantity: "5.0 kg in stock", quantity: 60, unit: "g", costPerUnit: 3.5, lineCost: 210, wastePercent: 0 },
      { id: "sz-3", name: "Peri-peri mayo", stockQuantity: "1.8 kg in stock", quantity: 30, unit: "g", costPerUnit: 6.5, lineCost: 195, wastePercent: 0 },
      { id: "sz-4", name: "Lime wedge", stockQuantity: "24 pcs in stock", quantity: 0.25, unit: "pc", costPerUnit: 300, lineCost: 75, wastePercent: 0 },
    ],
  },

  // 9. Garlic butter prawns (Starters - Page 2)
  {
    id: "item-prawns",
    name: "Garlic butter prawns",
    category: "Starters",
    price: 9500,
    description: "Sautéed jumbo prawns in garlic emulsion, white wine reduction, and fresh parsley.",
    iconType: "fish",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved yesterday",
    ingredients: [
      { id: "pw-1", name: "Jumbo Prawns", stockQuantity: "4.8 kg in stock", quantity: 160, unit: "g", costPerUnit: 14, lineCost: 2240, wastePercent: 2 },
      { id: "pw-2", name: "Butter Unsalted", stockQuantity: "6.4 kg in stock", quantity: 30, unit: "g", costPerUnit: 9, lineCost: 270, wastePercent: 0 },
      { id: "pw-3", name: "Garlic", stockQuantity: "1.8 kg in stock", quantity: 15, unit: "g", costPerUnit: 6, lineCost: 90, wastePercent: 0 },
      { id: "pw-4", name: "Parsley fresh", stockQuantity: "450 g in stock", quantity: 10, unit: "g", costPerUnit: 8, lineCost: 80, wastePercent: 0 },
      { id: "pw-5", name: "Lemon", stockQuantity: "32 pcs in stock", quantity: 0.5, unit: "pc", costPerUnit: 300, lineCost: 150, wastePercent: 0 },
    ],
  },

  // 10. Chocolate lava cake (Desserts - Page 2)
  {
    id: "item-choco-cake",
    name: "Warm chocolate lava cake",
    category: "Desserts",
    price: 6500,
    description: "Rich dark Belgian chocolate cake with molten heart, served with vanilla bean cream.",
    iconType: "dessert",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 3 days ago",
    ingredients: [
      { id: "cc-1", name: "Dark Belgian Chocolate", stockQuantity: "4.5 kg in stock", quantity: 70, unit: "g", costPerUnit: 15, lineCost: 1050, wastePercent: 0 },
      { id: "cc-2", name: "Butter Unsalted", stockQuantity: "6.4 kg in stock", quantity: 40, unit: "g", costPerUnit: 9, lineCost: 360, wastePercent: 0 },
      { id: "cc-3", name: "Heavy Cream", stockQuantity: "5.0 L in stock", quantity: 50, unit: "ml", costPerUnit: 4.5, lineCost: 225, wastePercent: 0 },
      { id: "cc-4", name: "Pastry flour & sugar", stockQuantity: "12.0 kg in stock", quantity: 50, unit: "g", costPerUnit: 6.3, lineCost: 315, wastePercent: 0 },
    ],
  },

  // 11. Passion fruit mousse (Desserts, Unavailable - Page 2)
  {
    id: "item-passion-mousse",
    name: "Passion fruit mousse",
    category: "Desserts",
    price: 5000,
    description: "Silky passion fruit purée mousse layered with buttery biscuit crumb.",
    iconType: "dessert",
    available: false,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 2 days ago",
    ingredients: [
      { id: "pm-1", name: "Passion fruit purée", stockQuantity: "2.8 kg in stock", quantity: 80, unit: "g", costPerUnit: 8.5, lineCost: 680, wastePercent: 0 },
      { id: "pm-2", name: "Heavy Cream", stockQuantity: "5.0 L in stock", quantity: 75, unit: "ml", costPerUnit: 4.5, lineCost: 337, wastePercent: 0 },
      { id: "pm-3", name: "Biscuit crumbs", stockQuantity: "3.0 kg in stock", quantity: 35, unit: "g", costPerUnit: 6, lineCost: 210, wastePercent: 0 },
      { id: "pm-4", name: "Mint garnish", stockQuantity: "300 g in stock", quantity: 5, unit: "g", costPerUnit: 34.6, lineCost: 173, wastePercent: 0 },
    ],
  },

  // 12. Tropical fruit platter (Desserts - Page 2)
  {
    id: "item-tropical-fruit",
    name: "Tropical fruit platter",
    category: "Desserts",
    price: 4500,
    description: "Chilled slices of sweet Rwandan pineapple, papaya, watermelon, and fresh passion fruit.",
    iconType: "dessert",
    available: true,
    channels: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    recipeStatus: "complete",
    lastSavedText: "Last saved 5 days ago",
    ingredients: [
      { id: "tf-1", name: "Pineapple fresh", stockQuantity: "8 pcs in stock", quantity: 120, unit: "g", costPerUnit: 3.5, lineCost: 420, wastePercent: 5 },
      { id: "tf-2", name: "Watermelon chilled", stockQuantity: "15 kg in stock", quantity: 150, unit: "g", costPerUnit: 2.2, lineCost: 330, wastePercent: 5 },
      { id: "tf-3", name: "Papaya sweet", stockQuantity: "6 pcs in stock", quantity: 100, unit: "g", costPerUnit: 2.8, lineCost: 280, wastePercent: 5 },
      { id: "tf-4", name: "Passion fruit fresh", stockQuantity: "20 pcs in stock", quantity: 0.5, unit: "pc", costPerUnit: 250, lineCost: 125, wastePercent: 0 },
      { id: "tf-5", name: "Lime wedge", stockQuantity: "24 pcs in stock", quantity: 0.15, unit: "pc", costPerUnit: 300, lineCost: 45, wastePercent: 0 },
    ],
  },
]
