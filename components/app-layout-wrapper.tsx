"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Plus, Search } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (isAuthPage) {
    return (
      <div className="min-h-svh bg-background flex flex-col justify-center items-center p-4 relative">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent md:peer-data-[variant=floating]:m-3 md:peer-data-[variant=floating]:ml-0">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 size-8 rounded-lg hover:bg-muted" />
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-foreground">
                Bara Bistro &amp; Grill
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                • Open Today
              </span>
            </div>
          </div>

          {/* Central Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions, inventory, menu items..."
                className="h-9 w-full rounded-full border border-border bg-card pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground shadow-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Right Actions with Profile Avatar in Top Navbar */}
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex text-xs font-medium text-muted-foreground bg-card px-2.5 py-1 rounded-full border border-border">
              Today, Oct 5, 2026
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              render={<Link href="/transactions" />}
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-[#234D3A] text-white hover:bg-[#1A3B2C] shadow-xs font-medium text-xs px-3"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Record Sale</span>
            </Button>
            <ThemeToggle />
            <div className="h-5 w-px bg-border/80 mx-1 hidden sm:block" />
            <UserNav />
          </div>
        </header>
        <div className="h-[2px] w-full bg-gradient-to-r from-[#C1440E] via-[#E56A1C] via-[#EA982C] via-[#EBA529] to-[#2F5233] opacity-80" />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
