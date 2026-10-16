"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { authApi, getCookie, setCookie, removeCookie, getStoredTokens, saveStoredTokens } from "@/lib/api-client"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  initials: string
  restaurantName?: string
  phone?: string
  isOwner?: boolean
}

export function parseUserRole(rawRole?: string): { role: string; isOwner: boolean } {
  const norm = (rawRole || "").toLowerCase().trim()
  if (norm === "manager") {
    return { role: "Manager", isOwner: false }
  }
  if (norm === "cashier") {
    return { role: "Cashier / Waiter", isOwner: false }
  }
  if (norm === "kitchen") {
    return { role: "Kitchen / Stock", isOwner: false }
  }
  if (norm === "owner" || norm === "restaurant owner" || norm === "super_admin" || norm === "superadmin") {
    return { role: "Restaurant Owner", isOwner: true }
  }
  return { role: "Restaurant Owner", isOwner: true }
}

export interface LoginCredentials {
  email: string
  password?: string
  keepSignedIn?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password?: string
  restaurantName: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (patch: Partial<AuthUser>) => void
}

const USER_COOKIE_KEY = "bara_auth_user"
const LOGGED_OUT_COOKIE_KEY = "bara_auth_logged_out"

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getPersistedUser(): AuthUser | null {
  if (typeof document === "undefined") return null
  try {
    const isLoggedOut = getCookie(LOGGED_OUT_COOKIE_KEY) === "true"
    if (isLoggedOut) return null

    // Require active JWT tokens. If cookies contain a stale user profile but no tokens, clear it!
    const tokens = getStoredTokens()
    if (!tokens?.access && !tokens?.refresh) {
      removeCookie(USER_COOKIE_KEY)
      saveStoredTokens(null)
      return null
    }

    const stored = getCookie(USER_COOKIE_KEY)
    if (stored && stored.trim() !== "") {
      return JSON.parse(stored)
    }

    // Missing user profile with lingering tokens: clear stale tokens to prevent redirect loops
    saveStoredTokens(null)
    return null
  } catch {
    saveStoredTokens(null)
    removeCookie(USER_COOKIE_KEY)
    return null
  }
}

