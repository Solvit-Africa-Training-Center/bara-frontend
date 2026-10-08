"use client"

import * as React from "react"
import { MenuItemStat } from "./types"

interface MenuItemsCardProps {
  title: string
  subtitle: string
  items: MenuItemStat[]
}

export function MenuItemsCard({ title, subtitle, items }: MenuItemsCardProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-[#2C221E] dark:text-[#FAF5EE]">
          {title}
        </h3>
        <p className="text-xs text-[#8C7D73] dark:text-muted-foreground mt-0.5">
          {subtitle}
        </p>

        <div className="mt-4">
          {/* Table header */}
          <div className="grid grid-cols-12 text-[10px] font-semibold tracking-wider text-[#8C7D73] dark:text-muted-foreground uppercase pb-2 border-b border-border/50">
            <span className="col-span-7">MENU ITEM</span>
            <span className="col-span-2 text-right">QTY</span>
            <span className="col-span-3 text-right">SALES · RWF</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/30">
            {items.map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-12 py-2.5 text-xs items-center"
              >
                <span className="col-span-7 font-bold text-[#2C221E] dark:text-[#FAF5EE] truncate">
                  {item.name}
                </span>
                <span className="col-span-2 text-right text-[#8C7D73] dark:text-muted-foreground font-medium">
                  {item.qty}
                </span>
                <span className="col-span-3 text-right font-bold text-[#2C221E] dark:text-[#FAF5EE]">
                  {item.sales}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
