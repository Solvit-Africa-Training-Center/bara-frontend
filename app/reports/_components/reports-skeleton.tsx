"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ReportsSkeletonProps {
  includeHeaderAndFilters?: boolean
}

export function ReportsSkeleton({ includeHeaderAndFilters = false }: ReportsSkeletonProps) {
  return (
    <div className="flex flex-col gap-5 w-full max-w-[1400px] mx-auto pb-10 animate-in fade-in duration-200">
      {/* Optional Full Header & Filter Bar Skeleton for loading.tsx */}
      {includeHeaderAndFilters && (
        <>
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-8 w-32 max-w-full" />
              <Skeleton className="h-4 w-64 max-w-[85%]" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="size-8 rounded-xl" />
            </div>
          </div>

          {/* Filter Bar Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="inline-flex items-center gap-1 rounded-xl bg-muted/40 p-1 self-start">
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-4 w-20 hidden xs:block" />
              <Skeleton className="h-8 w-44 rounded-xl" />
            </div>
          </div>
        </>
      )}

      {/* 1. 4 Top KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Card 1 Skeleton (Highlight Forest Green Card) */}
        <div className="rounded-2xl bg-[#234D3A] p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <Skeleton className="h-3.5 w-20 bg-white/20" />
          <div className="my-2">
            <Skeleton className="h-7 sm:h-8 w-44 max-w-[85%] bg-white/30" />
          </div>
          <Skeleton className="h-3 w-52 max-w-[90%] bg-white/20" />
        </div>

        {/* Card 2 Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <Skeleton className="h-3.5 w-28 max-w-[70%]" />
          <div className="my-2">
            <Skeleton className="h-7 sm:h-8 w-24 max-w-[60%]" />
          </div>
          <Skeleton className="h-3 w-44 max-w-[85%]" />
        </div>

        {/* Card 3 Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <Skeleton className="h-3.5 w-32 max-w-[70%]" />
          <div className="my-2">
            <Skeleton className="h-7 sm:h-8 w-32 max-w-[65%]" />
          </div>
          <Skeleton className="h-3 w-44 max-w-[85%]" />
        </div>

        {/* Card 4 Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <Skeleton className="h-3.5 w-36 max-w-[75%]" />
          <div className="my-2">
            <Skeleton className="h-7 sm:h-8 w-36 max-w-[70%]" />
          </div>
          <Skeleton className="h-3 w-48 max-w-[90%]" />
        </div>
      </div>

      {/* 2. Middle Row: Sales Trend (Linear Area) & Consumables Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        {/* Sales Trend Skeleton */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[340px]">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3.5 w-56 max-w-full" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full shrink-0" />
            </div>

            {/* Fluid Chart Skeleton with horizontal gridlines & area wave */}
            <div className="mt-4 w-full h-[230px] rounded-xl bg-muted/20 border border-border/30 p-3 flex flex-col justify-between relative overflow-hidden">
              {/* Horizontal grid guide lines */}
              <div className="space-y-10 w-full pt-1">
                <div className="flex items-center justify-between border-b border-border/30 pb-1">
                  <Skeleton className="h-2.5 w-6" />
                  <div className="flex-1 ml-2 border-b border-dashed border-border/40" />
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-1">
                  <Skeleton className="h-2.5 w-6" />
                  <div className="flex-1 ml-2 border-b border-dashed border-border/40" />
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-1">
                  <Skeleton className="h-2.5 w-6" />
                  <div className="flex-1 ml-2 border-b border-dashed border-border/40" />
                </div>
              </div>

              {/* Responsive SVG area curve simulation */}
              <div className="absolute inset-x-8 bottom-8 top-12 opacity-30 pointer-events-none">
                <svg
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                  className="w-full h-full text-primary"
                >
                  <path
                    d="M0,120 L40,110 L80,135 L120,95 L160,75 L200,60 L240,65 L280,105 L320,90 L360,50 L400,60 L440,30 L470,70 L500,65 L500,150 L0,150 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0,120 L40,110 L80,135 L120,95 L160,75 L200,60 L240,65 L280,105 L320,90 L360,50 L400,60 L440,30 L470,70 L500,65"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* X-axis tick skeletons */}
              <div className="flex justify-between w-full pt-2 z-10 px-6">
                <Skeleton className="h-2.5 w-8" />
                <Skeleton className="h-2.5 w-8" />
                <Skeleton className="h-2.5 w-9 hidden xs:block" />
                <Skeleton className="h-2.5 w-9" />
                <Skeleton className="h-2.5 w-9" />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2 flex items-center gap-2 text-xs">
            <Skeleton className="h-0.5 w-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-56 max-w-[80%]" />
          </div>
        </div>

        {/* Consumables Breakdown Skeleton */}
        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[340px]">
          <div>
            <Skeleton className="h-5 w-40" />
            <div className="mt-2 flex items-center justify-between">
              <Skeleton className="h-7 sm:h-8 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            {/* Responsive breakdown bars */}
            <div className="mt-5 space-y-4">
              {[
                { labelW: "w-16 sm:w-20", barPct: "w-[75%]", valW: "w-14" },
                { labelW: "w-20 sm:w-24", barPct: "w-[53%]", valW: "w-14" },
                { labelW: "w-24 sm:w-28", barPct: "w-[35%]", valW: "w-12" },
                { labelW: "w-28 sm:w-32", barPct: "w-[18%]", valW: "w-12" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-3 text-xs w-full">
                  <Skeleton className={`h-3.5 ${item.labelW} shrink-0`} />
                  <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden min-w-[60px]">
                    <div className={`h-full rounded-full bg-primary/20 ${item.barPct}`} />
                  </div>
                  <Skeleton className={`h-3.5 ${item.valW} shrink-0 text-right`} />
                </div>
              ))}
            </div>
          </div>

          {/* Footnote */}
          <Skeleton className="mt-6 pt-3 h-3 w-full max-w-sm" />
        </div>
      </div>

      {/* 3. Bottom Row: 3 Tables Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Table 1: Top 5 menu items Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[290px]">
          <div>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-44 mt-1" />

            <div className="mt-4">
              {/* Header */}
              <div className="grid grid-cols-12 pb-2 border-b border-border/50 items-center">
                <Skeleton className="col-span-7 h-2.5 w-20" />
                <div className="col-span-2 flex justify-end">
                  <Skeleton className="h-2.5 w-6" />
                </div>
                <div className="col-span-3 flex justify-end">
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/30">
                {[
                  { nameW: "w-24 sm:w-28", valW: "w-16" },
                  { nameW: "w-28 sm:w-32", valW: "w-16" },
                  { nameW: "w-24 sm:w-30", valW: "w-16" },
                  { nameW: "w-20 sm:w-26", valW: "w-16" },
                  { nameW: "w-24 sm:w-28", valW: "w-14" },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 py-2.5 items-center">
                    <Skeleton className={`col-span-7 h-3.5 ${row.nameW} max-w-[90%]`} />
                    <div className="col-span-2 flex justify-end">
                      <Skeleton className="h-3.5 w-6" />
                    </div>
                    <div className="col-span-3 flex justify-end">
                      <Skeleton className={`h-3.5 ${row.valW}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table 2: Bottom 5 menu items Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[290px]">
          <div>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-44 mt-1" />

            <div className="mt-4">
              {/* Header */}
              <div className="grid grid-cols-12 pb-2 border-b border-border/50 items-center">
                <Skeleton className="col-span-7 h-2.5 w-20" />
                <div className="col-span-2 flex justify-end">
                  <Skeleton className="h-2.5 w-6" />
                </div>
                <div className="col-span-3 flex justify-end">
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/30">
                {[
                  { nameW: "w-20 sm:w-24", valW: "w-12" },
                  { nameW: "w-24 sm:w-28", valW: "w-12" },
                  { nameW: "w-28 sm:w-32", valW: "w-14" },
                  { nameW: "w-20 sm:w-24", valW: "w-14" },
                  { nameW: "w-24 sm:w-28", valW: "w-14" },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 py-2.5 items-center">
                    <Skeleton className={`col-span-7 h-3.5 ${row.nameW} max-w-[90%]`} />
                    <div className="col-span-2 flex justify-end">
                      <Skeleton className="h-3.5 w-6" />
                    </div>
                    <div className="col-span-3 flex justify-end">
                      <Skeleton className={`h-3.5 ${row.valW}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table 3: Staff performance Skeleton */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between min-h-[290px]">
          <div>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-56 max-w-full mt-1" />

            <div className="mt-4">
              {/* Header */}
              <div className="grid grid-cols-12 pb-2 border-b border-border/50 items-center">
                <Skeleton className="col-span-6 h-2.5 w-14" />
                <div className="col-span-2 flex justify-end">
                  <Skeleton className="h-2.5 w-10" />
                </div>
                <div className="col-span-4 flex justify-end">
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/30">
                {[
                  { nameW: "w-28 sm:w-32", valW: "w-16" },
                  { nameW: "w-24 sm:w-28", valW: "w-16" },
                  { nameW: "w-24 sm:w-28", valW: "w-16" },
                  { nameW: "w-20 sm:w-24", valW: "w-16" },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 py-2.5 items-center">
                    <Skeleton className={`col-span-6 h-3.5 ${row.nameW} max-w-[90%]`} />
                    <div className="col-span-2 flex justify-end">
                      <Skeleton className="h-3.5 w-7" />
                    </div>
                    <div className="col-span-4 flex justify-end">
                      <Skeleton className={`h-3.5 ${row.valW}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total row */}
              <div className="grid grid-cols-12 pt-3 mt-1 items-center border-t border-border/80">
                <Skeleton className="col-span-6 h-4 w-12" />
                <div className="col-span-2 flex justify-end">
                  <Skeleton className="h-4 w-9" />
                </div>
                <div className="col-span-4 flex justify-end">
                  <Skeleton className="h-4 w-18" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Audit Banner Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs w-full">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Skeleton className="size-4 rounded-full shrink-0" />
          <Skeleton className="h-3.5 flex-1 max-w-md w-full" />
        </div>
        <Skeleton className="h-4 w-28 shrink-0 self-start sm:self-auto" />
      </div>
    </div>
  )
}
