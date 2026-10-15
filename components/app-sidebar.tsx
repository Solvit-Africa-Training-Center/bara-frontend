"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react"

import { BaraLogo } from "@/components/bara-logo"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRestaurant } from "@/components/restaurant-provider"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Menu",
    url: "/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    url: "/ai-insights",
    icon: Sparkles,
    badge: "AI",
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const { restaurant } = useRestaurant()

  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="p-3 pb-2 border-b border-sidebar-border/60 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-xl p-1 transition-colors hover:bg-sidebar-accent/60 group-data-[collapsible=icon]:justify-center"
        >
          <BaraLogo collapsed={isCollapsed} />
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="p-3 py-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:px-1.5">
        <SidebarMenu className="gap-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url)

            // Dynamic tier gating badges based on runtime restaurant configuration
            let dynamicBadge: string | undefined = item.badge
            let isTierGated = false
            if (item.url === "/reports" && restaurant.plan === "basic") {
              dynamicBadge = "PRO"
              isTierGated = true
            } else if (item.url === "/ai-insights") {
              if (restaurant.plan !== "premium") {
                dynamicBadge = "PREMIUM"
                isTierGated = true
              } else {
                dynamicBadge = "AI"
              }
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={
                    isTierGated
                      ? `${item.title} (${dynamicBadge} Plan Required)`
                      : item.title
                  }
                  render={<Link href={item.url} />}
                  className="relative font-medium group-data-[collapsible=icon]:justify-center"
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="flex-1 truncate">{item.title}</span>
                  {dynamicBadge && !isCollapsed && (
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase shadow-2xs",
                        isTierGated
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {dynamicBadge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Logged in User Avatar at Sidebar Bottom */}
      <SidebarFooter className="p-2 border-t border-sidebar-border/60 group-data-[collapsible=icon]:p-1.5">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}