"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function AIInsightsSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-[1360px] mx-auto pb-12 w-full animate-in fade-in duration-200">
      {/* 1. Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-56 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-[85%]" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>

      {/* 2. Weekly Summary Hero Card Skeleton */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-2xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>

        {/* Hero KPI highlight grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Narrative bullet lines */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>

      {/* 3. Middle Section: Anomalies & Restock (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Anomalies Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-56" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-border/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4.5 w-36" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-3.5 w-full" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-7 w-28 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predicted Restock Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-60" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-border/60 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-xl" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: 3 equal cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4.5 w-36" />
                <Skeleton className="size-7 rounded-xl" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
