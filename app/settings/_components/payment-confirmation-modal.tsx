"use client"

import * as React from "react"
import { CheckCircle2, DollarSign, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { paymentConfirmationsApi, PaymentConfirmationCreate } from "@/lib/api-client"

interface PaymentConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  subscriptionId: string
  defaultPayerName?: string
  defaultPhone?: string
  onSuccess: (message: string) => void
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  subscriptionId,
  defaultPayerName = "Alex Rivera",
  defaultPhone = "0788123456",
  onSuccess,
}: PaymentConfirmationModalProps) {
  const [payerName, setPayerName] = React.useState(defaultPayerName)
  const [payerPhone, setPayerPhone] = React.useState(defaultPhone)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payerName.trim() || !payerPhone.trim()) return

    setIsSubmitting(true)
    try {
      await paymentConfirmationsApi.submit({
        subscription: subscriptionId,
        payer_name: payerName.trim(),
        payer_phone: payerPhone.trim(),
      })
      onSuccess(
        `Payment verification details submitted for ${payerName.trim()} (${payerPhone.trim()}). Status: Pending verification.`
      )
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Smartphone className="size-3.5" />
            <span>Mobile Money Verification</span>
          </div>
          <DialogTitle className="text-lg font-bold text-[#3B2F2A] dark:text-[#FAF5EE] mt-1">
            Submit Payment Confirmation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Submit your MoMo or bank reference so Bara operations can verify and activate your subscription.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Account / Payer Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Rivera or Restaurant Ltd"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Payer Phone Number (MoMo / Airtel) <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0788123456"
              value={payerPhone}
              onChange={(e) => setPayerPhone(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary tabular-nums"
            />
            <p className="text-[10px] text-muted-foreground">
              The phone number from which the subscription transfer was made.
            </p>
          </div>

          <div className="rounded-xl border border-muted bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground">Bara MoMo Merchant Code:</div>
            <div className="font-mono text-sm font-bold text-primary">*182*8*1*928374#</div>
            <div className="text-[11px]">Bara Technologies Ltd (Kigali, Rwanda)</div>
          </div>

          <DialogFooter className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !payerName.trim() || !payerPhone.trim()}
              className="h-9 px-5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
