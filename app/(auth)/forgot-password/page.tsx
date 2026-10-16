"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, Shield, AlertCircle } from "lucide-react"

import { AuthShell, authInputClass } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { authApi } from "../auth-api"
import { validateData, forgotPasswordSchema } from "@/lib/validations"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string>("")

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

    const validation = validateData(forgotPasswordSchema, { email })
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const res = await authApi.forgotPassword(email.trim(), { timeoutMs: 8000 })
      setMessage(
        res.message ||
          "Password reset instructions have been sent to your email address."
      )
      setSubmitted(true)
    } catch {
      // If server SMTP is delayed or unhandled, transition smoothly to instruction screen
      setMessage(
        "If an account exists with this email, password reset instructions will be sent."
      )
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      maxWidthClass="max-w-[480px]"
      eyebrow="Bara Account Recovery"
      heading={
        <>
          Restore access
          <br />
          to your restaurant
          <br />
          operations.
        </>
      }
      description="Quick and secure PIN/password reset for restaurant owners, general managers, and staff."
      extra={
        <div className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/5 bg-[#5C200A]/70 px-4 py-2.5 text-[13px] font-semibold text-white/90">
          <Shield className="size-4 shrink-0 stroke-[1.6] text-white/80" />
          <span>Encrypted token recovery · Bank-grade security</span>
        </div>
      }
    >
      <div className="rounded-[22px] border border-[#EFE4D6] dark:border-[#382C24] bg-[#FFF9F0] dark:bg-[#1E1815] p-7 sm:p-8 shadow-[0_8px_0_-4px_#EADFCE,0_22px_40px_-20px_rgba(59,47,42,0.3)] dark:shadow-none">
        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#2F5233]/10 text-[#2F5233] dark:text-emerald-400">
              <CheckCircle2 className="size-8 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF5EE] font-[family-name:var(--font-ubuntu)]">
                Check your inbox
              </h1>
              <p className="text-sm text-[#75665E] dark:text-[#BAACA1] leading-relaxed">
                We sent a password reset link and verification token to:
                <br />
                <strong className="text-[#3B2F2A] dark:text-[#FAF5EE] font-bold">
                  {email}
                </strong>
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-3.5 text-left text-xs text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground">Next steps:</p>
              <p>1. Copy the reset token or click the link received in your email.</p>
              <p>2. Choose a new secure password of at least 8 characters.</p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                render={
                  <Link
                    href={`/reset-password?email=${encodeURIComponent(email)}`}
                  />
                }
                className="w-full h-11 rounded-lg bg-[#C1440E] hover:bg-[#A8380A] text-white text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Reset Token &amp; Set Password</span>
                <ArrowRight className="size-4" />
              </Button>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer py-1"
              >
                Didn&apos;t receive email? Try another address
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#3B2F2A] dark:text-[#FAF5EE] font-[family-name:var(--font-ubuntu)]">
                Forgot password?
              </h1>
              <p className="text-sm text-[#75665E] dark:text-[#BAACA1]">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                <AlertCircle className="size-4 shrink-0 stroke-[2] text-red-600 dark:text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@yourrestaurant.rw"
                    className={authInputClass}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#A8380A] active:scale-[0.99] disabled:opacity-60"
                >
                  {loading ? (
                    <span>Sending reset instructions...</span>
                  ) : (
                    <>
                      <span>Send reset link</span>
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
        )}
      </div>
    </AuthShell>
  )
}
