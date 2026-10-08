"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Global layout error:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4 font-sans antialiased">
        <p className="text-xs font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
          Application error
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Something went wrong
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm">
          A critical system error occurred. Please restart the session to continue.
        </p>

        {error.digest && (
          <p className="mt-2 text-[11px] font-mono text-muted-foreground">
            Ref: {error.digest}
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C85A24] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#B34D1C] transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Reload application</span>
          </button>
        </div>
      </body>
    </html>
  )
}
