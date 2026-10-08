"use client"

import * as React from "react"
import Link from "next/link"
import { Home, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [retrying, setRetrying] = React.useState(false)

  React.useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  const handleReset = () => {
    setRetrying(true)
    setTimeout(() => {
      reset()
      setRetrying(false)
    }, 300)
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-xs font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
        500 error
      </p>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        Something went wrong
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm">
        An unexpected error occurred while processing your request. Please try again or return to the dashboard.
      </p>

      {error.digest && (
        <p className="mt-2 text-[11px] font-mono text-muted-foreground">
          Ref: {error.digest}
        </p>
      )}

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          onClick={handleReset}
          disabled={retrying}
          className="h-9 gap-1.5 rounded-xl bg-[#C85A24] hover:bg-[#B34D1C] text-white text-xs font-semibold px-4 shadow-xs"
        >
          <RefreshCw className={cn("size-3.5", retrying && "animate-spin")} />
          <span>{retrying ? "Retrying..." : "Try again"}</span>
        </Button>

        <Button
          variant="outline"
          render={<Link href="/" />}
          className="h-9 gap-1.5 rounded-xl text-xs font-semibold px-4 border-border"
        >
          <Home className="size-3.5" />
          <span>Back to Dashboard</span>
        </Button>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
