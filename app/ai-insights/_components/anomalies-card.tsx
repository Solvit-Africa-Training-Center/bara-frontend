"use client"

import * as React from "react"
import { Ban, CheckCircle2, Droplets } from "lucide-react"
import { AnomalyItem } from "./types"

export interface AnomaliesCardProps {
  anomalies: AnomalyItem[]
  onReviewOil: () => void
  onReviewVoid: () => void
  discountNotice?: string
}

export function AnomaliesCard({
  anomalies,
  onReviewOil,
  onReviewVoid,
  discountNotice = "No unusual discount activity detected this week.",
}: AnomaliesCardProps) {
  return (
    <div className="rounded-[22px] border border-border/70 bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              Anomalies to review
            </h2>
            <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
              Unusual activity compared with your normal pattern
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF0EE] dark:bg-rose-950/40 border border-[#F8D2CC] dark:border-rose-900/50 px-2.5 py-0.5 text-xs font-semibold text-[#C53030] dark:text-rose-300">
            <span className="size-1.5 rounded-full bg-[#C53030]" />
            {anomalies.length} flags
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {anomalies.map((item) => {
            const isOil = item.iconType === "oil"
            const onAction = isOil ? onReviewOil : onReviewVoid

            return (
              <div
                key={item.id}
                className={
                  isOil
                    ? "rounded-xl border border-[#F8D2CC]/80 border-l-4 border-l-[#C53030] bg-[#FDF3F1] dark:bg-rose-950/20 p-4 transition-all"
                    : "rounded-xl border border-[#FBECCB]/80 border-l-4 border-l-[#D97706] bg-[#FEF9EE] dark:bg-amber-950/20 p-4 transition-all"
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg shadow-2xs ${
                        isOil
                          ? "bg-white dark:bg-rose-900/40 text-[#C53030]"
                          : "bg-white dark:bg-amber-900/40 text-[#D97706]"
                      }`}
                    >
                      {isOil ? (
                        <Droplets className="size-4 text-[#C53030]" />
                      ) : (
                        <Ban className="size-4 text-[#D97706]" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                      {item.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                      isOil
                        ? "text-[#C53030] dark:text-rose-400"
                        : "text-[#D97706] dark:text-amber-400"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isOil ? "bg-[#C53030]" : "bg-[#D97706]"
                      }`}
                    />
                    {item.severityLabel}
                  </span>
                </div>

                <p className="mt-2 pl-10 text-xs text-[#6B5E55] dark:text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={onAction}
                  className={`mt-2.5 pl-10 inline-flex items-center gap-1 text-xs font-bold hover:underline cursor-pointer ${
                    isOil
                      ? "text-[#A52A2A] dark:text-rose-300"
                      : "text-[#B45309] dark:text-amber-300"
                  }`}
                >
                  <span>{item.actionLabel}</span>
                  <span>→</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Baseline status banner */}
      <div className="mt-5 rounded-xl border border-[#D5EBD7] dark:border-emerald-900/40 bg-[#EEF7EF] dark:bg-emerald-950/20 p-3 flex items-center gap-2.5">
        <CheckCircle2 className="size-4 text-[#2E7D32] dark:text-emerald-400 shrink-0" />
        <span className="text-xs font-medium text-[#245938] dark:text-emerald-300">
          {discountNotice}
        </span>
      </div>
    </div>
  )
}
