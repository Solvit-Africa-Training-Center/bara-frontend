"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Store,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRestaurant } from "@/components/restaurant-provider"
import { cn } from "@/lib/utils"

export interface NavUserProps {
  user?: {
    name?: string
    email?: string
    avatar?: string
    role?: string
    branch?: string
  }
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"

export function NavUser({ user: override }: NavUserProps) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { restaurant, user: current, switchBranch } = useRestaurant()

  const user = {
    name: override?.name || current.name || "Alex Rivera",
    email: override?.email || current.email,
    avatar: override?.avatar || current.avatar || DEFAULT_AVATAR,
    role: override?.role || current.role || "General Manager",
    branch: override?.branch || restaurant.activeBranch || restaurant.name,
  }
  const initials = current.initials || "AR"

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={user.name}
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:mx-auto"
              />
            }
          >
            <Avatar className="size-8 rounded-full border border-sidebar-border shrink-0 group-data-[collapsible=icon]:flex! overflow-hidden">
              <AvatarImage src={user.avatar} alt={user.name} className="size-full object-cover rounded-full" />
              <AvatarFallback className="rounded-full bg-primary/10 text-primary font-semibold text-xs size-full flex items-center justify-center">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold text-foreground text-xs">{user.name}</span>
              <span className="truncate text-[11px] text-muted-foreground">{user.role}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-xl border border-border bg-card shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal p-2.5">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  {user.email && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                  {user.branch && (
                    <span className="mt-1 inline-block text-[10px] font-medium text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 rounded-md px-1.5 py-0.5 w-fit truncate max-w-full">
                      {user.branch}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Store className="size-3 text-primary" />
                <span>Switch Branch</span>
              </div>
              {restaurant.branches.map((b) => (
                <DropdownMenuItem
                  key={b}
                  onClick={() => switchBranch(b)}
                  className="gap-2 rounded-lg cursor-pointer text-xs"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      b === restaurant.activeBranch
                        ? "bg-emerald-500"
                        : "bg-muted-foreground/30"
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1 truncate",
                      b === restaurant.activeBranch && "font-bold text-foreground"
                    )}
                  >
                    {b.replace(/^Bara\s+/i, "")}
                  </span>
                  {b === restaurant.activeBranch && (
                    <Check className="size-3.5 text-emerald-600 shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/users" />}
                className="gap-2 rounded-lg cursor-pointer text-xs"
              >
                <Users className="size-4" />
                <span>Users &amp; Team Roles</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/settings?tab=billing" />}
                className="gap-2 rounded-lg cursor-pointer text-xs"
              >
                <CreditCard className="size-4" />
                <span>Billing &amp; Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/settings?tab=profile" />}
                className="gap-2 rounded-lg cursor-pointer text-xs"
              >
                <Settings className="size-4" />
                <span>Restaurant Profile &amp; Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 rounded-lg cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}