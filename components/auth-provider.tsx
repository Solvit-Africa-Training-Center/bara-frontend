"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

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

const AUTH_STORAGE_KEY = "bara:auth_session"
const LOGGED_OUT_KEY = "bara:auth_logged_out"

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
  if (typeof window === "undefined") return DEFAULT_AUTH_USER
  try {
    const isLoggedOut = window.localStorage.getItem(LOGGED_OUT_KEY) === "true"
    if (isLoggedOut) return null

    const stored =
      window.localStorage.getItem(AUTH_STORAGE_KEY) ||
      window.sessionStorage.getItem(AUTH_STORAGE_KEY)

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

  // Hydrate persisted session after initial render to avoid SSR mismatch
  React.useEffect(() => {
    const persisted = getPersistedUser()
    if (persisted && persisted.id !== DEFAULT_AUTH_USER.id) {
      setUser(persisted)
    } else if (persisted === null) {
      setUser(null)
    }

    const onStorage = () => {
      setUser(getPersistedUser())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const persistSession = (authUser: AuthUser | null, keepSignedIn = true) => {
    if (typeof window === "undefined") return
    try {
      if (authUser) {
        window.localStorage.removeItem(LOGGED_OUT_KEY)
        const json = JSON.stringify(authUser)
        if (keepSignedIn) {
          window.localStorage.setItem(AUTH_STORAGE_KEY, json)
          window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
        } else {
          window.sessionStorage.setItem(AUTH_STORAGE_KEY, json)
          window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
        window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
        window.localStorage.setItem(LOGGED_OUT_KEY, "true")
      }
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

    // Match demo accounts or generate dynamically for any custom email
    let authenticatedUser: AuthUser
    if (DEMO_USERS[emailKey]) {
      authenticatedUser = DEMO_USERS[emailKey]
    } else {
      const derivedName = emailKey.split("@")[0].replace(/[._-]/g, " ")
      const formattedName = derivedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")

      authenticatedUser = {
        id: `usr-${Date.now().toString(36)}`,
        name: formattedName || "Restaurant Staff",
        email: credentials.email.trim(),
        initials: getInitials(formattedName || "RS"),
        role: "Restaurant Manager",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        restaurantName: "Bara Bistro & Grill",
      }
    }

    setUser(authenticatedUser)
    persistSession(authenticatedUser, credentials.keepSignedIn ?? true)
    return { success: true }
  }

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim()
    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: fullName || "Owner",
      email: data.email.trim(),
      initials: getInitials(fullName || "OW"),
      role: "Restaurant Owner",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      restaurantName: data.restaurantName.trim() || "My Restaurant",
    }

    setUser(newUser)
    persistSession(newUser, true)
    return { success: true }
  }

  const logout = () => {
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
