"use client"

import * as React from "react"
import Link from "next/link"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ErrorCode = "404" | "500" | "403" | "401" | "503"

interface ErrorItem {
  code: ErrorCode
  label: string
  title: string
  description: string
  color: string
  primaryAction: {
    label: string
    href: string
  }
}

const ERRORS: Record<ErrorCode, ErrorItem> = {
  "404": {
    code: "404",
    label: "404 error",
    title: "Page not found",
    description: "Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.",
    color: "text-[#C85A24]",
    primaryAction: {
      label: "Back to Dashboard",
      href: "/",
    },
  },
  "500": {
    code: "500",
    label: "500 error",
    title: "Something went wrong",
    description: "An unexpected server error occurred while processing your request. Please try again.",
    color: "text-red-600 dark:text-red-400",
    primaryAction: {
      label: "Back to Dashboard",
      href: "/",
    },
  },
  "403": {
    code: "403",
    label: "403 error",
    title: "Access denied",
    description: "You don't have permission to view this section. Manager authorization is required.",
    color: "text-amber-600 dark:text-amber-400",
    primaryAction: {
      label: "Go to Users & Team",
      href: "/users",
    },
  },
  "401": {
    code: "401",
    label: "401 error",
    title: "Session expired",
    description: "Your shift session has expired. Please log back in to continue.",
    color: "text-blue-600 dark:text-blue-400",
    primaryAction: {
      label: "Log in again",
      href: "/login",
    },
  },
  "503": {
    code: "503",
    label: "503 error",
    title: "Service temporarily unavailable",
    description: "Bara is briefly undergoing scheduled maintenance. Please check back in a moment.",
    color: "text-stone-600 dark:text-stone-400",
    primaryAction: {
      label: "Back to Dashboard",
      href: "/",
    },
  },
}

export default function ErrorCodesPage() {
  const [selected, setSelected] = React.useState<ErrorCode>("404")
  const active = ERRORS[selected]

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto py-8">
      {/* Segmented Code Switcher */}
      <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card p-1 shadow-2xs">
        {(Object.keys(ERRORS) as ErrorCode[]).map((code) => (
          <button
            key={code}
            onClick={() => setSelected(code)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              selected === code
                ? "bg-[#C85A24] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {code}
          </button>
        ))}
      </div>

      {/* Simple Error Preview */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 mt-6">
        <p className={cn("text-xs font-bold tracking-wider uppercase", active.color)}>
          {active.label}
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {active.title}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm">
          {active.description}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            render={<Link href={active.primaryAction.href} />}
            className="h-9 gap-1.5 rounded-xl bg-[#C85A24] hover:bg-[#B34D1C] text-white text-xs font-semibold px-4 shadow-xs"
          >
            <Home className="size-3.5" />
            <span>{active.primaryAction.label}</span>
          </Button>

          <Button
            variant="outline"
            render={<Link href="/menu" />}
            className="h-9 gap-1.5 rounded-xl text-xs font-semibold px-4 border-border"
          >
            <span>Open Menu</span>
          </Button>
        </div>

        <div className="mt-10">
          <Link
            href="/this-page-does-not-exist"
            className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Trigger real 404 page &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
