"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Shield,
} from "lucide-react"

import { AuthShell, authInputClass } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { authApi, ApiError } from "@/lib/api-client"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { validateData, resetPasswordSchema } from "@/lib/validations"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialEmail = searchParams.get("email") || ""
  const initialToken = searchParams.get("token") || ""

  const [email, setEmail] = React.useState(initialEmail)
  const [token, setToken] = React.useState(initialToken)
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  // Sync searchParams if they arrive after mount
  React.useEffect(() => {
    if (initialEmail && !email) setEmail(initialEmail)
    if (initialToken && !token) setToken(initialToken)
  }, [initialEmail, initialToken, email, token])

  const isMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const isMatching = newPassword.length > 0 && newPassword === confirmPassword
  const isPasswordValid = isMinLength && hasUppercase && hasNumber && isMatching

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const validation = validateData(resetPasswordSchema, {
      email: email.trim(),
      token: token.trim(),
      new_password: newPassword,
      confirm_password: confirmPassword,
    })

    if (!validation.isValid) {
      setError(validation.error || "Please verify your input details.")
      if (validation.errors) {
        setFieldErrors(validation.errors)
      }
      return
    }

    setLoading(true)

    try {
      await authApi.resetPassword({
        email: email.trim(),
        token: token.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      setSuccess(true)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
        if (err.fieldErrors) {
          const mapped: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(err.fieldErrors)) {
            mapped[key] = msgs.join(" ")
          }
          setFieldErrors(mapped)
        }
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to reset password. Please check your token and try again."
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#2F5233]/10 text-[#2F5233] dark:text-emerald-400">
          <CheckCircle2 className="size-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF5EE] font-[family-name:var(--font-ubuntu)]">
            Password reset complete!
          </h1>
          <p className="text-sm text-[#75665E] dark:text-[#BAACA1] leading-relaxed">
            Your password has been successfully updated. You can now sign in with your new credentials.
          </p>
        </div>

        <div className="pt-2">
          <Button
            render={<Link href="/login" />}
            className="w-full h-11 rounded-lg bg-[#C1440E] hover:bg-[#A8380A] text-white text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF5EE] font-[family-name:var(--font-ubuntu)]">
          Reset password
        </h1>
        <p className="text-sm text-[#75665E] dark:text-[#BAACA1]">
          Enter your verification token and choose a new password.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          <AlertCircle className="size-4 shrink-0 stroke-[2] text-red-600 dark:text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF5EE]"
          >
            Account email address
          </Label>
          <div className="relative flex items-center">
            <Mail className="pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }))
                }
              }}
              placeholder="manager@yourrestaurant.rw"
              className={cn(
                authInputClass,
                fieldErrors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Reset Token */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="token"
              className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF5EE]"
            >
              Reset Token / Code
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#C1440E] hover:underline"
            >
              Need a code?
            </Link>
          </div>
          <div className="relative flex items-center">
            <KeyRound className="pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
            <input
              id="token"
              type="text"
              required
              value={token}
              onChange={(e) => {
                setToken(e.target.value)
                if (fieldErrors.token) {
                  setFieldErrors((prev) => ({ ...prev, token: "" }))
                }
              }}
              placeholder="Paste the token sent to your email"
              className={cn(
                authInputClass,
                fieldErrors.token && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
          </div>
          {fieldErrors.token && (
            <p className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              {fieldErrors.token}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="new-password"
            className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF5EE]"
          >
            New password
          </Label>
          <div className="relative flex items-center">
            <Lock className="pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (fieldErrors.new_password) {
                  setFieldErrors((prev) => ({ ...prev, new_password: "" }))
                }
              }}
              placeholder="At least 8 characters (uppercase & number)"
              className={cn(
                authInputClass,
                "pr-11",
                fieldErrors.new_password && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 cursor-pointer p-0.5 text-[#8F8179] hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4 stroke-[1.6]" />
              ) : (
                <Eye className="size-4 stroke-[1.6]" />
              )}
            </button>
          </div>
          {fieldErrors.new_password && (
            <p className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              {fieldErrors.new_password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirm-password"
            className="text-xs font-bold text-[#3B2F2A] dark:text-[#FAF5EE]"
          >
            Confirm new password
          </Label>
          <div className="relative flex items-center">
            <Lock className="pointer-events-none absolute left-3.5 size-4 stroke-[1.6] text-[#8F8179]" />
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (fieldErrors.confirm_password) {
                  setFieldErrors((prev) => ({ ...prev, confirm_password: "" }))
                }
              }}
              placeholder="Re-enter your new password"
              className={cn(
                authInputClass,
                "pr-11",
                fieldErrors.confirm_password && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 cursor-pointer p-0.5 text-[#8F8179] hover:text-foreground"
            >
              {showConfirm ? (
                <EyeOff className="size-4 stroke-[1.6]" />
              ) : (
                <Eye className="size-4 stroke-[1.6]" />
              )}
            </button>
          </div>
          {fieldErrors.confirm_password && (
            <p className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              {fieldErrors.confirm_password}
            </p>
          )}
        </div>

        {/* Password Requirements Checklist */}
        <div className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-1.5 text-xs">
          <p className="font-bold text-[#3B2F2A] dark:text-[#FAF5EE] text-[11px]">
            Password requirements:
          </p>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold",
                isMinLength
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isMinLength ? "✓" : "•"}
            </span>
            <span
              className={cn(
                isMinLength ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              At least 8 characters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold",
                hasUppercase
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {hasUppercase ? "✓" : "•"}
            </span>
            <span
              className={cn(
                hasUppercase ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              At least one uppercase letter (A-Z)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold",
                hasNumber
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {hasNumber ? "✓" : "•"}
            </span>
            <span
              className={cn(
                hasNumber ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              At least one number (0-9)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold",
                isMatching
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isMatching ? "✓" : "•"}
            </span>
            <span
              className={cn(
                isMatching ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              Passwords match
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || !isPasswordValid || !token.trim() || !email.trim()}
            className="w-full h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#A8380A] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span>Updating password...</span>
            ) : (
              <>
                <span>Reset password</span>
                <ArrowRight className="size-4 stroke-[2.2]" />
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t border-[#EFE4D6] dark:border-[#382C24] pt-4 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C1440E] hover:text-[#A8380A] hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (!isLoading && isAuthenticated) {
    return null
  }

  return (
    <AuthShell
      maxWidthClass="max-w-[480px]"
      eyebrow="Bara Security"
      heading={
        <>
          Set a new
          <br />
          secure password
          <br />
          for your account.
        </>
      }
      description="Protect your daily restaurant sales logs, inventory tracking, and POS access with a strong password."
      extra={
        <div className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/5 bg-[#5C200A]/70 px-4 py-2.5 text-[13px] font-semibold text-white/90">
          <Shield className="size-4 shrink-0 stroke-[1.6] text-white/80" />
          <span>Direct authorization token verification</span>
        </div>
      }
    >
      <div className="rounded-[22px] border border-[#EFE4D6] dark:border-[#382C24] bg-[#FFF9F0] dark:bg-[#1E1815] p-7 sm:p-8 shadow-[0_8px_0_-4px_#EADFCE,0_22px_40px_-20px_rgba(59,47,42,0.3)] dark:shadow-none">
        <React.Suspense
          fallback={
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="size-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs text-muted-foreground">Loading reset form...</span>
            </div>
          }
        >
          <ResetPasswordForm />
        </React.Suspense>
      </div>
    </AuthShell>
  )
}
