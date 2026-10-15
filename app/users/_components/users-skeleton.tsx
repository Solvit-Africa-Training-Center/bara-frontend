"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-5 max-w-[1400px] mx-auto pb-10 w-full animate-in fade-in duration-200">
      {/* 1. Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-52 max-w-full" />
          <Skeleton className="h-4 w-72 max-w-[85%]" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>

      {/* 2. 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Primary Brand Card */}
        <div className="rounded-2xl bg-primary/90 p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <Skeleton className="h-3.5 w-24 bg-white/20" />
          <div className="my-1">
            <Skeleton className="h-8 w-12 bg-white/30" />
          </div>
          <Skeleton className="h-3 w-36 bg-white/20" />
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <Skeleton className="h-3.5 w-20" />
          <div className="my-1">
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-3 w-44" />
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <Skeleton className="h-3.5 w-28" />
          <div className="my-1">
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-3 w-36" />
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
          <Skeleton className="h-3.5 w-24" />
          <div className="my-1">
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* 3. Table Card Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-60" />
          </div>

          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8.5 w-48 sm:w-60 rounded-xl" />
            <Skeleton className="h-8.5 w-28 rounded-xl" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/40 p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 sm:px-5 hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-12">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>

              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="size-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
