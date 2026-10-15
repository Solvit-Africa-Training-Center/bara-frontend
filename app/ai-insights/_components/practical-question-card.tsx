"use client"

import * as React from "react"
import { Lightbulb, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface PracticalQuestionCardProps {
  questionText?: string
  onAskBara: (question?: string) => void
}

export function PracticalQuestionCard({
  questionText = "Which menu items have rising costs but flat sales?",
  onAskBara,
}: PracticalQuestionCardProps) {
  return (
    <div className="rounded-[22px] border border-[#F6E1CC] dark:border-amber-900/40 bg-[#FDF4EA] dark:bg-[#2A231C]/60 p-5.5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="size-7 flex items-center justify-start text-[#D97706] dark:text-amber-400">
          <Lightbulb className="size-5" />
        </div>
        <h3 className="mt-1 text-sm sm:text-base font-bold text-[#2C221E] dark:text-amber-100">
          Ask a practical question
        </h3>

        <p className="mt-2 text-xs italic leading-relaxed text-[#735A47] dark:text-amber-200/80">
          “{questionText}”
        </p>
      </div>

      <Button
        size="sm"
        onClick={() => onAskBara(questionText)}
        className="mt-4 h-8.5 w-fit rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-3.5 gap-1.5 shadow-xs"
      >
        <Sparkles className="size-3.5 fill-current" />
        <span>Ask Bara</span>
      </Button>
    </div>
  )
}
