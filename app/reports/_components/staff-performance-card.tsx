"use client"

import * as React from "react"
import { StaffStat } from "./types"

interface StaffPerformanceCardProps {
  staffList: StaffStat[]
  totalOrdersFormatted?: string
  totalSalesFormatted?: string
}

export function StaffPerformanceCard({
  staffList,
  totalOrdersFormatted = "1,080",
  totalSalesFormatted = "8,640,000",
}: StaffPerformanceCardProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
          Staff performance
        </h3>
        <p className="text-xs text-[#8C7D73] dark:text-muted-foreground mt-0.5">
          Completed orders attributed to each staff member
        </p>

        <div className="mt-4">
          {/* Table header */}
          <div className="grid grid-cols-12 text-[10px] font-semibold tracking-wider text-[#8C7D73] dark:text-muted-foreground uppercase pb-2 border-b border-border/50">
            <span className="col-span-6">STAFF</span>
            <span className="col-span-2 text-right">ORDERS</span>
            <span className="col-span-4 text-right">SALES · RWF</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/30">
            {staffList.map((staff) => (
              <div
                key={staff.name}
                className="grid grid-cols-12 py-2.5 text-xs items-center"
              >
                <span className="col-span-6 font-bold text-[#2C221E] dark:text-[#FAF5EE] truncate">
                  {staff.name}
                </span>
                <span className="col-span-2 text-right text-[#8C7D73] dark:text-muted-foreground font-medium">
                  {staff.orders}
                </span>
                <span className="col-span-4 text-right font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  {staff.sales}
                </span>
              </div>
            ))}
          </div>

          {/* Total row matching Figma */}
          <div className="grid grid-cols-12 pt-3 mt-1 text-xs items-center border-t border-border/80">
            <span className="col-span-6 font-bold text-[#234D3A] dark:text-emerald-400">
              Total
            </span>
            <span className="col-span-2 text-right font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              {totalOrdersFormatted}
            </span>
            <span className="col-span-4 text-right font-bold text-[#2C221E] dark:text-[#FAF5EE]">
              {totalSalesFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
