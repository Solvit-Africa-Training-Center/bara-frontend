"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

import { BaraLogo } from "@/components/bara-logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [restaurantName, setRestaurantName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/setup")
    }, 600)
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* SECTION 1 (Left): Full-bleed brand welcome story matching Figma Frame 1 */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#3B1705] via-[#2A1004] to-[#1A0A02] p-10 xl:p-14 text-white overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#EA982C_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-[#EA982C]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo badge */}
          <div className="inline-flex items-center rounded-2xl bg-white p-3.5 shadow-md">
            <BaraLogo useSvgFile />
          </div>

          <div className="mt-16 xl:mt-24 space-y-4 max-w-lg">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-xs">
              Get Started with Bara
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              One account for clearer daily decisions.
            </h2>
            <p className="text-sm xl:text-base text-white/80 leading-relaxed">
              Join independent restaurants and multi-unit operators streamlining kitchen inventory,
              ledger reconciliation, and profit margins with automated operational intelligence.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 space-y-3.5 border-t border-white/15 pt-8 text-xs xl:text-sm text-white/85">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>Fast setup in under 5 minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>No proprietary POS hardware lock-in</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>Real-time AI recommendations &amp; shift ledger</span>
          </div>

          <div className="pt-6 text-[11px] text-white/60">
            &copy; 2026 Bara Technologies. All rights reserved.
          </div>
        </div>
      </div>

      {/* SECTION 2 (Right): Warm sand background with floating shadcn signup-01 card */}
      <div className="relative flex min-h-screen items-center justify-center bg-[#FAF7F2] dark:bg-[#151210] p-4 sm:p-8 lg:p-12">
        {/* Subtle diamond tile background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#C85A24_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* Floating shadcn signup-01 card */}
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo header (shown on small screens only) */}
          <div className="mb-6 flex justify-center lg:hidden">
            <div className="rounded-2xl bg-white p-3 shadow-md">
              <BaraLogo useSvgFile />
            </div>
          </div>

          <Card className="border-border/80 bg-card shadow-2xl rounded-3xl">
            <CardHeader className="space-y-1.5 p-6 sm:p-8 pb-4 sm:pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                Create an account
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter your details below to create your Bara restaurant workspace.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="h-9.5 rounded-xl bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Rivera"
                      className="h-9.5 rounded-xl bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="restaurant-name">Restaurant or Bar Name</Label>
                  <Input
                    id="restaurant-name"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Bara Bistro & Grill"
                    className="h-9.5 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Work Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@barabistro.rw"
                    className="h-9.5 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="h-9.5 rounded-xl bg-background"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="size-4 rounded accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-muted-foreground cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10.5 rounded-xl bg-[#C85A24] text-white hover:bg-[#B34D1C] font-bold text-xs shadow-md transition-all mt-2"
                >
                  {loading ? "Setting up workspace..." : "Create Account"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full h-9.5 rounded-xl text-xs font-semibold"
                >
                  <svg className="mr-2 size-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center p-6 sm:p-8 pt-0 text-xs text-muted-foreground border-t border-border/50">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="ml-1 font-bold text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
