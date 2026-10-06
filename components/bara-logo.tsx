import * as React from "react"
import { cn } from "@/lib/utils"

export function BaraLogo({
  className,
  collapsed = false,
}: {
  className?: string
  collapsed?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="shrink-0 flex items-center justify-center">
        <svg
          width="36"
          height="30"
          viewBox="0 0 70 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-8 transition-transform hover:scale-105"
        >
          <rect y="29.5" width="12" height="15" rx="4" fill="#C1440E" />
          <rect x="16" y="19" width="14" height="25" rx="4" fill="#E56A1C" />
          <rect x="34" y="10" width="14" height="35" rx="4" fill="#EA982C" />
          <rect x="52" width="14" height="45" rx="4" fill="#EBA529" />
          <rect y="52.9118" width="51" height="4" rx="2" fill="#3B2F2A" />
          <path
            d="M68.0752 45.5C68.3204 45.5 68.5561 45.6004 68.7295 45.7783C68.9026 45.9562 69 46.1977 69 46.4492C68.9999 46.7007 68.9028 46.9423 68.7295 47.1201L68.7275 47.1182L58.8848 57.2217C58.7991 57.3099 58.6971 57.3799 58.585 57.4277C58.4728 57.4755 58.3519 57.5 58.2305 57.5C58.1092 57.5 57.989 57.4755 57.877 57.4277C57.7648 57.38 57.6629 57.3099 57.5771 57.2217L53.2705 52.8008C53.1848 52.7127 53.1167 52.6081 53.0703 52.4932C53.0239 52.3781 53 52.2544 53 52.1299C53.0001 52.0055 53.024 51.8825 53.0703 51.7676C53.1168 51.6525 53.1847 51.5471 53.2705 51.459C53.3562 51.371 53.4583 51.3016 53.5703 51.2539C53.6825 51.2062 53.8034 51.1816 53.9248 51.1816C54.0461 51.1817 54.1663 51.2063 54.2783 51.2539C54.3903 51.3016 54.4924 51.371 54.5781 51.459L58.2314 55.209L67.4219 45.7783C67.5951 45.6005 67.8302 45.5001 68.0752 45.5Z"
            fill="#2F5233"
            stroke="#2F5233"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="flex flex-col text-left leading-none">
          <span className="text-xl font-black tracking-tight text-[#3B2F2A] dark:text-[#FAF5EE]">
            Bara
          </span>
          <span className="mt-1 text-[9px] font-bold tracking-widest uppercase text-[#8C7D73] dark:text-[#A89A90]">
            Restaurant Mgmt
          </span>
        </div>
      )}
    </div>
  )
}
