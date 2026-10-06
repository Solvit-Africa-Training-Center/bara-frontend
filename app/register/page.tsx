"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Lock, Mail, Store, User } from "lucide-react"

import { BaraLogo } from "@/components/bara-logo"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = React.useState("")
  const [restaurantName, setRestaurantName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/pricing")
    }, 600)
  }

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-6 px-2">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl grid md:grid-cols-2">
        {/* Left Brand Panel matching Figma Frame 1 */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#3B1705] via-[#2A1004] to-[#1A0A02] p-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(#EA982C_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none" />

          <div className="relative z-10">
            <BaraLogo />

            <div className="mt-12 space-y-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Join Bara Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                One account for clearer daily decisions.
              </h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Connect your sales, food costs, and inventory into one intuitive
                workspace designed specifically for restaurants and cafes.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-10 space-y-2.5 border-t border-white/15 pt-6 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Full access to real-time daily shift ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>AI cost variance analysis &amp; recipe portion audits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Instant multi-user permissions for floor managers &amp; chefs</span>
            </div>
          </div>
        </div>

        {/* Right Form: Register */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-card">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="text-xs text-muted-foreground">
              Get started with 14 days of full Bara Pro features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Your Full Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="h-9.5 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Restaurant Name
              </label>
              <div className="relative mt-1">
                <Store className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Bara Bistro & Grill"
                  className="h-9.5 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Work Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@barabistro.rw"
                  className="h-9.5 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="h-9.5 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs shadow-md transition-all mt-2"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Get Started
                  <ArrowRight className="size-3.5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
