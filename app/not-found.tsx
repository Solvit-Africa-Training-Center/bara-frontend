import Link from "next/link"
import { Home, UtensilsCrossed } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-xs font-bold tracking-wider text-primary uppercase">
        404 error
      </p>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        Page not found
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          render={<Link href="/" />}
          className="h-9 gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 shadow-xs"
        >
          <Home className="size-3.5" />
          <span>Back to Dashboard</span>
        </Button>

        <Button
          variant="outline"
          render={<Link href="/menu" />}
          className="h-9 gap-1.5 rounded-xl text-xs font-semibold px-4 border-border"
        >
          <UtensilsCrossed className="size-3.5" />
          <span>Open Menu</span>
        </Button>
      </div>
    </div>
  )
}
