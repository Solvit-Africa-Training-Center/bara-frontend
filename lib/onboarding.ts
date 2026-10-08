export type OnboardingDraft = {
  // from register
  firstName?: string
  lastName?: string
  email?: string
  restaurantName?: string
  // from setup
  tradingName?: string
  tin?: string
  phone?: string
  city?: string
  address?: string
  currency?: string
  brandColor?: string
  logoDataUrl?: string
  guidedOnboarding?: boolean
  // from plan
  plan?: "basic" | "pro" | "premium"
  billing?: "monthly" | "annual"
}

const KEY = "bara:onboarding"

export function loadDraft(): OnboardingDraft {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as OnboardingDraft) : {}
  } catch {
    return {}
  }
}

/** Overwrites the whole draft. Used when a new registration starts. */
export function startDraft(initial: OnboardingDraft) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(initial))
  } catch {
    /* storage unavailable */
  }
}

/** Merges new fields into the existing draft. */
export function saveDraft(patch: Partial<OnboardingDraft>) {
  if (typeof window === "undefined") return
  const next = { ...loadDraft(), ...patch }
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // A large logo can exceed the storage quota, so retry without it
    try {
      const { logoDataUrl: _logo, ...rest } = next
      window.sessionStorage.setItem(KEY, JSON.stringify(rest))
    } catch {
      /* storage unavailable */
    }
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}