"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Sparkles,
} from "lucide-react"

import { BaraLogo } from "@/components/bara-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Daily Transactions",
    url: "/transactions",
    icon: ReceiptText,
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
    title: "Inventory",
    url: "/inventory",
    icon: Boxes,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="p-3 pb-2 border-b border-sidebar-border/60 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-sidebar-accent/60 group-data-[collapsible=icon]:justify-center"
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

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                  className="relative font-medium group-data-[collapsible=icon]:justify-center"
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && !isCollapsed && (
                    <span className="rounded-md bg-[#234D3A] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white dark:bg-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}