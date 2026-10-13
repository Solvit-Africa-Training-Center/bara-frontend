"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-in fade-in duration-200">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-60 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-[85%]" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      {/* 2. Tabs Selector Skeleton */}
      <div className="flex items-center gap-2 p-1 bg-muted/80 rounded-2xl w-full sm:w-fit border border-border/60">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      {/* 3. Settings Form Card Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
        {/* Section 1 */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-72" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Section 2 */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-80" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border/60 flex justify-end">
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
