"use client"

import * as React from "react"
import { ClipboardList, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PredictedRestockItem } from "./types"

export interface PredictedRestockCardProps {
  items: PredictedRestockItem[]
  onCreatePurchaseList: () => void
}

export function PredictedRestockCard({
  items,
  onCreatePurchaseList,
}: PredictedRestockCardProps) {
  return (
    <div className="rounded-[22px] border border-border/70 bg-card p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              Predicted restock
            </h2>
            <p className="text-xs text-[#8C7D73] dark:text-[#A89A90] mt-0.5">
              Suggested quantities for the next 7 days
            </p>
          </div>

          <Button
            size="sm"
            onClick={onCreatePurchaseList}
            className="h-8.5 rounded-xl bg-[#244830] hover:bg-[#1E3B27] text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <ClipboardList className="size-3.5" />
            <span>Create purchase list</span>
          </Button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/70 text-[11px] font-semibold text-[#8C7D73] dark:text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 pl-1 font-semibold">ITEM</th>
                <th className="pb-3 font-semibold">LIKELY RUN-OUT</th>
                <th className="pb-3 font-semibold">SUGGESTED</th>
                <th className="pb-3 text-right pr-1 font-semibold">EST. COST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 pl-1 font-semibold text-[#2C221E] dark:text-foreground">
                    {row.item}
                  </td>
                  <td
                    className={`py-3.5 font-medium ${
                      row.urgent
                        ? "text-[#C53030] dark:text-rose-400"
                        : "text-[#6B5E55] dark:text-muted-foreground"
                    }`}
                  >
                    {row.likelyRunOut}
                  </td>
                  <td className="py-3.5 font-bold text-[#2C221E] dark:text-foreground">
                    {row.suggestedQty}
                  </td>
                  <td className="py-3.5 text-right pr-1 font-semibold text-[#3D352F] dark:text-muted-foreground">
                    {row.estCostFormatted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 flex items-start gap-2 text-[11px] text-[#8C7D73] dark:text-muted-foreground leading-normal">
        <Info className="size-3.5 shrink-0 mt-0.5 text-muted-foreground" />
        <span>
          Predictions use recent sales, recipe quantities and current stock. Confirm supplier pack sizes before ordering.
        </span>
      </div>
    </div>
  )
}
