"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export default function InventoryPage() {
  const router = useRouter()

  React.useEffect(() => {
    router.replace("/menu")
  }, [router])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground">Redirecting to Menu &amp; Recipes...</span>
      </div>
    </div>
  )
}
