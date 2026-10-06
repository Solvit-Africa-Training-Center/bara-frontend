"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, LogOut, Settings, Store, User } from "lucide-react"

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
import { Button } from "@/components/ui/button"

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 pl-1 pr-2 py-1 h-8 rounded-full hover:bg-muted/70 transition-colors"
          />
        }
      >
        <Avatar className="size-7 rounded-full border border-border">
          <AvatarImage
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Alex Rivera"
          />
          <AvatarFallback className="rounded-full bg-primary/10 text-primary font-semibold text-xs">
            AR
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col text-left leading-none">
          <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
            Alex Rivera
          </span>
          <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
            Manager
          </span>
        </div>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-xl border border-border bg-card shadow-lg"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-foreground">
                Alex Rivera
              </p>
              <p className="text-xs text-muted-foreground">
                alex.rivera@barabistro.com
              </p>
              <span className="mt-1 inline-block text-[10px] font-medium text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 rounded-md px-1.5 py-0.5 w-fit">
                Bara Bistro & Grill
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="gap-2 rounded-lg cursor-pointer"
          >
            <Store className="size-4" />
            <span>Switch Branch</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="gap-2 rounded-lg cursor-pointer"
          >
            <User className="size-4" />
            <span>Profile &amp; Roles</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="gap-2 rounded-lg cursor-pointer"
          >
            <Settings className="size-4" />
            <span>Restaurant Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/login" />}
          className="gap-2 rounded-lg cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