function persistSession(authUser: AuthUser | null, keepSignedIn = true) {
  if (typeof document === "undefined") return
  try {
    if (authUser) {
      removeCookie(LOGGED_OUT_COOKIE_KEY)
      const json = JSON.stringify(authUser)
      setCookie(USER_COOKIE_KEY, json, keepSignedIn ? 14 : 1)
    } else {
      removeCookie(USER_COOKIE_KEY)
      setCookie(LOGGED_OUT_COOKIE_KEY, "true", 14)
    }
    // Ensure legacy localStorage is clean
    try {
      window.localStorage.removeItem("bara:auth_session")
      window.localStorage.removeItem("bara:auth_logged_out")
    } catch {}
  } catch {
    /* storage error ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Hydrate persisted session from cookies after initial render to ensure exact SSR match
  React.useEffect(() => {
    // Clean up any legacy localStorage session
    try {
      window.localStorage.removeItem("bara:auth_session")
      window.localStorage.removeItem("bara:auth_logged_out")
    } catch {}

    const persisted = getPersistedUser()
    setUser(persisted)
    setIsLoading(false)

    // Revalidate & sync profile from backend in background to guarantee role accuracy
    if (persisted) {
      authApi
        .getProfile()
        .then((profile) => {
          if (profile) {
            const { role, isOwner } = parseUserRole(profile.role)
            setUser((curr) => {
              if (!curr) return null
              if (
                curr.role === role &&
                curr.isOwner === isOwner &&
                (!profile.phone_number || curr.phone === profile.phone_number)
              ) {
                return curr
              }
              const updated: AuthUser = {
                ...curr,
                role,
                isOwner,
                phone: profile.phone_number || curr.phone,
              }
              persistSession(updated)
              return updated
            })
          }
        })
        .catch(() => {})
    }
  }, [])

  // Listen for session expiration events from api-client
  React.useEffect(() => {
    const onSessionExpired = () => {
      setUser(null)
    }
    window.addEventListener("bara:session_expired", onSessionExpired)
    return () => window.removeEventListener("bara:session_expired", onSessionExpired)
  }, [])

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string }> => {
    const emailKey = credentials.email.trim().toLowerCase()

    if (!emailKey) {
      return { success: false, error: "Please enter your email address." }
    }

    if (!credentials.password) {
      return { success: false, error: "Please enter your password." }
    }

    try {
      const apiRes = await authApi.login({
        email: credentials.email.trim(),
        password: credentials.password,
      })
      if (apiRes.user) {
        const fullName =
          `${apiRes.user.first_name || ""} ${apiRes.user.last_name || ""}`.trim() ||
          apiRes.user.email
        const { role, isOwner } = parseUserRole(apiRes.user.role)
        const authenticatedUser: AuthUser = {
          id: apiRes.user.id,
          name: fullName,
          email: apiRes.user.email,
          phone: apiRes.user.phone_number,
          initials: getInitials(fullName),
          role,
          isOwner,
          avatar: "",
          restaurantName:
            apiRes.user.restaurant?.name || "Bara Bistro & Grill",
        }
        setUser(authenticatedUser)
        persistSession(authenticatedUser, credentials.keepSignedIn ?? true)

        // If the authenticated user is the owner, cache their owner profile so managers can see who the owner is
        if (isOwner) {
          try {
            window.localStorage.setItem(
              "bara:restaurant_owner_record",
              JSON.stringify({
                id: authenticatedUser.id,
                name: authenticatedUser.name,
                email: authenticatedUser.email,
                phone: authenticatedUser.phone,
                role: "Owner",
                status: "Active",
                platformAccess: "App + Web",
                avatarInitials: authenticatedUser.initials,
                isOwner: true,
                lastLogin: "Active now",
                createdAt: new Date().toISOString(),
              })
            )
          } catch {}
        }

        return { success: true }
      }
      return {
        success: false,
        error: "Login response did not contain user profile.",
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Invalid email or password."
      return { success: false, error: errMsg }
    }
  }

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    if (!data.password) {
      return { success: false, error: "Password is required." }
    }

    try {
      const signupRes = await authApi.signup({
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        restaurant_name: data.restaurantName.trim(),
        email: data.email.trim(),
        password: data.password,
        accept_terms: true,
      })

      const fullName =
        `${signupRes.user.first_name || ""} ${signupRes.user.last_name || ""}`.trim() ||
        signupRes.user.email
      const newUser: AuthUser = {
        id: signupRes.user.id,
        name: fullName,
        email: signupRes.user.email,
        phone: signupRes.user.phone_number,
        initials: getInitials(fullName),
        role: "Restaurant Owner",
        isOwner: true,
        avatar: "",
        restaurantName:
          signupRes.user.restaurant?.name || data.restaurantName.trim() || "My Restaurant",
      }

      // Automatically sign in to get tokens
      try {
        await authApi.login({ email: data.email.trim(), password: data.password })
      } catch {}

      setUser(newUser)
      persistSession(newUser, true)

      try {
        window.localStorage.setItem(
          "bara:restaurant_owner_record",
          JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: "Owner",
            status: "Active",
            platformAccess: "App + Web",
            avatarInitials: newUser.initials,
            isOwner: true,
            lastLogin: "Active now",
            createdAt: new Date().toISOString(),
          })
        )
      } catch {}

      return { success: true }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please check your details."
      return { success: false, error: message }
    }
  }

  const logout = () => {
    authApi.logout().catch(() => {})
    setUser(null)
    persistSession(null)
    router.push("/login")
  }

  const updateUser = (patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = {
        ...prev,
        ...patch,
        initials: patch.name ? getInitials(patch.name) : prev.initials,
      }
      persistSession(updated)
      return updated
    })
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>")
  }
  return context
}
