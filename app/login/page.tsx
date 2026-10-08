"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"

import { AuthShell, authInputClass } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("aline@ikazebistro.rw")
  const [password, setPassword] = React.useState("ikazebistro12")
  const [showPassword, setShowPassword] = React.useState(false)
  const [keepSignedIn, setKeepSignedIn] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/")
    }, 600)
  }

  return (
    <AuthShell
      maxWidthClass="max-w-[480px]"
      eyebrow="Made for East African hospitality"
      heading={
        <>
          Know your numbers.
          <br />
          Run your restaurant
          <br />
          with confidence.
        </>
      }
      description="Sales, stock, recipes and practical insights—kept in sync even when the connection is not."
      extra={
        <div className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/5 bg-[#5C200A]/70 px-4 py-2.5 text-[13px] font-semibold text-white/90">
          <Shield className="size-4 shrink-0 stroke-[1.6] text-white/80" />
          <span>Local-first · Secure · Built for daily operations</span>
        </div>
      }
    >
      <div className="rounded-[22px] border border-[#EFE4D6] dark:border-[#382C24] bg-[#FFF9F0] dark:bg-[#1E1815] p-7 sm:p-8 shadow-[0_8px_0_-4px_#EADFCE,0_22px_40px_-20px_rgba(59,47,42,0.3)] dark:shadow-none">
        <div className="mb-6 space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF3E7] font-[family-name:var(--font-ubuntu)]">
            Welcome back
          </h1>
          <p className="text-sm text-[#75665E] dark:text-[#BAACA1]">
            Sign in to continue to your restaurant workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF3E7]"
            >
              Email address
            </Label>
            <div className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aline@ikazebistro.rw"
                className={cn(authInputClass, "pr-4")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF3E7]"
              >
                Password
              </Label>
              <Link
                href="#"
                className="text-xs font-bold text-[#C1440E] transition-colors hover:text-[#A8380A] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={cn(authInputClass, "pr-11")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 cursor-pointer p-0.5 text-[#8F8179] transition-colors hover:text-[#3B2F2A] dark:hover:text-[#FAF3E7]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4 stroke-[1.6]" />
                ) : (
                  <Eye className="size-4 stroke-[1.6]" />
                )}
              </button>
            </div>
          </div>

          <label className="group inline-flex cursor-pointer select-none items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="sr-only"
            />
            <div
              className={cn(
                "flex size-4 items-center justify-center rounded border transition-all",
                keepSignedIn
                  ? "border-[#C1440E] bg-[#C1440E] text-white"
                  : "border-[#D6CBC0] bg-transparent group-hover:border-[#C1440E] dark:border-[#4A3B31]"
              )}
            >
              {keepSignedIn && <Check className="size-3 stroke-[3]" />}
            </div>
            <span className="text-[13px] text-[#3B2F2A] dark:text-[#E8DDD2]">
              Keep me signed in on this device
            </span>
          </label>

          <div className="flex justify-start pt-1">
            <Button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-[#C1440E] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#A8380A] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <ArrowRight className="size-4 stroke-[2.2]" />
                  <span>Sign in to Bara</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 text-xs text-[#75665E] dark:text-[#A6978C]">
            <Shield className="size-3.5 shrink-0 stroke-[1.8] text-[#5B8C5A]" />
            <span>Your data is encrypted and synced securely.</span>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}