"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-5 max-w-[1400px] mx-auto pb-10 w-full animate-in fade-in duration-200">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-[85%]" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>

      {/* 2. 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1 */}
        <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <Skeleton className="h-3.5 w-24" />
          <div className="my-1">
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-3 w-36" />
        </div>

        {/* Card 2 (Brand Highlight) */}
        <div className="rounded-2xl bg-primary/90 p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <Skeleton className="h-3.5 w-28 bg-white/20" />
          <div className="my-1">
            <Skeleton className="h-8 w-16 bg-white/30" />
          </div>
          <Skeleton className="h-3 w-40 bg-white/20" />
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <Skeleton className="h-3.5 w-28" />
          <div className="my-1">
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs flex flex-col justify-between min-h-[110px]">
          <Skeleton className="h-3.5 w-32" />
          <div className="my-1">
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-3 w-44" />
        </div>
      </div>

      {/* 3. Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <Skeleton className="h-8.5 w-36 rounded-xl" />
      </div>

      {/* 4. Table Container Card */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {/* Search & Filters Row */}
        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60">
          <Skeleton className="h-9 w-full max-w-xl rounded-xl" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-36 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="p-2 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl p-3 border border-border/40 hover:bg-muted/10"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="size-9 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-4 w-40 max-w-[70%]" />
                  <Skeleton className="h-3 w-28 max-w-[50%]" />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-8 shrink-0">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-6 w-11 rounded-full" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
