"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { authApi, getCookie, setCookie, removeCookie } from "@/lib/api-client"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  initials: string
  restaurantName?: string
  phone?: string
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

export const DEMO_USERS: Record<string, AuthUser> = {
  "alex@barabistro.rw": {
    id: "usr-001",
    name: "Alex Rivera",
    email: "alex@barabistro.rw",
    initials: "AR",
    role: "General Manager",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    restaurantName: "Bara Bistro & Grill",
  },
  "aline@ikazebistro.rw": {
    id: "usr-002",
    name: "Aline Uwase",
    email: "aline@ikazebistro.rw",
    initials: "AU",
    role: "Restaurant Owner & GM",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    restaurantName: "Ikaze Bistro & Lounge",
  },
}

export const DEFAULT_AUTH_USER: AuthUser = DEMO_USERS["alex@barabistro.rw"]

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getPersistedUser(): AuthUser | null {
  if (typeof document === "undefined") return DEFAULT_AUTH_USER
  try {
    const isLoggedOut = getCookie(LOGGED_OUT_COOKIE_KEY) === "true"
    if (isLoggedOut) return null

    const stored = getCookie(USER_COOKIE_KEY)
    if (stored) return JSON.parse(stored)
    return DEFAULT_AUTH_USER
  } catch {
    return DEFAULT_AUTH_USER
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<AuthUser | null>(DEFAULT_AUTH_USER)
  const [isLoading, setIsLoading] = React.useState(false)

  // Hydrate persisted session from cookies after initial render
  React.useEffect(() => {
    // Clean up any legacy localStorage session
    try {
      window.localStorage.removeItem("bara:auth_session")
      window.localStorage.removeItem("bara:auth_logged_out")
    } catch {}

    const persisted = getPersistedUser()
    if (persisted && persisted.id !== DEFAULT_AUTH_USER.id) {
      setUser(persisted)
    } else if (persisted === null) {
      setUser(null)
    }
  }, [])

  const persistSession = (authUser: AuthUser | null, keepSignedIn = true) => {
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

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string }> => {
    const emailKey = credentials.email.trim().toLowerCase()

    if (!emailKey) {
      return { success: false, error: "Please enter your email address." }
    }

    // 1. Attempt live API login if credentials are provided
    if (credentials.password) {
      try {
        const apiRes = await authApi.login({
          email: credentials.email.trim(),
          password: credentials.password,
        })
        if (apiRes.user) {
          const fullName =
            `${apiRes.user.first_name || ""} ${apiRes.user.last_name || ""}`.trim() ||
            apiRes.user.email
          const authenticatedUser: AuthUser = {
            id: apiRes.user.id,
            name: fullName,
            email: apiRes.user.email,
            initials: getInitials(fullName),
            role: "Restaurant Owner",
            avatar: DEFAULT_AUTH_USER.avatar,
            restaurantName:
              apiRes.user.restaurant?.name || "Bara Bistro & Grill",
          }
          setUser(authenticatedUser)
          persistSession(authenticatedUser, credentials.keepSignedIn ?? true)
          return { success: true }
        }
      } catch (err: unknown) {
        // If not a preconfigured demo account, surface the live API error
        if (!DEMO_USERS[emailKey]) {
          const errMsg = err instanceof Error ? err.message : "Invalid credentials."
          return { success: false, error: errMsg }
        }
      }
    }

    // 2. Predefined demo account fallback
    if (DEMO_USERS[emailKey]) {
      const authenticatedUser = DEMO_USERS[emailKey]
      setUser(authenticatedUser)
      persistSession(authenticatedUser, credentials.keepSignedIn ?? true)
      return { success: true }
    }

    return {
      success: false,
      error: "Unable to sign in. Please verify your credentials.",
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
        initials: getInitials(fullName),
        role: "Restaurant Owner",
        avatar: DEFAULT_AUTH_USER.avatar,
        restaurantName:
          signupRes.user.restaurant?.name || data.restaurantName.trim() || "My Restaurant",
      }

      // Automatically sign in to get tokens
      try {
        await authApi.login({ email: data.email.trim(), password: data.password })
      } catch {}

      setUser(newUser)
      persistSession(newUser, true)
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
