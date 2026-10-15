"use client"

import * as React from "react"
import { Check, Save, Settings, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface SettingsHeaderProps {
  restaurantName: string
  planName: string
  onSave?: () => void
  isSaving?: boolean
}

export function SettingsHeader({
  restaurantName,
  planName,
  onSave,
  isSaving = false,
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Settings className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-foreground">
              {restaurantName} Settings
            </h1>
            <Badge
              variant="success"
              className="gap-1 rounded-full text-[10px] font-bold py-0.5"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Synced
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your restaurant profile, kitchen food cost margins, and subscription.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-center">
        {/* Tier badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 shadow-2xs">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="capitalize">{planName} Plan</span>
        </div>

        {onSave && (
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="h-8.5 gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 shadow-xs"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
