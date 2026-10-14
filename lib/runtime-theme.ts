/**
 * Runtime Theming Engine & Daylight Contrast Validator
 * Compliant with Bara Product & Design Specification Section 3.2:
 * - Per-tenant configuration (logo, brand color accent, tier features)
 * - Themes app at runtime upon staff login and settings updates
 * - Validates daylight contrast for high legibility in bright restaurant environments
 */

export interface PresetAccent {
  id: string
  name: string
  hex: string
  description: string
  recommendedTag: string
}

export const PRESET_ACCENTS: PresetAccent[] = [
  {
    id: "terracotta",
    name: "Bara Terracotta",
    hex: "#C85A24",
    description: "Warm Rwandan volcanic clay",
    recommendedTag: "Bara Default",
  },
  {
    id: "akagera",
    name: "Akagera Green",
    hex: "#2F5233",
    description: "Lush botanical savanna canopy",
    recommendedTag: "Organic & Fresh",
  },
  {
    id: "kigali-sunset",
    name: "Kigali Sunset",
    hex: "#E56A1C",
    description: "Vibrant warm evening ochre",
    recommendedTag: "High Energy",
  },
  {
    id: "volcano-gold",
    name: "Volcano Amber",
    hex: "#D97706",
    description: "Golden honey & warm wood",
    recommendedTag: "Warm & Cozy",
  },
  {
    id: "lake-kivu",
    name: "Lake Kivu Blue",
    hex: "#1D4ED8",
    description: "Deep sapphire water reflection",
    recommendedTag: "Modern & Crisp",
  },
  {
    id: "muhabura",
    name: "Muhabura Slate",
    hex: "#334155",
    description: "Contemporary obsidian charcoal",
    recommendedTag: "Minimalist",
  },
]

export interface ContrastResult {
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  ratingLabel: string
  statusColor: string
  recommendedForeground: string
}

/**
 * Converts a hex color (#RRGGBB) to sRGB values [0, 1]
 */
function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "").trim()
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("")
  }
  const num = parseInt(clean, 16)
  if (isNaN(num)) return [200, 90, 36] // Fallback to #C85A24

  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return [r, g, b]
}

/**
 * Calculates relative luminance for WCAG contrast checking
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Evaluates contrast against white (#FFFFFF) for daylight visibility
 */
export function evaluateDaylightContrast(hexColor: string): ContrastResult {
  const [r, g, b] = hexToRgb(hexColor)
  const colorLum = getLuminance(r, g, b)
  const whiteLum = 1.0 // Luminance of #ffffff

  // Contrast ratio against white
  const ratioAgainstWhite = (whiteLum + 0.05) / (colorLum + 0.05)
  // Contrast ratio against black (#000000)
  const ratioAgainstBlack = (colorLum + 0.05) / 0.05

  // Best foreground choice for text placed on top of this color
  const recommendedForeground = ratioAgainstWhite >= 4.5 ? "#ffffff" : "#111827"

  // Daylight evaluation: In bright daylight on tablets, we want at least 4.5:1 against light background
  const passesAA = ratioAgainstWhite >= 4.5 || ratioAgainstBlack >= 4.5
  const passesAAA = ratioAgainstWhite >= 7.0 || ratioAgainstBlack >= 7.0

  let ratingLabel = "Low Contrast"
  let statusColor = "text-amber-600 dark:text-amber-400"

  if (passesAAA) {
    ratingLabel = "Excellent Daylight Contrast (AAA)"
    statusColor = "text-emerald-600 dark:text-emerald-400"
  } else if (passesAA) {
    ratingLabel = "Good Daylight Contrast (AA)"
    statusColor = "text-emerald-600 dark:text-emerald-400"
  } else {
    ratingLabel = "Caution: Low Sunlight Contrast"
    statusColor = "text-amber-600 dark:text-amber-400"
  }

  const effectiveRatio = Math.max(ratioAgainstWhite, ratioAgainstBlack)

  return {
    ratio: Math.round(effectiveRatio * 10) / 10,
    passesAA,
    passesAAA,
    ratingLabel,
    statusColor,
    recommendedForeground,
  }
}

/**
 * Converts Hex to approximate OKLCH values for Tailwind CSS custom properties
 */
function hexToOklch(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  // Linear RGB
  const rs = r / 255
  const gs = g / 255
  const bs = b / 255

  // Rough perceptual lightness (L: 0 to 1), chroma (C: 0 to 0.4), hue angle (H: 0 to 360)
  const max = Math.max(rs, gs, bs)
  const min = Math.min(rs, gs, bs)
  const delta = max - min

  const l = (max + min) / 2
  const c = Math.min(delta * 0.45, 0.28)

  let h = 0
  if (delta > 0) {
    if (max === rs) {
      h = ((gs - bs) / delta) % 6
    } else if (max === gs) {
      h = (bs - rs) / delta + 2
    } else {
      h = (rs - gs) / delta + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  const oklchLightness = Math.round(Math.min(Math.max(l, 0.35), 0.75) * 100) / 100
  const oklchChroma = Math.round(Math.max(c, 0.12) * 1000) / 1000
  return `oklch(${oklchLightness} ${oklchChroma} ${h})`
}

/**
 * Applies the restaurant branding theme to the DOM at runtime
 */
export function applyRuntimeTheme(brandColor: string = "#C85A24"): void {
  if (typeof document === "undefined") return

  try {
    const root = document.documentElement
    const [r, g, b] = hexToRgb(brandColor)
    const contrast = evaluateDaylightContrast(brandColor)
    const oklchPrimary = hexToOklch(brandColor)

    // Set core CSS theme variables
    root.style.setProperty("--primary", oklchPrimary)
    root.style.setProperty("--sidebar-primary", oklchPrimary)
    root.style.setProperty("--ring", oklchPrimary)
    root.style.setProperty("--brand-accent", brandColor)
    root.style.setProperty("--brand-accent-rgb", `${r}, ${g}, ${b}`)
    root.style.setProperty(
      "--brand-accent-glow",
      `rgba(${r}, ${g}, ${b}, 0.2)`
    )

    // Foreground contrast
    if (contrast.recommendedForeground === "#ffffff") {
      root.style.setProperty("--primary-foreground", "oklch(0.99 0 0)")
      root.style.setProperty("--sidebar-primary-foreground", "oklch(0.99 0 0)")
    } else {
      root.style.setProperty("--primary-foreground", "oklch(0.2 0.02 50)")
      root.style.setProperty("--sidebar-primary-foreground", "oklch(0.2 0.02 50)")
    }

    // Dynamic brand multi-color gradient
    const gradient = `linear-gradient(to right, ${brandColor}, #E56A1C, #EA982C, #EBA529, #2F5233)`
    root.style.setProperty("--brand-gradient", gradient)

    // Update browser theme-color meta tag if present
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", brandColor)
    }
  } catch (err) {
    console.warn("Failed to apply runtime theme:", err)
  }
}
