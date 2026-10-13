"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSkeletonProps {
  hideOperationsBar?: boolean
}

export function DashboardSkeleton({ hideOperationsBar = false }: DashboardSkeletonProps) {
  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-10 w-full animate-in fade-in duration-200">
      {/* 1. Operations Bar Skeleton */}
      {!hideOperationsBar && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-72 max-w-[80%]" />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shadow-2xs">
              <Skeleton className="h-6 w-14 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-18 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-8.5 w-28 rounded-xl" />
          </div>
        </div>
      )}

      {/* 2. Critical Ingredients Alert Skeleton */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-lg bg-amber-500/20" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-52 bg-amber-500/20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28 rounded-md bg-amber-500/10" />
                <Skeleton className="h-4 w-32 rounded-md bg-amber-500/10" />
                <Skeleton className="h-4 w-24 rounded-md bg-amber-500/10" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-44 rounded-xl self-end sm:self-auto bg-amber-500/20" />
        </div>
      </div>

      {/* 3. 4 Top KPI Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Highlight Forest Green Card */}
        <div className="rounded-2xl bg-[#234D3A] p-4 text-white shadow-xs flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 bg-white/20" />
            <Skeleton className="h-5 w-16 rounded-full bg-white/20" />
          </div>
          <div className="my-2">
            <Skeleton className="h-8 w-40 bg-white/30" />
          </div>
          <Skeleton className="h-3 w-48 bg-white/20" />
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="my-2">
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-3 w-44" />
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="my-2">
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-3 w-44" />
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between min-h-[125px]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="my-2">
            <Skeleton className="h-8 w-36" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* 4. Recent Transactions Feed Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Skeleton className="h-4.5 w-36" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Top Menu Performers Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Skeleton className="h-4.5 w-44" />
            <Skeleton className="h-3 w-60" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border/50 p-2.5"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                <Skeleton className="size-6 rounded-md shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-2 w-full max-w-[200px] rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Middle Grid: Kitchen Waste Alerts + Consumables Spend */}
      <div className="grid gap-5 lg:grid-cols-2 items-stretch">
        {/* Waste Alerts Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4.5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2.5">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border/60 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-7 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consumables Spend Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4.5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
