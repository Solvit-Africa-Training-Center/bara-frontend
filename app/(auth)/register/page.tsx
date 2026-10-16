"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Lock, Mail, Store, AlertCircle } from "lucide-react"

import { AuthShell, authInputClass } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { startDraft } from "@/lib/onboarding"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { validateData, signupSchema } from "@/lib/validations"

const highlights = [
  "Secure owner account",
  "Local-first sync for daily operations",
  "Your data stays yours",
]

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated, isLoading } = useAuth()
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [restaurantName, setRestaurantName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [agreed, setAgreed] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (!isLoading && isAuthenticated) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!agreed) {
      setError("Please accept the terms of service to continue.")
      return
    }

    const validation = validateData(signupSchema, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      restaurant_name: restaurantName.trim(),
      email: email.trim(),
      password: password,
      accept_terms: agreed,
    })

    if (!validation.isValid) {
      setError(validation.error || "Please check your registration details.")
      return
    }

    setLoading(true)
    const res = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password,
      restaurantName: restaurantName.trim(),
    })

    if (!res.success) {
      setError(res.error || "Registration failed. Please check your details.")
      setLoading(false)
      return
    }

    // Carry the account details into the setup step
    startDraft({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      restaurantName: restaurantName.trim(),
    })
    setTimeout(() => {
      router.push("/setup")
    }, 400)
  }

  const labelClass = "text-xs font-bold text-[#3B2F2A] dark:text-[#FAF3E7]"
  const plainInput =
    "h-11 w-full rounded-lg border border-[#EADFCF] bg-[#FFFBF4] dark:bg-[#251E1A] dark:border-[#3D3028] px-3.5 text-sm text-[#3B2F2A] dark:text-[#FAF3E7] placeholder:text-[#A6978C] outline-none focus:border-[#C1440E] focus:ring-1 focus:ring-[#C1440E] transition-all"
  const iconClass =
    "pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]"

  return (
    <AuthShell
      maxWidthClass="max-w-[520px]"
      eyebrow="Start with your restaurant"
      eyebrowClassName="text-[#EA982C]"
      heading={
        <>
          One account for
          <br />
          clearer daily
          <br />
          decisions.
        </>
      }
      description="Set up your owner access first. Next, we'll add your restaurant details and help you choose the right Bara plan."
      extra={
        <ul className="mt-6 space-y-2.5">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-[13px] text-white/75"
            >
              <Check className="size-3.5 shrink-0 stroke-[2.5] text-[#EA982C]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      }
    >
      <div className="rounded-[22px] border border-[#EFE4D6] dark:border-[#382C24] bg-[#FFF9F0] dark:bg-[#1E1815] p-6 sm:p-7 shadow-[0_8px_0_-4px_#EADFCE,0_22px_40px_-20px_rgba(59,47,42,0.3)] dark:shadow-none">
        {/* Sign-in link */}
        <div className="mb-4 flex items-center justify-end text-xs">
          <span className="text-[#75665E] dark:text-[#BAACA1]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#C1440E] underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </span>
        </div>

        <div className="mb-5 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF3E7] font-[family-name:var(--font-ubuntu)]">
            Create your owner account
          </h1>
          <p className="text-sm text-[#75665E] dark:text-[#BAACA1]">
            Use the details of the person responsible for the restaurant and
            subscription.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            <AlertCircle className="size-4 shrink-0 stroke-[2] text-red-600 dark:text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Row 1: names */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first-name" className={labelClass}>
                First name
              </Label>
              <input
                id="first-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Aline"
                className={plainInput}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last-name" className={labelClass}>
                Last name
              </Label>
              <input
                id="last-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mukamana"
                className={plainInput}
              />
            </div>
          </div>

          {/* Row 2: restaurant name */}
          <div className="space-y-1.5">
            <Label htmlFor="restaurant-name" className={labelClass}>
              Restaurant name
            </Label>
            <div className="relative flex items-center">
              <Store className={iconClass} />
              <input
                id="restaurant-name"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Ikaze Bistro"
                className={cn(authInputClass, "pr-4")}
              />
            </div>
          </div>

          {/* Row 3: work email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className={labelClass}>
              Work email
            </Label>
            <div className="relative flex items-center">
              <Mail className={iconClass} />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@restaurant.rw"
                className={cn(authInputClass, "pr-4")}
              />
            </div>
          </div>

          {/* Row 4: password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className={labelClass}>
                Create password
              </Label>
              <span className="text-[11px] text-[#8F8179]">
                8+ chars, uppercase &amp; number
              </span>
            </div>
            <div className="relative flex items-center">
              <Lock className={iconClass} />
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={cn(authInputClass, "pr-4")}
              />
            </div>
          </div>

          <label className="group inline-flex cursor-pointer select-none items-center gap-2.5 pt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div
              className={cn(
                "flex size-4 items-center justify-center rounded border transition-all",
                agreed
                  ? "border-[#C1440E] bg-[#C1440E] text-white"
                  : "border-[#D6CBC0] bg-transparent group-hover:border-[#C1440E] dark:border-[#4A3B31]"
              )}
            >
              {agreed && <Check className="size-3 stroke-[3]" />}
            </div>
            <span className="text-[13px] text-[#3B2F2A] dark:text-[#E8DDD2]">
              I agree to the Bara{" "}
              <Link
                href="#"
                className="font-semibold text-[#C1440E] underline-offset-4 hover:underline"
              >
                terms
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="font-semibold text-[#C1440E] underline-offset-4 hover:underline"
              >
                privacy policy
              </Link>
              .
            </span>
          </label>

          <Button
            type="submit"
            disabled={loading || !agreed}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#A8380A] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span>Setting up workspace...</span>
            ) : (
              <>
                <ArrowRight className="size-4 stroke-[2.2]" />
                <span>Continue to restaurant setup</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs text-[#75665E] dark:text-[#A6978C]">
            Next: logo, business details and optional setup assistance.
          </p>
        </form>
      </div>
    </AuthShell>
  )
}