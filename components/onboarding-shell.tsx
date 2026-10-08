import * as React from "react"
import Image from "next/image"
import { HelpCircle } from "lucide-react"

import { LightDiamonds } from "@/components/auth-shell"
import { cn } from "@/lib/utils"

export const onboardingSteps = ["Account", "Restaurant", "Plan", "Payment"]

function HeaderLogo() {
  return (
    <div className="inline-flex w-14 flex-col">
      <div className="flex aspect-[3/2] items-center justify-center rounded-lg bg-[#f7f7f7] p-1.5 shadow-sm">
        <Image
          src="/bara-logo.svg"
          alt="Bara"
          width={154}
          height={108}
          priority
          className="h-full w-full object-contain"
        />
      </div>
      <div className="mt-1 grid grid-cols-3 gap-1">
        <div className="h-[3px] rounded-[1px] bg-[#C1440E]" />
        <div className="h-[3px] rounded-[1px] bg-[#E8A33D]" />
        <div className="h-[3px] rounded-[1px] bg-[#C1440E]" />
      </div>
    </div>
  )
}

/** current = index of the active step (0 = Account ... 3 = Payment) */
export function OnboardingHeader({
  current,
  onStepChange,
}: {
  current: number
  onStepChange: (index: number) => void
}) {
  return (
    <header className="border-b border-[#EFE4D6] bg-[#FFF9F0]/80 backdrop-blur dark:border-[#382C24] dark:bg-[#1E1815]/80">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-8">
        <div>
          <HeaderLogo />
        </div>

        <ol className="flex items-center gap-2 text-xs">
          {onboardingSteps.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStepChange(i)}
                disabled={i === 0}
                aria-current={i === current ? "step" : undefined}
                className="group flex cursor-pointer items-center gap-2 rounded-full py-0.5 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-[#C1440E]"
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                    i <= current
                      ? "bg-[#C1440E] text-white"
                      : "bg-[#EFE4D6] text-[#8F8179] group-hover:bg-[#E4D6C4] dark:bg-[#382C24]"
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "hidden transition-colors sm:inline",
                    i <= current
                      ? "font-semibold text-[#3B2F2A] dark:text-[#FAF3E7]"
                      : "text-[#8F8179] group-hover:text-[#3B2F2A] dark:group-hover:text-[#FAF3E7]"
                  )}
                >
                  {label}
                </span>
              </button>
              {i < onboardingSteps.length - 1 && (
                <span
                  className={cn(
                    "h-px w-5 sm:w-10",
                    i < current
                      ? "bg-[#C1440E]"
                      : "bg-[#E4D6C4] dark:bg-[#3D3028]"
                  )}
                />
              )}
            </li>
          ))}
        </ol>

        <div className="flex justify-end">
          <a
            href="mailto:support@bara.rw"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B2F2A] hover:text-[#C1440E] dark:text-[#E8DDD2]"
          >
            <HelpCircle className="size-3.5 stroke-[1.8]" />
            <span className="hidden sm:inline">Need help?</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export function OnboardingShell({
  current,
  onStepChange,
  children,
}: {
  current: number
  onStepChange: (index: number) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#FAF3E7] dark:bg-[#151210]">
      <LightDiamonds />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <OnboardingHeader current={current} onStepChange={onStepChange} />
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  )
}
