"use client"

import * as React from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { PresetQuestion, ChatMessage } from "./types"

export interface AskBaraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  presets: PresetQuestion[]
  initialPrompt?: string
  restaurantName?: string
}

export function AskBaraDialog({
  open,
  onOpenChange,
  presets,
  initialPrompt,
  restaurantName = "Bara Bistro",
}: AskBaraDialogProps) {
  const [activeQuestion, setActiveQuestion] = React.useState<string>(
    initialPrompt || presets[0]?.question || ""
  )
  const [customInput, setCustomInput] = React.useState("")
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([])

  React.useEffect(() => {
    if (open) {
      const targetQuery = initialPrompt || presets[0]?.question
      if (targetQuery) {
        setActiveQuestion(targetQuery)
        const matched = presets.find((p) => p.question === targetQuery)
        if (matched) {
          setChatHistory([
            { role: "user", text: matched.question },
            { role: "bara", text: matched.answer, bullets: matched.bullets },
          ])
        } else {
          setChatHistory([
            { role: "user", text: targetQuery },
            {
              role: "bara",
              text: `Analyzing live POS records and supplier bills for "${targetQuery}"... Based on current week data, margin performance remains healthy with localized food cost alerts on cooking oil and beef tenderloin.`,
            },
          ])
        }
      }
    }
  }, [open, initialPrompt, presets])

  const handleSelectPreset = (preset: PresetQuestion) => {
    setActiveQuestion(preset.question)
    setChatHistory((prev) => [
      ...prev,
      { role: "user", text: preset.question },
      { role: "bara", text: preset.answer, bullets: preset.bullets },
    ])
  }

  const handleSendCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!customInput.trim()) return

    const query = customInput.trim()
    setCustomInput("")
    const matched = presets.find(
      (p) => p.question.toLowerCase() === query.toLowerCase()
    )

    setChatHistory((prev) => [
      ...prev,
      { role: "user", text: query },
      matched
        ? { role: "bara", text: matched.answer, bullets: matched.bullets }
        : {
            role: "bara",
            text: `I've cross-referenced 486 recent orders and inventory logs for "${query}". Operations are performing within standard thresholds for ${restaurantName}. Monitor Tilapia fillet restock tomorrow at 14:00 to prevent stock-outs.`,
          },
    ])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#B84218] text-white shadow-2xs">
              <Sparkles className="size-4.5 fill-current" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Ask Bara Assistant
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Live operational AI grounded in your sales tickets, stock logs &amp; menu recipes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Question Pills */}
        <div className="py-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Common Practical Questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((q) => (
              <button
                key={q.question}
                type="button"
                onClick={() => handleSelectPreset(q)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs text-left transition-colors border",
                  activeQuestion === q.question
                    ? "border-[#B84218] bg-[#B84218]/10 text-[#B84218] font-semibold"
                    : "border-border/70 hover:bg-muted text-muted-foreground"
                )}
              >
                {q.question}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 my-2 max-h-[340px] overflow-y-auto pr-1">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "bara" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#244830] text-white">
                  <Sparkles className="size-3.5 fill-current" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl p-3.5 text-xs max-w-[85%] leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#B84218] text-white font-medium ml-8"
                    : "bg-muted/70 text-foreground border border-border/60"
                )}
              >
                <p>{msg.text}</p>
                {msg.bullets && (
                  <ul className="mt-2.5 space-y-1.5 list-disc pl-4 text-xs text-muted-foreground">
                    {msg.bullets.map((b, bi) => (
                      <li key={bi} className="text-foreground">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendCustom}
          className="flex items-center gap-2 pt-2 border-t border-border/60"
        >
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask a question about food costs, sales rushes, or inventory..."
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B84218]"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!customInput.trim()}
            className="h-8.5 rounded-xl bg-[#B84218] hover:bg-[#A03814] text-white px-3 text-xs font-semibold gap-1"
          >
            <Send className="size-3.5" />
            <span>Ask</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
