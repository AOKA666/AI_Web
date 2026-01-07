"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CreemCheckoutButtonProps {
  productId: string
  successUrl?: string
  label?: string
  className?: string
  variant?: "default" | "outline" | "secondary"
  disabled?: boolean
}

export function CreemCheckoutButton({
  productId,
  successUrl,
  label = "Subscribe now",
  className,
  variant = "default",
  disabled = false,
}: CreemCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const origin =
        typeof window !== "undefined" && window.location?.origin
          ? window.location.origin
          : ""

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          successUrl: successUrl || `${origin}/pricing/success`,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create checkout session")
      }

      const redirectUrl = data?.url || data?.checkout_url || data?.checkoutUrl || data?.data?.url
      if (!redirectUrl) {
        throw new Error("Checkout URL is missing in Creem response")
      }

      window.location.href = redirectUrl
    } catch (err: any) {
      setError(err?.message || "Failed to create checkout session")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={isLoading || disabled}
        className={className}
        variant={variant}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting...
          </span>
        ) : (
          label
        )}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
