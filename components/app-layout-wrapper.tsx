"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useRestaurant } from "@/components/restaurant-provider"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { restaurant } = useRestaurant()
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/setup" ||
    pathname === "/onboarding"

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        {children}
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent md:peer-data-[variant=floating]:m-3 md:peer-data-[variant=floating]:ml-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/90 px-3 md:px-5 backdrop-blur-md">
          {/* Left: Trigger & Restaurant Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <SidebarTrigger className="-ml-1 size-8 rounded-lg hover:bg-muted" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[150px] sm:max-w-none">
                {restaurant.name}
              </span>
              {restaurant.activeBranch && (
                <span className="hidden md:inline-flex items-center rounded-md bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/60 truncate max-w-[160px]">
                  {restaurant.activeBranch.replace(/^Bara\s+/i, "")}
                </span>
              )}
            </div>
          </div>

          {/* Central Search Bar - Compact & Responsive for Laptop Viewports */}
          <div className="hidden sm:flex flex-1 max-w-[220px] md:max-w-xs lg:max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ledger, inventory, menu..."
                className="h-8.5 w-full rounded-full border border-border bg-card pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Right Actions: Streamlined for all screen sizes */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>

            <ThemeToggle />
          </div>
        </header>

        {/* Brand Multi-color Accent Bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#C1440E] via-[#E56A1C] via-[#EA982C] via-[#EBA529] to-[#2F5233] opacity-80" />

        <main className="flex-1 p-3 md:p-5 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
